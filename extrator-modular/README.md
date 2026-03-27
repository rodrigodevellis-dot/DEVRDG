# Extrator Modular de Textos

## O problema

Um extrator monolítico funciona para um projeto, mas quebra quando a demanda muda. Você constrói um extrator excelente para textos teóricos, mas quando muda para personagens literários, quase nada se reaproveita — mesmo que vá precisar do extrator teórico na etapa seguinte.

## A solução: núcleo + módulos

```
extrator-modular/
├── nucleo.json              ← sempre presente, nunca reescreve
├── modulo-teorico.json      ← textos que produzem/discutem teoria
├── modulo-personagem.json   ← estudo de personagens literários
├── modulo-empirico.json     ← textos com dados empíricos
└── compositor.md            ← prompt que monta o extrator sob demanda
```

### Núcleo (universal)
Campos que valem para QUALQUER texto — artigo, romance, ensaio, tese:
- **metadados** — identificação da obra
- **texto_fonte** — sobre o que é, gênero, público
- **argumento** — tese, premissas, pressupostos
- **estrutura_conceitual** — conceitos mobilizados, oposições
- **citações diretas** — trechos para guardar
- **conexões** — diálogo com outros textos
- **notas do pesquisador** — sua voz sobre o texto

### Módulos (conforme o projeto)
Encaixam no núcleo conforme a necessidade:

| Módulo | Quando usar | Campos específicos |
|--------|------------|-------------------|
| **teórico** | Textos que produzem ou discutem teoria | Epistemologia, tradição, debate do campo, genealogia conceitual |
| **personagem** | Textos literários com foco em personagens | Caracterização, voz, arco, relações, sistema de personagens |
| **empírico** | Textos com coleta/análise de dados | Desenho metodológico, dados, resultados, validade |

### Combinações comuns

- **Revisão de literatura**: núcleo + teórico
- **Análise de personagens**: núcleo + personagem
- **Estudo empírico com teoria**: núcleo + teórico + empírico
- **Personagens com análise teórica**: núcleo + personagem + teórico
- **Só fichamento básico**: núcleo sozinho

## Como usar

Veja `compositor.md` para o prompt que monta o extrator sob demanda.

## Criando novos módulos

Um módulo é um JSON com campos específicos de um domínio. Para criar um novo:

1. Identifique o que é ESPECÍFICO daquele domínio (o que não cabe no núcleo)
2. Crie um `modulo-NOME.json` seguindo o padrão dos existentes
3. Adicione ao compositor

Exemplos de módulos futuros: `modulo-narrativa.json` (foco, tempo, espaço narrativo), `modulo-politica-publica.json`, `modulo-historico.json`.
