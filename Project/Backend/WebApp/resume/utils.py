# import PyPDF2
# def extract_text_from_pdf(file):
#     try:
#         reader=PyPDF2.pdfreader(file)
#         text=''
#         for page in reader.pages:
#             extracted=page.extract_text(file)
#             if extracted:
#                 text+=extracted+" "
#         return text.strip()
#     except Exception as e:
#         return f"Error while extracting text:{str(e)}"
  

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