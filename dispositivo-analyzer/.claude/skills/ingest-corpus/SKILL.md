---
name: ingest-corpus
description: Ingests a directory of documents into the system. Use when the user provides a corpus path and wants to populate the documents table. Handles PDF, DOCX, HTML, TXT, EPUB. Reports failures explicitly; never silently drops files. Runs as a forked subagent to keep main context clean.
allowed-tools: Read, Bash, Grep
context: fork
---

# Ingest a corpus

Run as a forked subagent (own context window), because corpus exploration
involves reading many files and would pollute the main session.

## Step 1: Inventory

Use `Bash` with `find` to inventory files in the corpus directory. Group by
extension. Report counts.

Example:
```bash
find <corpus_path> -type f \( -name "*.pdf" -o -name "*.docx" -o -name "*.html" -o -name "*.txt" -o -name "*.epub" \) | awk -F. '{print tolower($NF)}' | sort | uniq -c
```

Ask the user to confirm the inventory before proceeding. If unexpected file
types appear, ask what to do with them.

## Step 2: Ingest

Invoke the CLI for each file:
```bash
dispositivo ingest <file>
```

For each file:
- Success → record UUID and content_hash.
- Failure → record file path and error message; do NOT abort the batch.

Track progress: report every 10 files processed.

## Step 3: Sensitivity flagging

For each ingested document, ask the user (or check existing user preferences
in `.env`):
- Does this document contain personal/clinical/sensitive data?
- Should `allow_external_llm` be enabled for this document?

Default to `False` for both unless user confirms otherwise.

The user may answer once for the whole batch ("all clinical, none allow
external LLM") rather than per-file.

## Step 4: Report

Produce a markdown report in the main session summarizing:
- N files ingested
- N failures (with paths and error messages)
- M documents flagged sensitive
- K documents allowing external LLM
- Distribution by document type

The full file-by-file detail stays in the subagent context. The main session
gets the summary only.

## What this skill does NOT do

- It does not run NLP analysis at ingestion. Ingestion is dumb on purpose;
  analysis happens later (see `dispositivo analyze` CLI commands).
- It does not deduplicate manually. The system deduplicates by content_hash
  automatically; if a file is reported as "already ingested", that's
  expected behavior, not an error.
- It does not modify existing documents. Re-ingesting a changed file
  produces a new document with reference to the previous version.
