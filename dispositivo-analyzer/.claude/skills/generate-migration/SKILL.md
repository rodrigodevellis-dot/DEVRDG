---
name: generate-migration
description: Generates a new Alembic migration following project conventions. Use when a database schema change is required (new table, new column, index, etc.). Avoids common boilerplate errors and ensures bitemporal columns are included where relevant.
allowed-tools: Read, Write, Edit, Bash
---

# Generate an Alembic migration

## Step 1: Confirm scope

Ask the user:
- What is the migration about (one-line summary, in English, snake_case)?
- Is this a CREATE, ALTER, or DROP operation?
- If ALTER: is it on a table that has `valid_from`/`valid_to`/`recorded_at`/
  `superseded_at` columns? If yes, the change must respect bitemporality
  (see project commitment to versioning, SPEC.md §1.2).

## Step 2: Generate skeleton

Run:
```bash
alembic revision -m "<description>"
```

This creates a file in `migrations/versions/` with a timestamp prefix.

## Step 3: Implement upgrade and downgrade

Both `upgrade()` and `downgrade()` must be implemented. Migrations without
working downgrades are rejected.

For new tables, ensure:
- All bitemporal columns present where required by the project model.
- Foreign keys are explicit and named.
- Indexes for common query patterns.

Example skeleton for a bitemporal table:

```python
def upgrade() -> None:
    op.create_table(
        "<table_name>",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        # ... domain columns ...
        sa.Column("valid_from", sa.Date(), nullable=True),
        sa.Column("valid_to", sa.Date(), nullable=True),
        sa.Column("recorded_at", sa.TIMESTAMP(timezone=True),
                  server_default=sa.func.now(), nullable=False),
        sa.Column("superseded_at", sa.TIMESTAMP(timezone=True), nullable=True),
        sa.Column("superseded_by", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("<table_name>.id"), nullable=True),
        sa.Column("metadata", postgresql.JSONB(), nullable=False,
                  server_default="{}"),
    )
    op.create_index(
        "ix_<table_name>_valid",
        "<table_name>",
        ["valid_from", "valid_to"],
    )

def downgrade() -> None:
    op.drop_index("ix_<table_name>_valid", table_name="<table_name>")
    op.drop_table("<table_name>")
```

## Step 4: Test the migration

Run:
```bash
alembic upgrade head
alembic downgrade -1
alembic upgrade head
```

All three must succeed without errors.

## Step 5: Commit

Use Conventional Commits:
`feat(db): <description>` for additive changes
`refactor(db): <description>` for structural changes
`fix(db): <description>` for corrections

The migration file itself goes in the same commit.

## What this skill does NOT do

- It does not generate ORM models. ORM models in `src/dispositivo/db/models/`
  are written separately and must be kept in sync with migrations.
- It does not run on production databases. Always test locally first.
