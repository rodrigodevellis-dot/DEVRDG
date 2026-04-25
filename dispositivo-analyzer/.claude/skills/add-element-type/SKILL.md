---
name: add-element-type
description: Adds a new element type to the taxonomy. Use when the user wants to introduce a new kind of element (e.g., "ritual", "regime de visibilidade", "modalidade de exame") into the analysis. Includes seed entry, migration if schema changes, test, and documentation update.
allowed-tools: Read, Write, Edit, Bash, Grep
---

# Add a new element type

When invoked, follow these steps strictly. Do not skip step 1.

## Step 1: Conceptual check (mandatory)

Ask the user:
- What is the proposed type name (in Portuguese, snake_case)?
- What is the description?
- Is this a discursive element, a non-discursive element, or deliberately
  ambiguous (silence/non-said)? Reference `CLAUDE.md` Core Commitment #3.
- Why is the existing taxonomy insufficient for this case? Cite at least one
  documentary instance from the corpus that the new type is needed to capture.

If the user cannot answer the last question with a concrete example, push
back: the project does not extend taxonomy speculatively. Better to delay
than to introduce a type without grounding.

## Step 2: Database seed

Add the new type to `scripts/seed_taxonomies.py`. Include:
- name (snake_case, Portuguese)
- description (full sentence, Portuguese)
- is_silence (boolean)
- schema (JSON Schema for the metadata field; can be `{}` if no constraints)

Do NOT modify any Python `enum`. Element types live in the database. The
hook `pre-edit-no-enum-for-taxonomy.sh` will block any such attempt.

## Step 3: Test

Add a test in `tests/unit/test_element_types.py` that verifies the type
exists after running the seed script and that a sample element of this type
can be created and retrieved.

## Step 4: Documentation

Update `docs/ontology.md` with an entry for the new type, including the
documentary motivation cited in Step 1.

## Step 5: Commit

Use Conventional Commits:
`feat(taxonomy): add element type "<name>"`

Body of commit must include the documentary motivation.

## What this skill does NOT do

- It does not edit existing element types. For that, use a separate
  workflow that involves migration and supersession.
- It does not propagate the new type into existing analyses. Existing
  documents are not retro-tagged automatically.
