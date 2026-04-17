from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model

from .models import Resume
from .utils import (
    extract_text_from_pdf,
    calculate_resume_score,
    extract_resume_features
)
from .serializers import ResumeSerializer

import joblib
import os


# =========================================================
# Model Loading
# =========================================================

MODEL_PATH = os.path.join(os.path.dirname(__file__), "resume_quality_model.pkl")

model = None
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)

User = get_user_model()

ALLOWED_EXTENSIONS = ['.pdf']
MAX_FILE_SIZE = 2 * 1024 * 1024  # 2MB

# =========================================================
# Smart Suggestions
# =========================================================

def generate_suggestions(features, missing_skills):

    suggestions = []

    skill_count = features.get("skill_count", 0)
    project_count = features.get("project_count", 0)
    experience = features.get("experience", 0)

    # Skill Suggestions
    if skill_count < 5:
        suggestions.append(
            "Add more relevant technical skills to match the job role requirements."
        )
    elif skill_count < 8:
        suggestions.append(
            "Try to include advanced tools, frameworks, or cloud technologies."
        )

    # Missing Skills
    if missing_skills:
        suggestions.append(
            "Consider adding these missing skills: " + ", ".join(missing_skills)
        )

    # Project Suggestions
    if project_count == 0:
        suggestions.append(
            "Add at least 2–3 projects to showcase your practical knowledge."
        )
    elif project_count < 3:
        suggestions.append(
            "Include more projects with clear descriptions and technologies used."
        )

    # Experience Suggestions
    if experience == 0:
        suggestions.append(
            "Add internships or practical experience to strengthen your resume."
        )

    # General Suggestions
    suggestions.append(
        "Use action verbs like Developed, Built, Designed to describe your work."
    )
    suggestions.append(
        "Add measurable results like 'Improved performance by 20%' for impact."
    )
    if features.get("resume_length", 0) < 300:
        suggestions.append("Increase resume content. Add more details about your work.")

    if features.get("section_score", 0) < 3:
        suggestions.append("Ensure your resume has proper sections like Education, Skills, and Projects.")
    return suggestions


# =========================================================
# Resume Upload API (MAIN LOGIC)
# =========================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def resume_upload_api(request):
    file = request.FILES.get('file')

    # ❌ No file
    if not file:
        return Response(
            {"error": "No file uploaded"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ❌ File size check
    if file.size > MAX_FILE_SIZE:
        return Response(
            {"error": "File too large (max 2MB)"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ❌ File type check
    ext = os.path.splitext(file.name)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return Response(
            {"error": "Only PDF files allowed"},
            status=status.HTTP_400_BAD_REQUEST
        )
    serializer = ResumeSerializer(data=request.data)

    if serializer.is_valid():

        resume = serializer.save(user=request.user)

        try:
            # -------------------------------
            # 1. Extract Text
            # -------------------------------
            text = extract_text_from_pdf(resume.file.path)

            # -------------------------------
            # 2. ATS Score
            # -------------------------------
            score, found, missing = calculate_resume_score(
                text,
                resume.job_role
            )

            # -------------------------------
            # 3. Feature Extraction
            # -------------------------------
            features = extract_resume_features(text, resume.job_role)

            skill_count = int(features.get("skill_count", 0))
            project_count = int(features.get("project_count", 0))
            experience = int(features.get("experience", 0))

            X = [[
                features.get("skill_count", 0),
                features.get("project_count", 0),
                features.get("experience", 0),
                features.get("resume_length", 0),
                features.get("keyword_density", 0),
                features.get("section_score", 0)
            ]]

            # -------------------------------
            # 4. ML Prediction
            # -------------------------------
            predicted_quality = "Moderate"

            if model is not None:
                prediction = model.predict(X)[0]

                quality_map = {
                    0: "Weak",
                    1: "Moderate",
                    2: "Strong"
                }

                predicted_quality = quality_map.get(
                    int(prediction),
                    "Moderate"
                )

            # -------------------------------
            # 5. Score Adjustment
            # -------------------------------
            ml_weight = {
                "Weak": 0.8,
                "Moderate": 1.0,
                "Strong": 1.2
            }

            final_score = int(score * ml_weight.get(predicted_quality, 1.0))

            if final_score > 100:
                final_score = 100

            # -------------------------------
            # 6. Suggestions
            # -------------------------------
            suggestions = generate_suggestions(features, missing)

            # -------------------------------
            # 7. Save Results
            # -------------------------------
            resume.score = final_score
            resume.matched_keywords = ", ".join(found)
            resume.save()

            # -------------------------------
            # 8. Response
            # -------------------------------
            return Response(
                {
                    "status": "success",
                    "data": {
                        **ResumeSerializer(
                            resume,
                            context={'missing': missing}
                        ).data,
                        "features": features,
                        "predicted_quality": predicted_quality,
                        "suggestions": suggestions
                    }
                },
                status=status.HTTP_201_CREATED
            )

        except Exception:
            return Response(
                {"error": "Resume analysis failed. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


# =========================================================
# User Resume History
# =========================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_history_api(request):

    try:
        history = Resume.objects.filter(
            user=request.user
        ).order_by('-created_at')

        serializer = ResumeSerializer(
            history,
            many=True,
            context={'missing': []}
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    except Exception:
        return Response(
            {"error": "History retrieval failed"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# =========================================================
# User Registration
# =========================================================

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):

    username = request.data.get('username')
    password = request.data.get('password')
    

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already taken"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username,
        password=password,
      
    )

    return Response(
        {"message": "User registered successfully!"},
        status=status.HTTP_201_CREATED
    )