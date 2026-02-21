from django.shortcuts import render
from .forms import ResumeUploadForm
from .utils import extract_text_from_pdf, calculate_resume_score
from .models import Resume


def Upload_resume(request):
    if request.method == 'POST':
        form = ResumeUploadForm(request.POST, request.FILES)

        if form.is_valid():
            # Get cleaned data from form
            file = form.cleaned_data["file"]
            job_role = form.cleaned_data["job_role"]

            # Create Resume object manually
            resume = Resume.objects.create(
              
                file=file,
                job_role=job_role
            )

            # Extract text
            extracted_text = extract_text_from_pdf(resume.file.path)

            # Calculate score
            score, found, missing = calculate_resume_score(
                extracted_text,
                resume.job_role
            )

            # Update resume with score
            resume.score = score
            resume.matched_keywords = ", ".join(found)
            resume.save()

            return render(request, "resume/result.html", {
                "resume": resume,
                "score":score,
                "found": found,
                "missing": missing
            })

    else:
        form = ResumeUploadForm()

    return render(request, "resume/upload.html", {"form": form})