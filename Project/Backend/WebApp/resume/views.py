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
    #  Get data from the request
    # request.FILES for the PDF, request.data for text fields
    file = request.FILES.get('file')
    job_role = request.data.get('job_role')

    # Basic Validation
    if not file or not job_role:
        return Response(
            {"error": "Missing file or job role"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    if not file.name.endswith('.pdf'):
        return Response(
            {"error":"Invalid format. Only PDF files are allowed."},
            status=status.HTTP_400_BAD_REQUEST
        )
    if file.size > 5 * 1024 * 1024:
        return Response(
            {"error": "File size exceeds the 5MB limit."}, 
            status=status.HTTP_400_BAD_REQUEST
        )


    #  Create Resume object in MySQL
    # Note: We link to the first user for testing 
    try:
        user = User.objects.first() 
        resume = Resume.objects.create(
            user=user,
            file=file, 
            job_role=job_role
        )

    
        # Get the physical path of the uploaded file to read it
        text = extract_text_from_pdf(resume.file.path)
        score, found, missing = calculate_resume_score(text, resume.job_role)

        #  Save results to DB
        resume.score = score
        resume.matched_keywords = ", ".join(found)
        resume.save()

        # Return JSON to React
        return Response({
            "score": score,
            "found": found,
            "missing": missing,
            "message": "Analysis successful!"
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        #  Catch unexpected processing errors (like corrupted PDFs)
        # Prevents the entire server from crashing
        return Response(
            {"error": "Internal processing error during analysis."}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )