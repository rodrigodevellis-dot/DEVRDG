# DEVRDG - PDF Text Extractor

Extrator de texto de PDFs com imagens usando Google Cloud Document AI com OCR.

## 🚀 Quick Start

```bash
# Instalar dependências
pip install -r requirements.txt

# Configurar credenciais
cp .env.example .env
# Edite o .env com suas credenciais

# Extrair texto de um PDF
python extract_pdf_text.py documento.pdf -o texto.txt
```

## 📖 Documentação Completa

Veja [PDF_EXTRACTION_GUIDE.md](PDF_EXTRACTION_GUIDE.md) para instruções detalhadas de configuração e uso.

## ✨ Features

- ✅ Extração de texto de PDFs escaneados (imagens)
- ✅ OCR de alta precisão usando Google Cloud Document AI
- ✅ Suporte a múltiplos formatos (PDF, PNG, JPEG, TIFF)
- ✅ Extração com metadados e informações de confiança
- ✅ Interface de linha de comando simples
- ✅ API Python para integração programática
