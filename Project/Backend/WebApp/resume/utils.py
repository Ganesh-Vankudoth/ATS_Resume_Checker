import PyPDF2

def extract_text_from_pdf(file_path):
    """
    Algorithm:
    1. Open PDF in Binary Mode.
    2. Read each page one by one.
    3. Join all text into one big 'string'.
    """
    extracted_text = ""
    try:
        # 'rb' is mandatory for PDF files
        with open(file_path, 'rb') as pdf_file:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            # Loop through every page found in the PDF
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    extracted_text += page_text + " "
                    
        return extracted_text.strip() # Clean up extra spaces
    except Exception as e:
        print(f"Error: Could not read the PDF file. {e}")
        return ""
    
def calculate_resume_score(extracted_text,job_role):
    job_keywords={
        'python_dev':['python','django','rest_framework','mysql','git','docker','aws'],
        'frontend_dev':['html','css','javascript','bootstrap','react','typescript'],
        'data_analyst':['python','mysql','pandas','numpy','tableau','power bi','statistics'],
        'backend_dev':['python','django','api','redis']
    }
    text=extracted_text.lower()
    required_skills=job_keywords.get(job_role,[])
    
    if not required_skills:
        return 0,[],[]
    found_skills=[skill for skill in required_skills if skill in text]
    missing_skills=[skill for skill in required_skills if skill not in text]

    score=int((len(found_skills)/len(required_skills))*100)
    return score,found_skills,missing_skills