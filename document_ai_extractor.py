#!/usr/bin/env python3
"""
Document AI PDF to Text extractor using Google Cloud Document AI API.
"""

from google.cloud import documentai_v1 as documentai
import sys
import os


def extract_text_from_pdf(project_id: str, processor_id: str, pdf_path: str) -> str:
    """
    Extract text from a PDF using Document AI.

    Args:
        project_id: Google Cloud project ID
        processor_id: Document AI processor ID
        pdf_path: Path to the PDF file

    Returns:
        Extracted text as a string
    """
    client = documentai.DocumentProcessorServiceClient()

    # Read PDF file
    with open(pdf_path, "rb") as pdf_file:
        pdf_content = pdf_file.read()

    # Create request
    raw_document = documentai.RawDocument(
        content=pdf_content,
        mime_type="application/pdf"
    )

    request = documentai.ProcessRequest(
        name=client.processor_path(project_id, "us", processor_id),
        raw_document=raw_document
    )

    # Process document
    result = client.process_document(request=request)
    document = result.document

    # Extract text
    return document.text


def main():
    if len(sys.argv) < 4:
        print("Usage: python document_ai_extractor.py <project_id> <processor_id> <pdf_path>")
        sys.exit(1)

    project_id = sys.argv[1]
    processor_id = sys.argv[2]
    pdf_path = sys.argv[3]
    output_path = sys.argv[4] if len(sys.argv) > 4 else pdf_path.replace(".pdf", ".txt")

    # Extract text
    text = extract_text_from_pdf(project_id, processor_id, pdf_path)

    # Save to file
    with open(output_path, "w") as txt_file:
        txt_file.write(text)

    print(f"Text extracted and saved to {output_path}")


if __name__ == "__main__":
    main()
