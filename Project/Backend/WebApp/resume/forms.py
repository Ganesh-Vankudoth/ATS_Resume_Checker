from django import forms

class ResumeUploadForm(forms.Form):
    file=forms.FileField()
    job_role=forms.ChoiceField(choices=[
        ('python_dev','Python Developer'),
        ('data_analyst','Data Analyst'),
        ('frontend_dev','Frontend Developer'),
        ('backend_dev','Backend Developer')
    ])