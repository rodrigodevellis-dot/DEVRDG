# 📄 Guia de Extração de Texto de PDFs com Imagens

Script Python para extrair texto de PDFs que contêm imagens usando **Google Cloud Document AI** com OCR.

## 🚀 Configuração Inicial

### 1. Instalar Dependências

```bash
pip install -r requirements.txt
```

### 2. Configurar Google Cloud

#### a) Criar Projeto no Google Cloud

1. Acesse: https://console.cloud.google.com
2. Crie um novo projeto ou selecione um existente
3. Anote o **Project ID**

#### b) Ativar a API Document AI

```bash
gcloud services enable documentai.googleapis.com
```

Ou manualmente:
1. Acesse: https://console.cloud.google.com/apis/library/documentai.googleapis.com
2. Clique em **ENABLE**

#### c) Criar um Processador Document AI

1. Acesse: https://console.cloud.google.com/ai/document-ai/processors
2. Clique em **CREATE PROCESSOR**
3. Escolha o tipo:
   - **Document OCR** (recomendado para PDFs com imagens)
   - **Form Parser** (para formulários)
   - **Invoice Parser** (para faturas)
4. Selecione a região (ex: `us`, `eu`)
5. Copie o **Processor ID** (formato: `abc123def456`)

#### d) Criar Credenciais (Service Account)

```bash
# Criar service account
gcloud iam service-accounts create document-ai-extractor \
    --display-name="Document AI Extractor"

# Obter o email da service account
gcloud iam service-accounts list

# Dar permissões
gcloud projects add-iam-policy-binding SEU-PROJECT-ID \
    --member="serviceAccount:document-ai-extractor@SEU-PROJECT-ID.iam.gserviceaccount.com" \
    --role="roles/documentai.apiUser"

# Criar chave JSON
gcloud iam service-accounts keys create credentials.json \
    --iam-account=document-ai-extractor@SEU-PROJECT-ID.iam.gserviceaccount.com
```

### 3. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar com suas credenciais
nano .env
```

Preencha:
```
GCP_PROJECT_ID=seu-projeto-id
DOCUMENTAI_LOCATION=us
DOCUMENTAI_PROCESSOR_ID=abc123def456
GOOGLE_APPLICATION_CREDENTIALS=/caminho/completo/para/credentials.json
```

```bash
# Carregar variáveis de ambiente
export $(cat .env | xargs)
```

## 📖 Como Usar

### Uso Básico

```bash
# Extrair texto e exibir no terminal
python extract_pdf_text.py documento.pdf

# Salvar texto em arquivo
python extract_pdf_text.py documento.pdf -o texto_extraido.txt
```

### Uso com Metadados

```bash
# Extrair texto com informações detalhadas
python extract_pdf_text.py documento.pdf -m -o resultado.json
```

### Especificar Credenciais Manualmente

```bash
python extract_pdf_text.py documento.pdf \
    --project-id meu-projeto \
    --processor-id abc123def456 \
    --location us \
    -o saida.txt
```

## 🔧 Opções do Script

```
usage: extract_pdf_text.py [-h] [-o OUTPUT] [-p PROJECT_ID] [-l LOCATION]
                           [-i PROCESSOR_ID] [-m] pdf_path

Opções:
  pdf_path              Caminho para o arquivo PDF
  -o, --output         Salvar texto extraído em arquivo
  -p, --project-id     ID do projeto Google Cloud
  -l, --location       Localização do processador (padrão: us)
  -i, --processor-id   ID do processador Document AI
  -m, --metadata       Incluir metadados e informações detalhadas
```

## 📝 Exemplo de Código Python

```python
from extract_pdf_text import PDFTextExtractor

# Inicializar extrator
extractor = PDFTextExtractor(
    project_id="meu-projeto",
    location="us",
    processor_id="abc123def456"
)

# Extrair texto simples
text = extractor.extract_text(
    pdf_path="documento.pdf",
    output_path="texto.txt"
)
print(text)

# Extrair com metadados
result = extractor.extract_with_confidence(
    pdf_path="documento.pdf",
    output_path="resultado.json",
    include_metadata=True
)

print(f"Páginas: {result['pages']}")
print(f"Caracteres: {result['characters']}")
print(f"Texto: {result['text'][:100]}...")
```

## 🎯 Tipos de Processadores

| Tipo | Descrição | Uso |
|------|-----------|-----|
| **Document OCR** | OCR geral para documentos | PDFs escaneados, imagens |
| **Form Parser** | Extração de formulários | Formulários estruturados |
| **Invoice Parser** | Extração de faturas | Notas fiscais, invoices |
| **Receipt Parser** | Extração de recibos | Recibos, cupons fiscais |
| **ID Parser** | Extração de documentos | RG, CNH, passaportes |

## 💰 Custos (Pricing)

Document AI cobra por página processada:

- **Document OCR**: $1.50 por 1.000 páginas
- **Form Parser**: $30 por 1.000 páginas
- **Specialized Parsers**: $65 por 1.000 páginas

**Tier Gratuito**: 1.000 páginas/mês grátis (Document OCR)

Mais info: https://cloud.google.com/document-ai/pricing

## 🔍 Troubleshooting

### Erro: "processor_id é obrigatório"

```bash
# Verifique se as variáveis estão configuradas
echo $DOCUMENTAI_PROCESSOR_ID

# Se vazio, configure:
export DOCUMENTAI_PROCESSOR_ID=seu-processor-id
```

### Erro: "Permission denied"

```bash
# Verificar se credenciais estão corretas
echo $GOOGLE_APPLICATION_CREDENTIALS

# Testar autenticação
gcloud auth application-default login
```

### Erro: "API not enabled"

```bash
# Ativar API Document AI
gcloud services enable documentai.googleapis.com
```

### Erro: "Quota exceeded"

- Você excedeu o limite gratuito de 1.000 páginas/mês
- Ative faturamento ou aguarde próximo mês

## 📚 Recursos Adicionais

- [Documentação Document AI](https://cloud.google.com/document-ai/docs)
- [Exemplos de Código](https://github.com/googleapis/python-documentai)
- [Preços](https://cloud.google.com/document-ai/pricing)
- [Regiões Disponíveis](https://cloud.google.com/document-ai/docs/regions)

## 🎓 Dicas

1. **Escolha a região mais próxima** para melhor performance
2. **Use Document OCR** para casos gerais (mais barato)
3. **Processe em lote** para grandes volumes
4. **Cache resultados** para não processar o mesmo PDF duas vezes
5. **Monitore custos** no console do Google Cloud

## ⚡ Performance

- **Processamento**: ~2-5 segundos por página
- **Acurácia OCR**: >99% para texto impresso
- **Formatos suportados**: PDF, PNG, JPEG, TIFF, GIF, BMP
- **Tamanho máximo**: 20 MB por documento

## 🔐 Segurança

⚠️ **NUNCA** commite o arquivo `credentials.json` no Git!

```bash
# Adicionar ao .gitignore
echo "credentials.json" >> .gitignore
echo ".env" >> .gitignore
```

## 📦 Estrutura de Arquivos

```
DEVRDG/
├── extract_pdf_text.py          # Script principal
├── requirements.txt             # Dependências Python
├── .env.example                 # Exemplo de configuração
├── .env                         # Suas configurações (não commitar!)
├── credentials.json             # Credenciais GCP (não commitar!)
├── PDF_EXTRACTION_GUIDE.md      # Este guia
└── README.md                    # README do projeto
```

---

**Criado com ❤️ usando Google Cloud Document AI**
