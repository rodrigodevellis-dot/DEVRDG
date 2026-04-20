#!/usr/bin/env python3
"""
Script para extrair texto de PDFs com imagens usando Google Cloud Document AI.
Utiliza OCR para reconhecer texto em imagens dentro de documentos PDF.
"""

import os
import sys
from pathlib import Path
from typing import Optional
from google.cloud import documentai_v1 as documentai
from google.api_core.client_options import ClientOptions


class PDFTextExtractor:
    """Extrator de texto de PDFs usando Google Cloud Document AI."""

    def __init__(
        self,
        project_id: str,
        location: str = "us",
        processor_id: Optional[str] = None
    ):
        """
        Inicializa o extrator.

        Args:
            project_id: ID do projeto no Google Cloud
            location: Localização do processador (us, eu, etc)
            processor_id: ID do processador Document AI (opcional)
        """
        self.project_id = project_id
        self.location = location
        self.processor_id = processor_id

        # Configurar cliente Document AI
        opts = ClientOptions(api_endpoint=f"{location}-documentai.googleapis.com")
        self.client = documentai.DocumentProcessorServiceClient(client_options=opts)

    def extract_text(
        self,
        pdf_path: str,
        output_path: Optional[str] = None,
        mime_type: str = "application/pdf"
    ) -> str:
        """
        Extrai texto de um arquivo PDF.

        Args:
            pdf_path: Caminho para o arquivo PDF
            output_path: Caminho para salvar o texto extraído (opcional)
            mime_type: Tipo MIME do arquivo

        Returns:
            Texto extraído do PDF
        """
        # Validar arquivo
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"Arquivo não encontrado: {pdf_path}")

        # Ler arquivo PDF
        with open(pdf_path, "rb") as pdf_file:
            pdf_content = pdf_file.read()

        # Criar nome do processador
        if self.processor_id:
            name = self.client.processor_path(
                self.project_id,
                self.location,
                self.processor_id
            )
        else:
            # Se não tiver processor_id, tentar usar o processador padrão
            # Você precisará criar um processador no console do Google Cloud
            raise ValueError(
                "processor_id é obrigatório. Crie um processador em:\n"
                "https://console.cloud.google.com/ai/document-ai/processors"
            )

        # Configurar requisição
        raw_document = documentai.RawDocument(
            content=pdf_content,
            mime_type=mime_type
        )

        request = documentai.ProcessRequest(
            name=name,
            raw_document=raw_document
        )

        print(f"📄 Processando: {pdf_path}")
        print(f"⚙️  Processador: {name}")

        # Processar documento
        result = self.client.process_document(request=request)
        document = result.document

        # Extrair texto
        text = document.text

        # Informações adicionais
        print(f"✅ Páginas processadas: {len(document.pages)}")
        print(f"📝 Caracteres extraídos: {len(text)}")

        # Salvar em arquivo se especificado
        if output_path:
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(text)
            print(f"💾 Texto salvo em: {output_path}")

        return text

    def extract_with_confidence(
        self,
        pdf_path: str,
        output_path: Optional[str] = None,
        include_metadata: bool = True
    ) -> dict:
        """
        Extrai texto com informações de confiança e metadados.

        Args:
            pdf_path: Caminho para o arquivo PDF
            output_path: Caminho para salvar o resultado (opcional)
            include_metadata: Incluir metadados no resultado

        Returns:
            Dicionário com texto e metadados
        """
        # Validar arquivo
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"Arquivo não encontrado: {pdf_path}")

        # Ler arquivo PDF
        with open(pdf_path, "rb") as pdf_file:
            pdf_content = pdf_file.read()

        # Criar nome do processador
        name = self.client.processor_path(
            self.project_id,
            self.location,
            self.processor_id
        )

        # Configurar requisição
        raw_document = documentai.RawDocument(
            content=pdf_content,
            mime_type="application/pdf"
        )

        request = documentai.ProcessRequest(
            name=name,
            raw_document=raw_document
        )

        print(f"📄 Processando com metadados: {pdf_path}")

        # Processar documento
        result = self.client.process_document(request=request)
        document = result.document

        # Montar resultado
        output = {
            "text": document.text,
            "pages": len(document.pages),
            "characters": len(document.text)
        }

        if include_metadata:
            # Extrair informações de confiança por página
            pages_info = []
            for page in document.pages:
                page_info = {
                    "page_number": page.page_number if hasattr(page, 'page_number') else len(pages_info) + 1,
                    "dimensions": {
                        "width": page.dimension.width if page.dimension else None,
                        "height": page.dimension.height if page.dimension else None
                    },
                    "blocks": len(page.blocks),
                    "paragraphs": len(page.paragraphs),
                    "lines": len(page.lines),
                    "tokens": len(page.tokens)
                }
                pages_info.append(page_info)

            output["pages_details"] = pages_info

        # Salvar resultado se especificado
        if output_path:
            import json
            with open(output_path, "w", encoding="utf-8") as f:
                json.dump(output, f, ensure_ascii=False, indent=2)
            print(f"💾 Resultado salvo em: {output_path}")

        print(f"✅ Processamento completo!")
        return output


def main():
    """Função principal do script."""
    import argparse

    parser = argparse.ArgumentParser(
        description="Extrai texto de PDFs com imagens usando Google Cloud Document AI"
    )
    parser.add_argument(
        "pdf_path",
        help="Caminho para o arquivo PDF"
    )
    parser.add_argument(
        "-o", "--output",
        help="Caminho para salvar o texto extraído"
    )
    parser.add_argument(
        "-p", "--project-id",
        default=os.getenv("GCP_PROJECT_ID"),
        help="ID do projeto no Google Cloud (padrão: variável GCP_PROJECT_ID)"
    )
    parser.add_argument(
        "-l", "--location",
        default=os.getenv("DOCUMENTAI_LOCATION", "us"),
        help="Localização do processador (padrão: us)"
    )
    parser.add_argument(
        "-i", "--processor-id",
        default=os.getenv("DOCUMENTAI_PROCESSOR_ID"),
        help="ID do processador Document AI (padrão: variável DOCUMENTAI_PROCESSOR_ID)"
    )
    parser.add_argument(
        "-m", "--metadata",
        action="store_true",
        help="Incluir metadados e informações de confiança"
    )

    args = parser.parse_args()

    # Validar parâmetros obrigatórios
    if not args.project_id:
        print("❌ Erro: project_id é obrigatório!")
        print("   Configure a variável GCP_PROJECT_ID ou use --project-id")
        sys.exit(1)

    if not args.processor_id:
        print("❌ Erro: processor_id é obrigatório!")
        print("   Configure a variável DOCUMENTAI_PROCESSOR_ID ou use --processor-id")
        print("\n📋 Como criar um processador:")
        print("   1. Acesse: https://console.cloud.google.com/ai/document-ai/processors")
        print("   2. Clique em 'CREATE PROCESSOR'")
        print("   3. Escolha 'Document OCR' ou 'Form Parser'")
        print("   4. Copie o Processor ID")
        sys.exit(1)

    try:
        # Criar extrator
        extractor = PDFTextExtractor(
            project_id=args.project_id,
            location=args.location,
            processor_id=args.processor_id
        )

        # Extrair texto
        if args.metadata:
            result = extractor.extract_with_confidence(
                pdf_path=args.pdf_path,
                output_path=args.output
            )
            print(f"\n📊 Resumo:")
            print(f"   Páginas: {result['pages']}")
            print(f"   Caracteres: {result['characters']}")
        else:
            text = extractor.extract_text(
                pdf_path=args.pdf_path,
                output_path=args.output
            )
            if not args.output:
                print(f"\n📝 Texto extraído:\n")
                print(text)

    except Exception as e:
        print(f"❌ Erro: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
