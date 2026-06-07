# Compositor: Montando o Extrator sob Demanda

## Uso rápido

1. Copie o **Prompt Base** (obrigatório)
2. Escolha uma **composição pronta** OU monte a sua
3. Cole os schemas dos módulos escolhidos
4. Envie o texto

---

## Prompt Base (sempre usar este início)

```
Você é um extrator estruturado de textos. Sua função é ler o texto que eu enviar e produzir um JSON seguindo exatamente o schema que defino abaixo.

Regras:
- Extraia apenas o que está no texto. Não invente informações.
- Se um campo não puder ser preenchido, use null.
- Citações diretas devem ser transcritas literalmente com localização.
- Em "notas_do_pesquisador", faça análise crítica própria.
- Responda SOMENTE com o JSON. Sem texto antes ou depois.
- No campo "_modulos_aplicados", liste os módulos usados.
```

---

## Montagem livre

Para montar qualquer combinação, use este padrão após o prompt base:

```
Schema: aplique NÚCLEO + [MÓDULO A] + [MÓDULO B] + ...

NÚCLEO:
[cole nucleo.json]

MÓDULO [A] (adicione como campo "[nome]" no JSON):
[cole modulo-[a].json]

MÓDULO [B] (adicione como campo "[nome]" no JSON):
[cole modulo-[b].json]
```

---

## Composições prontas

### Acadêmicas

#### Fichamento básico (só núcleo)
```
Schema: aplique apenas o NÚCLEO.
[cole nucleo.json]
```

#### Revisão de literatura (núcleo + teórico)
```
Schema: aplique NÚCLEO + MÓDULO TEÓRICO.

NÚCLEO:
[cole nucleo.json]

MÓDULO TEÓRICO (adicione como campo "teorico" no JSON):
[cole modulo-teorico.json]
```

#### Estudo empírico com teoria (núcleo + teórico + empírico)
```
Schema: aplique NÚCLEO + MÓDULO TEÓRICO + MÓDULO EMPÍRICO.

NÚCLEO:
[cole nucleo.json]

MÓDULO TEÓRICO (adicione como campo "teorico"):
[cole modulo-teorico.json]

MÓDULO EMPÍRICO (adicione como campo "empirico"):
[cole modulo-empirico.json]
```

### Literárias

#### Análise de personagens (núcleo + personagem + narrativa)
```
Schema: aplique NÚCLEO + MÓDULO PERSONAGEM + MÓDULO NARRATIVA.

NÚCLEO:
[cole nucleo.json]

MÓDULO PERSONAGEM (adicione como campos "personagens" e "sistema_de_personagens"):
[cole modulo-personagem.json]

MÓDULO NARRATIVA (adicione como campo "narrativa"):
[cole modulo-narrativa.json]
```

#### Personagens + teoria (núcleo + personagem + narrativa + teórico)
```
Schema: aplique NÚCLEO + MÓDULO PERSONAGEM + MÓDULO NARRATIVA + MÓDULO TEÓRICO.

NÚCLEO:
[cole nucleo.json]

MÓDULO PERSONAGEM (adicione como campos "personagens" e "sistema_de_personagens"):
[cole modulo-personagem.json]

MÓDULO NARRATIVA (adicione como campo "narrativa"):
[cole modulo-narrativa.json]

MÓDULO TEÓRICO (adicione como campo "teorico"):
[cole modulo-teorico.json]
```

#### Análise de poesia (núcleo + poético)
```
Schema: aplique NÚCLEO + MÓDULO POÉTICO.

NÚCLEO:
[cole nucleo.json]

MÓDULO POÉTICO (adicione como campo "poetico"):
[cole modulo-poetico.json]
```

#### Poesia + teoria literária (núcleo + poético + teórico)
```
Schema: aplique NÚCLEO + MÓDULO POÉTICO + MÓDULO TEÓRICO.

NÚCLEO:
[cole nucleo.json]

MÓDULO POÉTICO (adicione como campo "poetico"):
[cole modulo-poetico.json]

MÓDULO TEÓRICO (adicione como campo "teorico"):
[cole modulo-teorico.json]
```

### Etnográficas

#### Etnografia (núcleo + etnográfico)
```
Schema: aplique NÚCLEO + MÓDULO ETNOGRÁFICO.

NÚCLEO:
[cole nucleo.json]

MÓDULO ETNOGRÁFICO (adicione como campo "etnografico"):
[cole modulo-etnografico.json]
```

#### Etnografia + teoria (núcleo + etnográfico + teórico)
```
Schema: aplique NÚCLEO + MÓDULO ETNOGRÁFICO + MÓDULO TEÓRICO.

NÚCLEO:
[cole nucleo.json]

MÓDULO ETNOGRÁFICO (adicione como campo "etnografico"):
[cole modulo-etnografico.json]

MÓDULO TEÓRICO (adicione como campo "teorico"):
[cole modulo-teorico.json]
```

#### Autoetnografia (núcleo + autoetnográfico)
```
Schema: aplique NÚCLEO + MÓDULO AUTOETNOGRÁFICO.

NÚCLEO:
[cole nucleo.json]

MÓDULO AUTOETNOGRÁFICO (adicione como campo "autoetnografico"):
[cole modulo-autoetnografico.json]
```

#### Autoetnografia acadêmica (núcleo + autoetnográfico + teórico)
```
Schema: aplique NÚCLEO + MÓDULO AUTOETNOGRÁFICO + MÓDULO TEÓRICO.

NÚCLEO:
[cole nucleo.json]

MÓDULO AUTOETNOGRÁFICO (adicione como campo "autoetnografico"):
[cole modulo-autoetnografico.json]

MÓDULO TEÓRICO (adicione como campo "teorico"):
[cole modulo-teorico.json]
```

### Jornalísticas e midiáticas

#### Análise de mídia (núcleo + jornalístico)
```
Schema: aplique NÚCLEO + MÓDULO JORNALÍSTICO.

NÚCLEO:
[cole nucleo.json]

MÓDULO JORNALÍSTICO (adicione como campo "jornalistico"):
[cole modulo-jornalistico.json]
```

### Combinações cruzadas

#### Romance etnográfico / ficção antropológica (núcleo + narrativa + etnográfico)
```
Schema: aplique NÚCLEO + MÓDULO NARRATIVA + MÓDULO ETNOGRÁFICO.

NÚCLEO:
[cole nucleo.json]

MÓDULO NARRATIVA (adicione como campo "narrativa"):
[cole modulo-narrativa.json]

MÓDULO ETNOGRÁFICO (adicione como campo "etnografico"):
[cole modulo-etnografico.json]
```

#### Reportagem narrativa (núcleo + jornalístico + narrativa)
```
Schema: aplique NÚCLEO + MÓDULO JORNALÍSTICO + MÓDULO NARRATIVA.

NÚCLEO:
[cole nucleo.json]

MÓDULO JORNALÍSTICO (adicione como campo "jornalistico"):
[cole modulo-jornalistico.json]

MÓDULO NARRATIVA (adicione como campo "narrativa"):
[cole modulo-narrativa.json]
```

---

## Extras

### Para extração em lote

Adicione ao final de qualquer composição:
```
Vou enviar múltiplos textos em sequência. Para cada um, produza o JSON completo.
Mantenha exatamente o mesmo schema para todos.
Quando eu disser "FINALIZAR", produza um array JSON com todas as extrações.
```

### Para personalizar o foco da pesquisa

Adicione ao prompt base, antes do schema:
```
Contexto da minha pesquisa: [descreva seu projeto em 2-3 frases].
Ao preencher "notas_do_pesquisador.utilidade", considere especificamente como o texto se relaciona com [seu fenômeno de interesse].
```

### Prompt de análise cruzada (pós-extração)

Depois de ter múltiplos JSONs extraídos, use:
```
Analise os JSONs extraídos e produza um relatório estruturado com:

1. CONVERGÊNCIAS — onde os textos concordam (conceitos, argumentos, achados)
2. DIVERGÊNCIAS — onde discordam e como se posicionam
3. LACUNAS — o que nenhum dos textos cobre mas seria relevante
4. MAPA DE RELAÇÕES — quem cita quem, quem contesta quem
5. GENEALOGIA — como os conceitos-chave evoluem entre os textos

Formato: JSON com estas 5 seções.
```

### Módulo não existe? Gere um novo

Veja `gerador-de-modulos.md` — um prompt que cria módulos compatíveis para qualquer domínio novo.
