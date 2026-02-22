from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout, get_user_model
from .models import Resume
from .utils import extract_text_from_pdf, calculate_resume_score

# Dynamically reference the CustomUser model
User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """Stores data in the CustomUser table with selected roles."""
    username = request.data.get('username')
    password = request.data.get('password')
    role = request.data.get('role', 'job_seeker')

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password, role=role)
    return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def resume_upload_api(request):
    file = request.FILES.get('file')
    job_role = request.data.get('job_role')

    if not file or not job_role:
        return Response({"error": "Missing file or job role"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Link to the authenticated user or first user for local testing
        current_user = request.user if request.user.is_authenticated else User.objects.first()
        
        resume = Resume.objects.create(
            user=current_user,
            file=file, 
            job_role=job_role
        )

        text = extract_text_from_pdf(resume.file.path)
        score, found, missing = calculate_resume_score(text, resume.job_role)

        resume.score = score
        resume.matched_keywords = ", ".join(found)
        resume.save()

        return Response({
            "score": score, "found": found, "missing": missing, "message": "Analysis successful!"
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if user:
        login(request, user)
        return Response({"username": user.username, "role": user.role}, status=status.HTTP_200_OK)
    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AllowAny])
def logout_user(request):
    logout(request)
    return Response({"message": "Logged out"}, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_history_api(request):
    """Fetches records ONLY for the logged-in user."""
    try:
        history = Resume.objects.filter(user=request.user).order_by('-created_at')
        
        history_data = [{
            "id": item.id,
            "job_role": item.get_job_role_display(),
            "score": item.score,
            "date": item.created_at.strftime("%Y-%m-%d %H:%M"),
            "matched": item.matched_keywords
        } for item in history]
        
        return Response(history_data, status=status.HTTP_200_OK)
    except Exception:
        return Response({"error": "Could not retrieve history."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)