# CLAUDE_CODE_NOTES.md

Notas específicas sobre como orquestrar a implementação deste projeto usando Claude Code. Complemento ao `SPEC.md` (que é canônico para decisões técnicas) e ao `ARCHITECTURE.md` (que é canônico para a arquitetura conceitual).

---

## 1. Filosofia de orquestração

Codex e Claude Code resolvem o mesmo problema com filosofias diferentes:

- **Codex**: lote assíncrono. Você descreve uma tarefa, ela executa autônoma, devolve PR.
- **Claude Code**: sessão dialógica. Você conversa, planeja, aprova, executa.

Para este projeto — em que decisões interpretativas (taxonomias, redação de alertas, fidelidade conceitual) precedem a execução —, o modelo dialógico se adapta melhor. Mas há custo: Claude Code exige sua presença na sessão.

**Recomendação prática**: Claude Code para o trabalho principal. Codex para tarefas mecânicas isoladas.

---

## 2. Mapa dos artefatos `.claude/`

| Artefato | Função | Quando se aciona |
|---|---|---|
| `CLAUDE.md` | Memória sempre ativa: regras, convenções, princípios. | Toda sessão. |
| `.claude/skills/` | Workflows reutilizáveis (carregam sob demanda). | Quando invocados pelo nome ou auto-detectados pelo `description`. |
| `.claude/agents/` | Subagentes em contextos isolados. | Quando o trabalho merece contexto separado (exploração de corpus, revisão pesada). |
| `.claude/hooks/` | Scripts determinísticos. | Em eventos (`PreToolUse`, `PostToolUse`, `PreCommit`). |
| `.mcp.json` | Conexões externas (PostgreSQL). | Carregado na inicialização. |

---

## 3. Padrão de workflow: Explore-Plan-Execute

Para qualquer feature substantiva, seguir cinco fases:

### Fase 1: Explore
Despachar `explore-corpus` (subagente) ou pedir leitura específica de arquivos. O contexto do explorador é isolado — ele lê muito sem poluir a sessão principal.

### Fase 2: Plan
Pedir um plano. **Não permitir execução nesta fase.** Em Claude Code:
```
> Plan only. Do not modify any files.
```
Ou usar `permissionMode: plan`.

### Fase 3: Approve
Revisar o plano. Esta é sua intervenção interpretativa principal — onde você decide se a abordagem é foucaultianamente fiel, se cobre os casos relevantes, se respeita as tensões em aberto.

### Fase 4: Execute
Despachar `code-implementer` (ou implementação direta no contexto principal). Subagentes em paralelo onde possível.

### Fase 5: Review
- `spec-reviewer` para fidelidade técnica.
- `foucauldian-critic` para fidelidade conceitual (rodar em modelo Opus, em subagente, sempre que conteúdo interpretativo entrar no código).

Os dois revisores são read-only — sugerem, não modificam. Você decide o que aceitar.

---

## 4. Regras invioláveis (enforçadas por hooks)

Diferente de Codex (que depende de o modelo lembrar do "project context" injetado em cada tarefa), Claude Code permite enforcement determinístico via hooks. As regras já implementadas:

| Hook | Função | Bloqueia? |
|---|---|---|
| `pre-edit-no-enum-for-taxonomy.sh` | Bloqueia introdução de `enum.Enum` para taxonomias revisáveis (CLAUDE.md Hard Rule #1). | Sim (exit 2). |
| `pre-commit-require-citation.sh` | Bloqueia commit se módulo interpretativo não tem citação foucaultiana no docstring. | Sim (exit 1). |
| `post-edit-mypy-strict.sh` | Roda `mypy --strict` em arquivos editados. | Não, alerta apenas. |

Para adicionar novos hooks: criar script em `.claude/hooks/`, tornar executável (`chmod +x`), e referenciar em `.claude/settings.json`.

---

## 5. Quando preferir cada artefato

**CLAUDE.md** quando: a regra deve estar sempre presente, em toda sessão, sem que precise ser invocada. Exemplos: "use Conventional Commits", "nomes de domínio em português".

**Skill** quando: o workflow é repetitivo mas não sempre aplicável. Tem custo de tokens só quando carregado. Exemplos: `add-element-type`, `ingest-corpus`.

**Subagente** quando: o trabalho envolve leitura ou exploração intensa que pode poluir o contexto principal. Exemplos: `explore-corpus` (lê muitos documentos), `foucauldian-critic` (lê arquitetura + texto sob revisão).

**Hook** quando: a regra é mecanicamente verificável e inviolável. Exemplos: bloquear enum para taxonomia, exigir citação em commit.

**MCP server** quando: precisa de conexão externa (banco de dados, API). Configurado em `.mcp.json`.

---

## 6. Comparação resumida com a versão Codex (SPEC.md §6)

| Aspecto | Codex (SPEC.md) | Claude Code (este setup) |
|---|---|---|
| Modelo de trabalho | Lote assíncrono | Sessão dialógica |
| Unidade primária | Tarefa T-* com prompt completo | Skill / Subagente / Hook |
| Persistência de regras | Bloco "project context" repetido em cada tarefa | `CLAUDE.md` sempre carregado |
| Enforcement de regras | Por convenção textual | Por hooks determinísticos |
| Isolamento de contexto | PR por tarefa | Subagentes em contextos próprios |
| Decisões interpretativas | Tomadas dentro do PR; revisadas depois | Tomadas em diálogo, antes da execução |
| Custo cognitivo | Baixo durante execução, alto na revisão | Distribuído ao longo da sessão |
| Adequação para tarefas mecânicas | Alta | Média |
| Adequação para trabalho interpretativo | Média | Alta |

---

## 7. O que continua não delegável

Em ambos os modelos (Codex e Claude Code), os mesmos pontos exigem trabalho humano:

- Conteúdo dos alertas reflexivos (Camada 5).
- Decisões sobre tipologias (skills perguntam antes; mas a resposta é sua).
- Constituição de dispositivos como objeto de análise.
- Identificação da urgência histórica orientadora.

Estes pontos estão sinalizados no `CLAUDE.md` e enforçados parcialmente pelos hooks. A fidelidade última depende da sua presença na sessão.

---

## 8. Primeiros passos numa sessão Claude Code

```
1. Abrir Claude Code no diretório raiz.
2. Pedir: "Read CLAUDE.md, docs/ARCHITECTURE.md, and docs/SPEC.md.
   Then propose a plan for executing T-00 (repository scaffolding).
   Do not execute yet — plan only."
3. Revisar o plano. Ajustar se necessário.
4. Aprovar e executar.
5. Quando T-00 estiver completo, repetir o ciclo para T-01.
```

Para tarefas posteriores, considerar despachar `explore-corpus` se o trabalho exige leitura prévia de documentos do corpus.

---

## 9. Quando usar Codex em paralelo

Tarefas adequadas a Codex (despachá-las em paralelo enquanto Claude Code trabalha em T-* interpretativas):

- Atualização de dependências (`pip-tools compile`, etc.).
- Migrações cosméticas que não tocam taxonomia (renames mecânicos, formatação).
- Geração de fixtures de teste a partir de templates.
- Documentação automática a partir de docstrings.
- Tradução de documentação técnica (não conceitual).

Tarefas que devem ficar em Claude Code:

- Tudo que toca os módulos `transversal/`, `reflexivity/`, ou taxonomias.
- Implementação de novas análises na `Camada 4`.
- Refatorações que envolvem julgamento sobre fidelidade ao SPEC.md.
- Trabalho que requer leitura prévia do corpus.
