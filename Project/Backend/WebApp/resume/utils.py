import pdfplumber
import re


# -----------------------------
# Extract Text from PDF
# -----------------------------
def extract_text_from_pdf(file_path):
    extracted_text = ""

    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n\n"   # important spacing

        return extracted_text.strip()

    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""


# -----------------------------
# ATS Score (Skill-Based)
# -----------------------------
def calculate_resume_score(extracted_text, job_role):

    job_keywords = {
        'python_dev': ['python','django','rest framework','mysql','git','docker','aws'],
        'frontend_dev': ['html','css','javascript','bootstrap','react','typescript'],
        'data_analyst': ['python','mysql','pandas','numpy','tableau','power bi','statistics'],
        'backend_dev': ['python','django','api','redis'],
        'fullstack_dev': ['react','node.js','express','mongodb','python','django','docker','cicd'],
        'devops_engine': ['linux','docker','kubernetes','jenkins','terraform','aws','ansible','bash'],
        'java_dev': ['java','spring boot','hibernate','microservices','maven','junit','sql']
    }

    text = extracted_text.lower()
    required_skills = job_keywords.get(job_role, [])

    if not required_skills:
        return 0, [], []

    found_skills = [skill for skill in required_skills if skill in text]
    missing_skills = [skill for skill in required_skills if skill not in text]

    score = int((len(found_skills) / len(required_skills)) * 100)

    return score, found_skills, missing_skills


# -----------------------------
# Feature Extraction
# -----------------------------
def extract_resume_features(extracted_text, job_role):
    text = extracted_text.lower()

    job_keywords = {
        'python_dev': ['python','django','rest framework','mysql','git','docker','aws'],
        'frontend_dev': ['html','css','javascript','bootstrap','react','typescript'],
        'data_analyst': ['python','mysql','pandas','numpy','tableau','power bi','statistics'],
        'backend_dev': ['python','django','api','redis'],
        'fullstack_dev': ['react','node.js','express','mongodb','python','django','docker','cicd'],
        'devops_engine': ['linux','docker','kubernetes','jenkins','terraform','aws','ansible','bash'],
        'java_dev': ['java','spring boot','hibernate','microservices','maven','junit','sql']
    }

    required_skills = job_keywords.get(job_role, [])

    # -----------------------------
    # 1. Skill Count
    # -----------------------------
    skill_count = sum(1 for skill in required_skills if skill in text)

    # -----------------------------
    # 2. Resume Length
    # -----------------------------
    resume_length = len(text.split())

    # -----------------------------
    # 3. Keyword Density
    # -----------------------------
    keyword_hits = sum(text.count(skill) for skill in required_skills)
    keyword_density = keyword_hits / (resume_length + 1)

    # -----------------------------
    # 4. Project Count (same logic)
    # -----------------------------
    project_count = 0

    project_section = re.search(
        r'projects(.*?)(education|skills|experience|certifications|additional|$)',
        text,
        re.S
    )

    if project_section:
        section_text = project_section.group(1)
        lines = section_text.split('\n')

        project_titles = []

        for line in lines:
            line = line.strip()

            if len(line) < 10:
                continue

            if line.startswith(('•', '-', '*')):
                continue

            if any(word in line for word in [
                "developed", "built", "implemented", "designed", "used", "using"
            ]):
                continue

            if line.count(',') >= 2:
                continue

            if len(line.split()) >= 3:
                project_titles.append(line)

        project_count = len(set(project_titles))

    project_count = min(project_count, 5)

    # -----------------------------
    # 5. Experience Detection (IMPROVED)
    # -----------------------------
    experience = 0

    if re.search(r'\b\d+\s*(years?|yrs?)\b', text):
        experience = 1
    elif "internship" in text:
        experience = 1

    # -----------------------------
    # 6. Section Score
    # -----------------------------
    sections = ["education", "skills", "projects", "experience"]
    section_score = sum(1 for sec in sections if sec in text)

    return {
        "skill_count": skill_count,
        "project_count": project_count,
        "experience": experience,
        "resume_length": resume_length,
        "keyword_density": keyword_density,
        "section_score": section_score
    }