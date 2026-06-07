# Prompts Funcionais

Um prompt funcional é aquele que **entrega o resultado que você precisa**. Não precisa ser bonito, elaborado ou seguir frameworks. Precisa funcionar.

---

## 3 Princípios

### 1. Diga o que você quer, não como a IA deve pensar

Ruim:
> "Aja como um especialista em marketing digital com 20 anos de experiência e pense passo a passo sobre estratégias de conteúdo..."

Funcional:
> "Preciso de 5 ideias de post para Instagram sobre [tema]. Público: [descreva]. Tom: informal."

### 2. Dê contexto, não instruções genéricas

Ruim:
> "Seja criativo e inovador ao responder."

Funcional:
> "Sou doutorando em [área]. Estou escrevendo um artigo sobre [tema]. Preciso de um parágrafo que explique [conceito] para um leitor acadêmico."

### 3. Mostre o formato que espera receber

Ruim:
> "Me dê informações sobre X."

Funcional:
> "Liste os 3 principais argumentos a favor e 3 contra [tema]. Use bullet points. Máximo 2 linhas por argumento."

---

## Estrutura mínima de um prompt funcional

```
[Contexto] - Quem é você / qual a situação
[Tarefa]   - O que precisa ser feito
[Formato]  - Como quer receber a resposta
```

Exemplo:

> Sou professor universitário e preciso adaptar um texto acadêmico sobre mudanças climáticas para uma apresentação de 10 minutos para alunos de graduação. Resuma os pontos principais em 5 tópicos curtos com linguagem acessível.

---

## Padrões que funcionam no dia a dia

### Para resumir
> "Resuma [isso] em [X] linhas/parágrafos. Foco em [aspecto]."

### Para revisar texto
> "Revise este texto. Corrija erros gramaticais e melhore a clareza. Mantenha o tom [formal/informal]. Não mude o sentido."

### Para gerar ideias
> "Preciso de [X] ideias sobre [tema]. Contexto: [situação]. Restrições: [limites]."

### Para explicar
> "Explique [conceito] como se fosse para [público]. Use [analogia/exemplo] se possível."

### Para analisar
> "Analise [isso] considerando [critérios]. Apresente pontos fortes e fracos."

### Para transformar formato
> "Converta [isso] de [formato A] para [formato B]. Exemplo do formato desejado: [exemplo]."

---

## Quando o resultado não sai como esperado

Em vez de reescrever tudo, **ajuste incrementalmente**:

1. **Resultado vago demais** → Adicione um exemplo concreto do que espera
2. **Resultado longo demais** → Especifique limite ("máximo 3 parágrafos")
3. **Tom errado** → Dê uma referência ("como se fosse um e-mail profissional")
4. **Faltou informação** → Peça para complementar o ponto específico
5. **Formato errado** → Mostre um modelo do formato que quer

---

## O que NÃO faz diferença na prática

- Dizer "por favor" ou "obrigado" (não muda a qualidade da resposta)
- Usar frameworks como CRISP, RACE, etc. (úteis para ensinar, desnecessários para usar)
- Pedir para "pensar passo a passo" na maioria das tarefas simples
- Atribuir personas elaboradas ("aja como um CEO visionário...")
- Repetir a instrução 3 vezes para "garantir"

---

## O que FAZ diferença

- **Exemplo concreto** do resultado esperado (vale mais que 10 linhas de instrução)
- **Contexto real** da sua situação (não genérico)
- **Formato explícito** (tabela, lista, parágrafos, JSON...)
- **Limites claros** (tamanho, escopo, tom)
- **Iteração** - refinar na conversa em vez de tentar o prompt perfeito de primeira
