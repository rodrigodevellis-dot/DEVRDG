# dispositivo-analyzer

Sistema de análise foucaultiana de dispositivos. Repositório-orquestração para Claude Code.

## O que está aqui

Este repositório contém apenas a infraestrutura de orquestração para Claude Code (`CLAUDE.md`, skills, subagentes, hooks). O código de aplicação (`src/`) é construído iterativamente a partir das tarefas descritas em `docs/SPEC.md`.

```
dispositivo-analyzer/
├── CLAUDE.md                     # memória de projeto sempre ativa
├── README.md
├── .claude/
│   ├── settings.json             # configuração de Claude Code (incluindo hooks)
│   ├── skills/                   # workflows reutilizáveis (5 skills)
│   ├── agents/                   # subagentes especializados (4)
│   └── hooks/                    # scripts determinísticos (3)
├── docs/
│   ├── ARCHITECTURE.md           # arquitetura conceitual (foucaultiana)
│   ├── SPEC.md                   # especificação técnica (canônica)
│   ├── CLAUDE_CODE_NOTES.md      # notas sobre orquestração
│   └── ontology.md               # tipologias revisáveis (placeholder)
├── .mcp.json                     # MCP server para PostgreSQL (opcional)
├── .env.example
└── .gitignore
```

## Setup inicial

1. Clonar/inicializar:
   ```bash
   git init
   git add -A
   git commit -m "chore: initial scaffold from Claude Code spec"
   ```

2. Tornar hooks executáveis:
   ```bash
   chmod +x .claude/hooks/*.sh
   ```

3. Copiar `.env.example` para `.env` e preencher.

4. Abrir Claude Code no diretório:
   ```bash
   claude
   ```
   ou abrir no VS Code/desktop com a extensão Claude Code.

5. **Primeira sessão recomendada**: peça a Claude para ler `CLAUDE.md`, `docs/ARCHITECTURE.md`, `docs/SPEC.md`. Em seguida, execute a tarefa T-00 (scaffolding) descrita em `docs/SPEC.md` §6.

## Ordem de leitura recomendada

Para entender o projeto antes de implementar:

1. `CLAUDE.md` — princípios, regras, convenções
2. `docs/ARCHITECTURE.md` — arquitetura conceitual (o que é um dispositivo, como o sistema o representa)
3. `docs/SPEC.md` — decisões técnicas, modelo de dados, contratos, tarefas
4. `docs/CLAUDE_CODE_NOTES.md` — workflow Explore-Plan-Execute, comparação com Codex

## Workflow recomendado

Para cada feature substantiva, seguir o padrão **Explore-Plan-Execute**:

1. **Explore**: invocar subagente `explore-corpus` (se a feature toca o corpus) ou `spec-reviewer` (se toca a especificação).
2. **Plan**: pedir a Claude um plano. Não permitir execução nesta fase. Use `permissionMode: plan`.
3. **Approve**: revisar o plano. Esta é sua intervenção interpretativa principal.
4. **Execute**: despachar implementação.
5. **Review**: invocar `foucauldian-critic` para conteúdo interpretativo, `spec-reviewer` para fidelidade técnica.

Detalhes em `docs/CLAUDE_CODE_NOTES.md` §7.

## O que este repositório NÃO contém ainda

- Código Python da aplicação (`src/dispositivo/`). Construído pela tarefa T-00 e seguintes.
- Migrações Alembic. Construídas pela T-01.
- Frontend. Deferido (ver SPEC.md §10).
- Corpus de documentos. Adicionar em `data/corpus/` quando disponível.

## Licença

A definir. Recomendação: AGPL-3.0 para projeto acadêmico (preserva abertura).
