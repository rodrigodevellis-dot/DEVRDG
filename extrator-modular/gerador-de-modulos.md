# Gerador de Módulos

Para quando você precisa de um módulo que ainda não existe. Em vez de construir do zero, use este prompt para gerar um novo módulo compatível com o sistema.

---

## Prompt

```
Preciso criar um novo módulo de extração para o seguinte tipo de texto/domínio:

DOMÍNIO: [descreva o tipo de texto ou campo — ex: "textos jurídicos", "discursos políticos", "documentos históricos", "textos religiosos", "manuais técnicos"]

CONTEXTO DA PESQUISA: [em 2-3 frases, o que você está investigando e por que precisa deste tipo de extração]

O módulo deve seguir este formato JSON Schema e ser compatível com o núcleo de extração existente (que já captura: metadados, texto_fonte, argumento, estrutura_conceitual, citações_diretas, conexões, notas_do_pesquisador).

Regras:
1. Crie APENAS campos específicos deste domínio — o que o núcleo já cobre, não repita.
2. Use o mesmo padrão de nomenclatura (snake_case, português sem acento nas chaves).
3. Cada campo deve ter uma "description" clara explicando o que capturar.
4. Pense no que é ESTRUTURANTE deste tipo de texto — o que o diferencia de outros.
5. Inclua campos para capturar tanto o que o texto DIZ quanto o que DEIXA DE DIZER.
6. O módulo deve caber como um objeto adicional no JSON do núcleo.

Formato de saída — responda SOMENTE com o JSON Schema do módulo:

{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Módulo: [Nome]",
  "description": "[O que este módulo captura]",
  "type": "object",
  "properties": {
    "[nome_do_modulo]": {
      "type": "object",
      "properties": {
        ...campos específicos...
      }
    }
  }
}
```

---

## Exemplo de uso

**Input:**
```
DOMÍNIO: discursos políticos (falas em palanque, pronunciamentos oficiais, debates)
CONTEXTO: estudo a construção retórica de legitimidade em discursos de líderes populistas latino-americanos entre 2000-2024.
```

**O que o gerador vai produzir:** um módulo com campos como `retorica` (estratégias persuasivas, apelos emocionais, construção do "povo" vs "elite"), `performance` (cenário, gestos, interrupções), `intertexto_politico` (referências a outros discursos, mitos fundadores), `inimigo_construido` (quem é o adversário e como é caracterizado), etc.

---

## Após gerar

1. Salve como `modulo-NOME.json` na pasta `extrator-modular/`
2. Teste com um texto do domínio
3. Ajuste campos conforme necessário
4. O módulo está pronto para ser combinado com o núcleo e outros módulos
