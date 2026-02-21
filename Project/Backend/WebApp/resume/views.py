from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Resume
from .utils import extract_text_from_pdf, calculate_resume_score
from django.contrib.auth.models import User

@api_view(['POST'])
def resume_upload_api(request):
    """
    Function-based view to handle resume uploads and analysis.
    """
    # 1. Get data from the request
    # request.FILES for the PDF, request.data for text fields
    file = request.FILES.get('file')
    job_role = request.data.get('job_role')

    # Basic Validation
    if not file or not job_role:
        return Response(
            {"error": "Missing file or job role"}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    # 2. Create Resume object in MySQL
    # Note: We link to the first user for testing as discussed
    user = User.objects.first() 
    resume = Resume.objects.create(
        user=user,
        file=file, 
        job_role=job_role
    )

    # 3. Process with Day 3 & 4 Logic
    # Get the physical path of the uploaded file to read it
    text = extract_text_from_pdf(resume.file.path)
    score, found, missing = calculate_resume_score(text, resume.job_role)

    # 4. Save results to DB
    resume.score = score
    resume.matched_keywords = ", ".join(found)
    resume.save()

    # 5. Return JSON to React
    return Response({
        "score": score,
        "found": found,
        "missing": missing,
        "message": "Analysis successful!"
    }, status=status.HTTP_201_CREATED)