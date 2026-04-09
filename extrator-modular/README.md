# Extrator Modular de Textos

## O problema

Um extrator monolítico funciona para um projeto, mas quebra quando a demanda muda. Você constrói um extrator excelente para textos teóricos, mas quando muda para personagens literários, quase nada se reaproveita — mesmo que vá precisar do extrator teórico na etapa seguinte.

O problema escala quando o pesquisador transita entre campos: sociedades nativas a laboratórios, textos acadêmicos a jornalísticos, romances a poesias. Cada projeto exige extrações diferentes, mas há uma estrutura comum que se perde toda vez que se recomeça.

## A solução: núcleo + módulos

```
extrator-modular/
├── nucleo.json                ← sempre presente, nunca reescreve
│
├── modulo-teorico.json        ← textos que produzem/discutem teoria
├── modulo-empirico.json       ← textos com dados empíricos
├── modulo-personagem.json     ← estudo de personagens literários
├── modulo-narrativa.json      ← estrutura narrativa (romance, conto, crônica...)
├── modulo-poetico.json        ← poesia e textos líricos
├── modulo-etnografico.json    ← etnografia, campo, alteridade
├── modulo-autoetnografico.json← autoetnografia, autobiografia, reflexividade
├── modulo-jornalistico.json   ← notícias, reportagens, enquadramento
│
├── compositor.md              ← prompt que monta o extrator sob demanda
└── gerador-de-modulos.md      ← prompt para criar módulos novos
```

### Núcleo (universal)
Campos que valem para QUALQUER texto — artigo, romance, ensaio, tese, poema, notícia:
- **metadados** — identificação da obra
- **texto_fonte** — sobre o que é, gênero, público
- **argumento** — tese, premissas, pressupostos
- **estrutura_conceitual** — conceitos mobilizados, oposições
- **citações diretas** — trechos para guardar
- **conexões** — diálogo com outros textos
- **notas do pesquisador** — sua voz sobre o texto

### Módulos disponíveis

| Módulo | Quando usar | Campos específicos |
|--------|------------|-------------------|
| **teórico** | Textos que produzem ou discutem teoria | Epistemologia, tradição, debate do campo, genealogia conceitual |
| **empírico** | Textos com coleta/análise de dados | Desenho metodológico, dados, resultados, validade |
| **personagem** | Textos literários com foco em personagens | Caracterização, voz, arco, relações, sistema de personagens |
| **narrativa** | Qualquer texto com estrutura narrativa | Narrador, tempo, espaço, enredo, linguagem, intertextualidade |
| **poético** | Poesia e textos líricos | Forma, sonoridade, imagens, eu lírico, relação som-sentido |
| **etnográfico** | Etnografias, relatos de campo | Práticas, categorias nativas, cosmologia, posição do etnógrafo |
| **autoetnográfico** | Autoetnografia, autobiografia | Posicionalidade, experiência como dado, movimento eu-nós, ética |
| **jornalístico** | Notícias, reportagens, editoriais | Enquadramento, fontes, vozes ausentes, agenda, relação com poder |

### Combinações por tipo de projeto

| Projeto | Composição |
|---------|-----------|
| Revisão de literatura | núcleo + teórico |
| Estudo empírico | núcleo + teórico + empírico |
| Análise de personagens | núcleo + personagem + narrativa |
| Personagens + teoria | núcleo + personagem + narrativa + teórico |
| Análise de poesia | núcleo + poético |
| Poesia + teoria literária | núcleo + poético + teórico |
| Etnografia | núcleo + etnográfico |
| Etnografia + teoria | núcleo + etnográfico + teórico |
| Autoetnografia | núcleo + autoetnográfico |
| Autoetnografia acadêmica | núcleo + autoetnográfico + teórico |
| Análise de mídia | núcleo + jornalístico |
| Romance etnográfico | núcleo + narrativa + etnográfico |
| Só fichamento | núcleo sozinho |

## Como usar

1. Veja `compositor.md` para prompts prontos de cada combinação
2. Monte combinações novas conforme seu projeto
3. Os JSONs produzidos são compatíveis entre si — todos compartilham o núcleo

## Criando novos módulos

Use `gerador-de-modulos.md` — um prompt que cria módulos compatíveis automaticamente. Basta descrever o domínio e o contexto da pesquisa.

Exemplos de módulos futuros: `modulo-juridico.json`, `modulo-discurso-politico.json`, `modulo-historico.json`, `modulo-visual.json` (análise de imagens/filmes).
