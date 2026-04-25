---
name: add-relation-type
description: Adds a new relation type to the taxonomy. Use when the user wants to introduce a new kind of relation between elements (e.g., a new strategic function not yet captured by existing types). Includes seed entry, test, and documentation. Pushes back when the proposed type duplicates existing types under different names.
allowed-tools: Read, Write, Edit, Bash, Grep
---

# Add a new relation type

When invoked, follow these steps strictly. Do not skip steps 1 or 2.

## Step 1: Conceptual check (mandatory)

Ask the user:
- What is the proposed type name (in Portuguese, snake_case)?
- What is the description (one sentence)?
- Is the relation **directional** or **symmetric**? (Most strategic relations
  in Foucault are directional: A `programa_de` B is not the same as B
  `programa_de` A.)
- Should it require **mandatory justification** (`requires_justification`)?
  Use `True` for relations whose attribution is interpretively heavy (e.g.,
  `producao_de_sujeito`, `remplissement`).
- **Mobility test (Cf. Foucault, "Le jeu de Michel Foucault", 1977)**: Can
  the same pair of elements ever stand in *this* relation at one moment and
  in a *different* relation at another? If yes, document the alternative
  relation type so versioning makes sense. If the answer is "no, this is
  permanent once true", flag this — it may indicate the proposed type is
  more structural than strategic, which is a Foucauldian red flag.

## Step 2: Duplication check (mandatory)

Read `scripts/seed_taxonomies.py` and `docs/ontology.md`. Verify the proposed
type is not a synonym for any existing type. The initial taxonomy includes:

- `programa_de`, `justificacao_post_hoc_de`, `obstaculo_a`,
  `resposta_a_urgencia`, `suporte_material_para`, `sobredeterminacao`,
  `remplissement`, `producao_de_sujeito`, `circulacao_de_saber`, `exclusao`

If the user's proposed type overlaps with any of these, ask explicitly:
"Why is this not <existing_type>? What does the new type capture that the
existing one does not?"

Do NOT add a redundant type just because the user prefers different
phrasing. The taxonomy is meant to discriminate, not to mirror vocabulary.

## Step 3: Database seed

Add the new type to `scripts/seed_taxonomies.py` in the relation_types
section. Include:
- name (snake_case, Portuguese)
- description (full sentence, Portuguese)
- is_directional (boolean)
- requires_justification (boolean)

Do NOT modify any Python `enum`. Relation types live in the database.

## Step 4: Test

Add a test in `tests/unit/test_relation_types.py` that:
- Verifies the type exists after seed.
- Creates a `dispositif`, two `elements`, and a `relation` of the new type
  between them.
- If `requires_justification=True`, verifies that creating the relation
  WITHOUT a justification raises a 422.

## Step 5: Documentation

Update `docs/ontology.md` with an entry for the new type. The entry must
include:
- Description.
- An example from the corpus or from Foucault's writing.
- Whether this relation type intersects the discursive/non-discursive
  boundary, and how (Cf. CLAUDE.md Core Commitment #6, first tension).

## Step 6: Commit

Use Conventional Commits:
`feat(taxonomy): add relation type "<n>"`

Body must include the conceptual motivation and the corpus example.

## What this skill does NOT do

- It does not retroactively tag existing relations. Old relations keep their
  types.
- It does not delete or merge existing types. Those are separate operations
  that require an Architecture Decision Record (`docs/adrs/`).
