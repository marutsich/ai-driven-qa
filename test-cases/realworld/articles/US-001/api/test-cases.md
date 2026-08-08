# Test Design: US-001 — Publish Article (API Suite)

**Date:** 2026-07-15
**Designer:** GitHub Copilot
**Suite:** API
**Endpoint:** `POST /articles`

---

## Scope

**In scope:** `POST /articles` — happy path, validation errors (missing required fields), authentication errors, slug conflict, tag deduplication, field-length BVA

**Out of scope:**
- `GET /articles`, `PUT /articles/{slug}`, `DELETE /articles/{slug}` — not related to article creation; belong to separate stories
- Feed retrieval and response pagination

---

## Techniques Applied

| Technique | Applied to |
|-----------|-----------|
| Equivalence Partitioning (EP) | Valid request / missing required field / no auth / invalid auth |
| Boundary Value Analysis (BVA) | Title at exactly 100 chars (max per Field Constraints), title at 101 chars (over-boundary) |
| Decision Table | All required fields present / each required field omitted individually |
| Error Guessing | Duplicate slug (conflict), duplicate tags in tagList |

---

## Test Cases

---

## US001-TC-A001: Create article with all required fields — happy path

| Field | Value |
|-------|-------|
| **ID** | US001-TC-A001 |
| **AC** | AC-14 |
| **Type** | Critical Path |
| **Layer** | API |
| **Technique** | EP |

**Preconditions:**
- Valid JWT token for a registered user
- No article with the same title exists for this user

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | `POST /articles` with `{ "article": { "title": "API Test Article", "description": "Desc", "body": "Body text" } }` and a valid `Authorization: Token <jwt>` header | Response status is `201`; response body is `{ "article": { "slug": "...", "title": "API Test Article", "description": "Desc", "body": "Body text", "tagList": [], "createdAt": "...", "updatedAt": "...", "favorited": false, "favoritesCount": 0, "author": { "username": "..." } } }` |

---

## US001-TC-A002: Create article with tagList — tags present in response

| Field | Value |
|-------|-------|
| **ID** | US001-TC-A002 |
| **AC** | AC-5 |
| **Type** | Critical Path |
| **Layer** | API |
| **Technique** | EP |

**Preconditions:**
- Valid JWT token for a registered user

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | `POST /articles` with required fields and `"tagList": ["playwright", "api-test"]` | Response status is `201`; `article.tagList` in the response body contains `["playwright", "api-test"]` |

---

## US001-TC-A003: Missing required field — title omitted → 422

| Field | Value |
|-------|-------|
| **ID** | US001-TC-A003 |
| **AC** | AC-4, AC-10 |
| **Type** | Extended |
| **Layer** | API |
| **Technique** | Decision Table |

**Preconditions:**
- Valid JWT token for a registered user

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | `POST /articles` with `description` and `body` present but `title` omitted | Response status is `422`; response body contains an `errors` object with a field indicating the missing title |

---

## US001-TC-A004: Missing required field — description omitted → 422

| Field | Value |
|-------|-------|
| **ID** | US001-TC-A004 |
| **AC** | AC-4 |
| **Type** | Extended |
| **Layer** | API |
| **Technique** | Decision Table |

**Preconditions:**
- Valid JWT token for a registered user

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | `POST /articles` with `title` and `body` present but `description` omitted | Response status is `422`; response body contains an `errors` object with a field indicating the missing description |

---

## US001-TC-A005: Missing required field — body omitted → 422

| Field | Value |
|-------|-------|
| **ID** | US001-TC-A005 |
| **AC** | AC-4, AC-11 |
| **Type** | Extended |
| **Layer** | API |
| **Technique** | Decision Table |

**Preconditions:**
- Valid JWT token for a registered user

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | `POST /articles` with `title` and `description` present but `body` omitted | Response status is `422`; response body contains an `errors` object with a field indicating the missing body |

---

## US001-TC-A006: Create article with no auth token → 401

| Field | Value |
|-------|-------|
| **ID** | US001-TC-A006 |
| **AC** | AC-2 (API equivalent) |
| **Type** | Extended |
| **Layer** | API |
| **Technique** | EP |

**Preconditions:**
- No `Authorization` header in the request

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | `POST /articles` with a valid request body and no `Authorization` header | Response status is `401` |

---

## US001-TC-A007: Create article with invalid auth token → 401

| Field | Value |
|-------|-------|
| **ID** | US001-TC-A007 |
| **AC** | AC-2 (API equivalent) |
| **Type** | Extended |
| **Layer** | API |
| **Technique** | Error Guessing |

**Preconditions:**
- `Authorization` header contains a malformed or expired token

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | `POST /articles` with a valid request body and `Authorization: Token invalid_or_expired_token` | Response status is `401` |

---

## US001-TC-A008: Duplicate article title (slug conflict) → 409

| Field | Value |
|-------|-------|
| **ID** | US001-TC-A008 |
| **AC** | — |
| **Type** | Extended |
| **Layer** | API |
| **Technique** | Error Guessing |

**Preconditions:**
- Valid JWT token for a registered user
- An article with the same title (and therefore the same slug) already exists in the system

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | `POST /articles` with a `title` identical to an existing article | Response status is `409` |

---

## US001-TC-A009: Duplicate tags in tagList are deduplicated in the response

| Field | Value |
|-------|-------|
| **ID** | US001-TC-A009 |
| **AC** | AC-7 |
| **Type** | Extended |
| **Layer** | API |
| **Technique** | Error Guessing |

**Preconditions:**
- Valid JWT token for a registered user

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | `POST /articles` with `"tagList": ["qa", "qa", "automation"]` | Response status is `201`; `article.tagList` in the response contains `["qa", "automation"]` with no duplicates |

---

## US001-TC-A010: Title at exactly 100 characters is accepted (BVA at-boundary)

| Field | Value |
|-------|-------|
| **ID** | US001-TC-A010 |
| **AC** | AC-12 (Field Constraints table) |
| **Type** | Extended |
| **Layer** | API |
| **Technique** | BVA |

> **Note:** Field Constraints specify max title length = 100 chars. AC-12 specifies a UI hard cap of 255 chars — a known discrepancy. This test covers the API at the Field Constraints lower boundary.

**Preconditions:**
- Valid JWT token for a registered user

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | `POST /articles` with `title` set to a string of exactly 100 characters | Response status is `201`; article is created successfully |

---

## US001-TC-A011: Title at 101 characters — API enforcement check (BVA over-boundary)

| Field | Value |
|-------|-------|
| **ID** | US001-TC-A011 |
| **AC** | AC-12 (Field Constraints table) |
| **Type** | Extended |
| **Layer** | API |
| **Technique** | BVA |

> **Note:** Tests whether the API enforces the 100-char title limit stated in Field Constraints. If the API accepts this without error, it indicates enforcement is UI-only — flag as a finding for triage. The AC-12 (255 char) vs Field Constraints (100 char) conflict must also be resolved before automation.

**Preconditions:**
- Valid JWT token for a registered user

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | `POST /articles` with `title` set to a string of exactly 101 characters | Expected: `422` if the API enforces the 100-char limit; if `201` is returned, flag as a finding — API does not enforce the field constraint |

---

## Traceability Matrix

| AC | Test Case IDs | Coverage |
|----|---------------|----------|
| AC-1 | — | Not applicable at API layer |
| AC-2 | US001-TC-A006, US001-TC-A007 | ✓ (auth enforcement) |
| AC-3 | — | UI concern only |
| AC-4 | US001-TC-A003, US001-TC-A004, US001-TC-A005 | ✓ |
| AC-5 | US001-TC-A002 | ✓ |
| AC-7 | US001-TC-A009 | ✓ |
| AC-10 | US001-TC-A003 | ✓ |
| AC-11 | US001-TC-A005 | ✓ |
| AC-12 | US001-TC-A010, US001-TC-A011 | ✓ (pending discrepancy resolution) |
| AC-14 | US001-TC-A001 | ✓ |

---

## Coverage Summary

- **Total API test cases:** 11
- **Critical Path:** 2 | **Extended:** 9
- **Endpoint covered:** `POST /articles` (1 / 1)
- **Known gaps:**
  1. **AC-12 / Field Constraints conflict** — test boundary is 100 chars (Field Constraints) vs 255 chars (AC-12). US001-TC-A011 outcome is conditional until resolved.
  2. **OpenAPI spec does not define field length limits** — BVA tests at the API layer (TC-A010, TC-A011) are derived from the US Field Constraints table, not the spec. API enforcement is assumed.
