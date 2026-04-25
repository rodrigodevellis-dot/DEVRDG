# CLAUDE.md — dispositivo-analyzer

## Project Overview

Foucauldian dispositif analysis system. A research tool for genealogical and
critical analysis of phenomena understood as dispositifs in the sense of Michel
Foucault. See `docs/ARCHITECTURE.md` for the conceptual architecture and
`docs/SPEC.md` for technical decisions.

**Domain language**: Portuguese (Brazilian). **Infrastructure language**:
English. Domain entities use Portuguese names (`dispositivo`, `elemento`,
`relacao`); technical scaffolding uses English (`session`, `migration`,
`endpoint`).

## Core Conceptual Commitments

1. **Dispositif is not institution, not ideology, not episteme, not structure**.
   Conflating it with these reduces analytical surplus. When code or comments
   suggest such a conflation, stop and ask the user.

2. **Heterogeneity is constitutive**. Element types are ontologically distinct
   and must not be flattened into a single representation. Do not propose
   embedding-based homogenization without explicit user approval.

3. **The said and the unsaid are both elements**. Silences are first-class.
   See `src/dispositivo/representation/silences.py`.

4. **Power-knowledge is mutual implication, not succession**. Both edges go
   both ways in the model.

5. **Resistance is internal to the dispositif**. Resistance edges (`obstaculo_a`)
   are part of the network, not external to it.

6. **Three open tensions are deliberate, not bugs**:
   - discursive vs. non-discursive (Foucault declared the distinction "not very
     important" in 1977; the system preserves both as types)
   - what orients strategy without subject (no implementation should answer
     this; the system surfaces convergence, the analyst names it)
   - dispositif as general analytic / specific historical object /
     quasi-transcendental condition (the system should not collapse these)

   If the user proposes resolving any of these in code, flag the conceptual
   risk before proceeding.

## Stack and Tooling Conventions

- Python 3.12+. Use type hints exhaustively; `mypy --strict` must pass.
- PostgreSQL 17 with Apache AGE 1.5+ for graph queries.
- FastAPI 0.110+ for HTTP API.
- SQLAlchemy 2.0+ ORM; raw SQL only for AGE Cypher.
- Pydantic 2.x for validation.
- pytest + hypothesis for tests. Property-based tests for bitemporal invariants.
- structlog for structured logging.
- alembic for migrations.

## Code Conventions

- Module docstrings cite the relevant Foucauldian source where applicable.
  Example: `"""Camada 1 ingestion. Cf. Vigiar e Punir, Parte II, "A Mitigação
  das Penas"."""`
- Public functions have docstrings in Google style.
- All public functions have unit tests.
- No silent failures. Errors propagate or are logged with structlog.
- Naming: domain in Portuguese (`dispositivo`, `elemento`, `criar_elemento`),
  infrastructure in English (`session`, `query`, `migrate`).
- Conventional Commits format: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`,
  `chore:`.

## Hard Rules (enforced by hooks; do not violate)

1. **Taxonomies are revisable from the database, not from code**. Element types
   and relation types live in DB tables (`element_types`, `relation_types`).
   Do NOT introduce Python `enum.Enum` classes for these. The hook
   `pre-edit-no-enum-for-taxonomy.sh` blocks this.

2. **All interpretive operations record provenance**. Functions in the
   `analysis` module that produce candidates (clusters, traces, comparisons)
   must return a clear `is_proposal: True` flag. They must not write
   `interpretations` records automatically.

3. **External LLM calls require document-level opt-in**. Check
   `document.metadata.allow_external_llm` before sending content to APIs
   outside the user's machine.

4. **No automation of the reflexivity layer (Camada 5) without user review**.
   Skills and agents may scaffold structure; alert content and tension
   detection logic require user-authored content.

## When in Doubt

- **Foucauldian fidelity in question?** Stop and ask. Better to pause than to
  invent a definition or assume a reading.
- **Spec ambiguous?** Read `docs/SPEC.md` thoroughly first. If still ambiguous,
  ask, do not guess.
- **Architectural drift?** Invoke the `spec-reviewer` subagent before
  proceeding.

## Useful Skills (auto-invocable)

- `/add-element-type` when adding a new element type to the taxonomy.
- `/add-relation-type` when adding a new relation type.
- `/ingest-corpus` to ingest a directory of documents.
- `/verify-foucauldian-fidelity` to audit code or spec changes for conceptual
  fidelity.
- `/generate-migration` to create an alembic migration following project
  conventions.

## Useful Subagents

- `explore-corpus`: read-only exploration of source documents in
  `data/corpus/`. Use before any analysis task to map content without
  polluting main context.
- `spec-reviewer`: verifies that proposed code matches `docs/SPEC.md`. Use
  before large PRs.
- `foucauldian-critic`: reviews code, comments, and analyses for conceptual
  fidelity. Use whenever interpretive material enters the codebase.
- `code-implementer`: writes new code following CLAUDE.md. Use for
  well-scoped CRUD work.
