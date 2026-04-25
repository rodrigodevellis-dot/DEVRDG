---
name: verify-foucauldian-fidelity
description: Reviews code, comments, or specification text for conceptual fidelity to Foucault's theory of dispositif. Use after introducing significant interpretive content (e.g., new analysis function, new alert rule, new module docstring) and before committing. Read-only; suggests but does not modify.
allowed-tools: Read, Grep
context: fork
---

# Verify Foucauldian fidelity

This skill runs as a forked subagent. It is read-only.

## Checks to perform

For the file or change under review, verify:

1. **No conflation with non-equivalent concepts**. The text should not use
   "dispositif/dispositivo" interchangeably with "institution", "ideology",
   "episteme", "structure", or "system" without explicit justification.

2. **Heterogeneity preserved**. If the change involves typing, classifying,
   or modeling, it should not collapse heterogeneous element types into a
   single representation (e.g., embeddings of all-elements-as-text without
   preserving type).

3. **Strategy without subject**. Comments or docstrings should not attribute
   intentionality to the dispositif itself. Phrases like "the dispositif
   intends", "the dispositif chose", "the dispositif decided" are red flags.
   Acceptable: "the dispositif produces effect X". Unacceptable: "the
   dispositif aims to do X".

4. **Resistance internalized**. If the change models conflict or contestation,
   it should treat resistance as internal to the network, not as external
   reaction. The relation type `obstaculo_a` is a candidate; `external_attack`
   would be a violation.

5. **Three open tensions respected**. The change should not implicitly
   resolve any of:
   - discursive/non-discursive (do not collapse all elements to text-tokens)
   - what orients strategic convergence (do not attribute it to a subject)
   - dispositif as general/specific/quasi-transcendental (do not unify these)

6. **Citation discipline**. If the file is a module that performs
   conceptually loaded operations (`analysis`, `reflexivity`, `transversal`),
   its docstring should cite a specific Foucauldian source. The hook
   `pre-commit-require-citation.sh` will enforce this at commit time, but
   flag it earlier.

## Output format

Return a structured review:

```
## Verification of <file>

**Verdict**: PASS | FAIL | WARN

**Findings**:

1. [PASS/FAIL/WARN] <Check name>
   <Description and evidence>

**Recommended actions** (if any):

1. <Concrete suggestion with file:line reference>
```

## What this skill does NOT do

- It does NOT auto-fix issues. Suggest, do not modify. The user decides
  whether to accept the suggestion.
- It does NOT block commits. That is the hook's job. This skill is
  preventive, run on demand.
- It does NOT verify accuracy of Foucauldian citations against external
  sources. It only checks that *some* citation exists where required.
  Verifying citation accuracy is a job for `foucauldian-critic` subagent
  in a heavier review.
