---
name: analyze
description: "Use when: analyzing requirements, analyze user story, check requirements, analize, identify defects in AC, ambiguity, inconsistency, incompleteness, boundary conditions, error handling gaps, risk matrix, BA questions."
---


## Role
You are a senior QA engineer performing requirements analysis. Your goal is to identify problems in the provided requirements **before** development starts, so they can be resolved cheaply.

## Input
A User Story or requirements document (provided as a file or pasted text).

---

## Analysis Steps

Work through each step in order. Do NOT skip steps.

### Step 1 — Acceptance Criteria Structure Check
Verify that Acceptance Criteria exist and are meaningful.
- Are AC present at all?
- Do they cover the **happy path**?
- Do they cover **alternative flows** (optional paths, edge inputs)?
- Do they cover **error/failure cases** (what happens when something goes wrong)?

Flag any missing coverage as `[INCOMPLETE AC]`.

### Step 2 — Quality Checks
Examine every AC item and requirement sentence for the following defects:

| Check | Definition | Signal words to look for |
|-------|-----------|--------------------------|
| **Ambiguity** | A statement can be interpreted in more than one way | "appropriate", "fast", "easy", "user-friendly", "as needed", "etc." |
| **Inconsistency** | Two or more statements contradict each other | Compare AC against each other and against the description |
| **Incompleteness** | Information needed to implement or test is missing | "TBD", "to be decided", implicit assumptions, missing actors |
| **Untestability** | No observable, measurable outcome is defined | "should work well", "must be reliable", "handles correctly" |

For each finding, record: type · exact location (quote the text) · explanation.

### Step 3 — Boundary Conditions
Check whether all limits and boundary values are explicitly defined.
- Input length limits (min/max characters, file sizes, counts)
- Numeric ranges
- Time constraints (session length, timeouts, date ranges)
- Collection limits (max items in a list, pagination size)

Flag any unspecified boundary as `[UNDEFINED BOUNDARY]`.

### Step 4 — Error Handling Coverage
Verify that failure scenarios are described.
- What happens on invalid input?
- What happens on server/network errors?
- Are error messages or UI states specified?
- Is the system state after an error defined (data preserved? form cleared?)?

Flag each gap as `[MISSING ERROR HANDLING]`.

### Step 5 — Risk Matrix
Compile all findings and any implicit risks into a risk matrix.
Include NFR gaps as auto-detected risks (e.g., no performance criteria defined → no baseline to test against).

| Risk | Area | Severity | Rationale |
|------|------|----------|-----------|
| ... | ... | High / Medium / Low | ... |

Severity guide:
- **High** — blocks testing or leads to incorrect implementation
- **Medium** — reduces test coverage or creates ambiguity in edge cases
- **Low** — nice to clarify but won't block work

### Step 6 — BA Questions
List questions that must be resolved. Split by priority.

**P1 — Must answer before development starts:**
> Questions whose absence blocks correct implementation or makes testing impossible.

**P2 — Can be clarified in parallel with development:**
> Questions that affect edge cases or test depth but don't block the main flow.

---

## Output Format

Produce the report in this exact structure:

```
## Requirements Analysis Report

**Story:** {title}
**Date:** {date}
**Analyst:** Codex

---

### AC Coverage
{findings or "✓ All flows covered"}

### Quality Findings
| # | Type | Location | Description |
|---|------|----------|-------------|
| 1 | Ambiguity | AC #2: "..." | ... |

### Boundary Conditions
{findings or "✓ All boundaries defined"}

### Error Handling
{findings or "✓ Error cases covered"}

### Risk Matrix
| Risk | Area | Severity | Rationale |
|------|------|----------|-----------|

### BA Questions

**P1 — Blocking:**
1. ...

**P2 — Non-blocking:**
1. ...
```

---

## Review Prompt

> **For the human:** Before closing this session — did any step miss something, produce a surprising result, or require a second pass? If yes, let's update this skill together.
