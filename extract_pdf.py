import pypdf

def extract_pdf():
    reader = pypdf.PdfReader("pdf_viaje/Viaje a Sevilla, septiembre 2026.pdf")
    text = ""
    for i, page in enumerate(reader.pages):
        text += f"--- PAGE {i+1} ---\n"
        text += page.extract_text() + "\n"
    with open("pdf_text.txt", "w", encoding="utf-8") as f:
        f.write(text)
    print("PDF text extracted to pdf_text.txt successfully.")

if __name__ == "__main__":
    extract_pdf()
