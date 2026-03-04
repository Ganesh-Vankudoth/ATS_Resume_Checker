from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout, get_user_model
from .models import Resume
from .utils import extract_text_from_pdf, calculate_resume_score
from .serializers import ResumeSerializer
# Dynamically reference the CustomUser model
User = get_user_model()
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def resume_upload_api(request):
    print(f"DEBUG: Uploading for user: {request.user}")
    serializer = ResumeSerializer(data=request.data)
    
    if serializer.is_valid():
        # user_to_save = request.user if request.user.is_authenticated else None
        resume = serializer.save(user=request.user)
        
        try:
            text = extract_text_from_pdf(resume.file.path)
            score, found, missing = calculate_resume_score(text, resume.job_role)

            resume.score = score
            resume.matched_keywords = ", ".join(found)
            resume.save()

            # We pass the 'missing' list here so the SerializerMethodField can see it
            return Response(
                ResumeSerializer(resume, context={'missing': missing}).data, 
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            print(f"ANALYSIS ERROR: {e}")
            return Response({"error": f"Analysis failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(["GET"])
@permission_classes([IsAuthenticated]) # Changed from AllowAny to IsAuthenticated
def user_history_api(request):
    try:
        # Strictly filter by the logged-in user only
        history = Resume.objects.filter(user=request.user).order_by('-created_at')
        
        serializer = ResumeSerializer(history, many=True, context={'missing': []})
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": "History retrieval failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
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
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if user is not None:
        login(request, user)  # 👈 This creates the session on the server
        response = Response({
            "username": user.username, 
            "role": getattr(user, 'role', 'job_seeker')
        }, status=status.HTTP_200_OK)
        
        # We don't manually set cookies; login() does it, 
        # but the response must be returned for the browser to receive it.
        return response
    
    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AllowAny])
def logout_user(request):
    logout(request)
    return Response({"message": "Logged out"}, status=status.HTTP_200_OK)
