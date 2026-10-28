# Test Design: US-001 — Publish Article (UI Suite)

**Date:** 2026-07-15
**Designer:** GitHub Copilot
**Suite:** UI

---

## Scope

**In scope:** AC-1 through AC-19 — Editor Access, Form Fields, Tag Behavior, Validation, Submission (success and failure), Authorization, Feed visibility

**Out of scope:**
- AC-20 (Performance) — non-functional; requires dedicated performance tooling outside this functional test suite
- API contract testing — covered in the API suite

---

## Techniques Applied

| Technique | Applied to |
|-----------|-----------|
| Equivalence Partitioning (EP) | Required vs. optional fields; authenticated vs. unauthenticated users; author vs. non-author roles |
| Boundary Value Analysis (BVA) | Title cap (255 chars per AC-12), Body cap (10 000 chars), tag length cap (30 chars), tag count cap (5) |
| Decision Table | Submission with empty Title / empty Body / empty Description / all valid |
| State Transition | Auth state (unauth → login); article lifecycle (draft input → published); tag chip state (add → remove) |
| Error Guessing | Server 4xx/5xx during submit, network failure, duplicate tags, non-author accessing /editor/{slug} |
| Exploratory | Description empty-submit behavior (AC-4 states required, but no explicit error UI spec provided) |

---

## Test Cases

---

## US001-TC-001: "New Article" navbar link is visible only for authenticated users

| Field | Value |
|-------|-------|
| **ID** | US001-TC-001 |
| **AC** | AC-1 |
| **Type** | Smoke |
| **Layer** | UI |
| **Technique** | EP |

**Preconditions:**
- A registered user account exists
- Two sessions available: one authenticated (logged in), one unauthenticated

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open the application as an authenticated user | Navbar contains a "New Article" link |
| 2 | Open the application as an unauthenticated user (or log out) | Navbar does NOT contain a "New Article" link |

---

## US001-TC-002: Successfully publish article with required fields only — redirect to article view

| Field | Value |
|-------|-------|
| **ID** | US001-TC-002 |
| **AC** | AC-3, AC-4, AC-14 |
| **Type** | Critical Path |
| **Layer** | UI |
| **Technique** | EP |

**Preconditions:**
- Logged in as a registered user
- An article with the same title does not already exist for this user

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Click "New Article" in the navbar | Editor page (`/editor`) opens; form contains exactly four fields: Title, Description, Body, and a Tags input |
| 2 | Enter a valid title (e.g. "Test Article 001") in the Title field | Title field populated |
| 3 | Enter a valid description (e.g. "Short description") in the Description field | Description field populated |
| 4 | Enter a valid body (e.g. "Article body content.") in the Body field | Body field populated |
| 5 | Leave the Tags field empty | Tags field is empty |
| 6 | Click "Publish Article" | User is redirected to the article view page (`/article/{slug}`); page displays the correct title, description, and body |

---

## US001-TC-003: Successfully publish article with tags — tags displayed on article view

| Field | Value |
|-------|-------|
| **ID** | US001-TC-003 |
| **AC** | AC-5, AC-14 |
| **Type** | Critical Path |
| **Layer** | UI |
| **Technique** | EP |

**Preconditions:**
- Logged in as a registered user
- An article with the same title does not already exist for this user

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Navigate to `/editor` | Editor page opens |
| 2 | Fill in Title, Description, and Body with valid values | Fields populated |
| 3 | Type "playwright" in the Tags input and press Enter | Tag chip "playwright" appears below the input; the Tags input field clears |
| 4 | Type "testing" in the Tags input and press Enter | Tag chip "testing" appears; the Tags input field clears; both chips are visible |
| 5 | Click "Publish Article" | User is redirected to the article view page; the tags "playwright" and "testing" are displayed on the article |

---

## US001-TC-004: Unauthenticated access to /editor redirects to login

| Field | Value |
|-------|-------|
| **ID** | US001-TC-004 |
| **AC** | AC-2 |
| **Type** | Extended |
| **Layer** | UI |
| **Technique** | State Transition |

**Preconditions:**
- User is not logged in (no valid session)

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Navigate directly to `/editor` in the browser | User is redirected to the login page |

---

## US001-TC-005: Submit with empty Title — validation error shown, form not submitted

| Field | Value |
|-------|-------|
| **ID** | US001-TC-005 |
| **AC** | AC-10 |
| **Type** | Extended |
| **Layer** | UI |
| **Technique** | Decision Table |

**Preconditions:**
- Logged in as a registered user

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Navigate to `/editor` | Editor page opens |
| 2 | Leave the Title field empty; fill in Description and Body with valid values | Title is empty; other fields populated |
| 3 | Click "Publish Article" | Form does not submit; Title field has a red border; inline error message "Title is required" is visible below the Title field |

---

## US001-TC-006: Submit with empty Body — validation error shown, form not submitted

| Field | Value |
|-------|-------|
| **ID** | US001-TC-006 |
| **AC** | AC-11 |
| **Type** | Extended |
| **Layer** | UI |
| **Technique** | Decision Table |

**Preconditions:**
- Logged in as a registered user

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Navigate to `/editor` | Editor page opens |
| 2 | Fill in Title and Description with valid values; leave the Body field empty | Body is empty; other fields populated |
| 3 | Click "Publish Article" | Form does not submit; Body field has a red border; inline error message "Body is required" is visible below the Body field |

---

## US001-TC-007: Submit with empty Description — form does not submit

| Field | Value |
|-------|-------|
| **ID** | US001-TC-007 |
| **AC** | AC-4 |
| **Type** | Extended |
| **Layer** | UI |
| **Technique** | Decision Table, Exploratory |

> **Gap:** AC-4 states Description is required, but no explicit validation UI behavior is defined (no equivalent of AC-10/AC-11 for Description — no error message text or visual spec). This test asserts the form does not submit; the exact validation indicator is to be confirmed with the team.

**Preconditions:**
- Logged in as a registered user

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Navigate to `/editor` | Editor page opens |
| 2 | Fill in Title and Body with valid values; leave Description empty | Description is empty; other fields populated |
| 3 | Click "Publish Article" | Form does not submit; a validation indicator is displayed on the Description field |

---

## US001-TC-008: Title field enforces hard character cap at 255 characters

| Field | Value |
|-------|-------|
| **ID** | US001-TC-008 |
| **AC** | AC-12 |
| **Type** | Extended |
| **Layer** | UI |
| **Technique** | BVA |

> **Risk:** AC-12 states the hard cap is 255 characters, but the Field Constraints table specifies max 100 characters. This test uses 255 as stated in AC-12. The discrepancy must be resolved before automation.

**Preconditions:**
- Logged in as a registered user

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Navigate to `/editor` | Editor page opens |
| 2 | Paste a string of exactly 255 characters into the Title field | All 255 characters are accepted |
| 3 | Attempt to type one additional character | The character is not accepted; the Title field contains exactly 255 characters |

---

## US001-TC-009: Body field enforces hard character cap at 10 000 characters

| Field | Value |
|-------|-------|
| **ID** | US001-TC-009 |
| **AC** | AC-13 |
| **Type** | Extended |
| **Layer** | UI |
| **Technique** | BVA |

**Preconditions:**
- Logged in as a registered user

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Navigate to `/editor` | Editor page opens |
| 2 | Paste a string of exactly 10 000 characters into the Body field | All 10 000 characters are accepted |
| 3 | Attempt to type one additional character | The character is not accepted; the Body field contains exactly 10 000 characters |

---

## US001-TC-010: Tag addition via Enter key and removal via × button

| Field | Value |
|-------|-------|
| **ID** | US001-TC-010 |
| **AC** | AC-5, AC-6 |
| **Type** | Extended |
| **Layer** | UI |
| **Technique** | State Transition |

**Preconditions:**
- Logged in as a registered user
- Editor page is open (`/editor`)

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Type "automation" in the Tags input and press Enter | Tag chip "automation" appears below the Tags input; the Tags input field is cleared |
| 2 | Click the × button on the "automation" chip | The "automation" chip is removed; the tag list is empty |

---

## US001-TC-011: Duplicate tag is silently deduplicated

| Field | Value |
|-------|-------|
| **ID** | US001-TC-011 |
| **AC** | AC-7 |
| **Type** | Extended |
| **Layer** | UI |
| **Technique** | Error Guessing |

**Preconditions:**
- Logged in as a registered user
- Editor page is open (`/editor`)
- Tag chip "demo" is already present

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Type "demo" in the Tags input and press Enter | No error is displayed; no duplicate "demo" chip is added; exactly one "demo" chip remains |

---

## US001-TC-012: Adding a 6th tag disables the input and shows inline message

| Field | Value |
|-------|-------|
| **ID** | US001-TC-012 |
| **AC** | AC-8 |
| **Type** | Extended |
| **Layer** | UI |
| **Technique** | BVA |

**Preconditions:**
- Logged in as a registered user
- Editor page is open (`/editor`)

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Add 5 unique tags one by one (type each and press Enter) | 5 tag chips appear; after the 5th chip is added, the Tags input becomes disabled; inline message "Maximum 5 tags allowed" is displayed |
| 2 | Attempt to click or interact with the Tags input | Input remains non-interactive (disabled) |

---

## US001-TC-013: Tag input enforces hard character cap at 30 characters

| Field | Value |
|-------|-------|
| **ID** | US001-TC-013 |
| **AC** | AC-9 |
| **Type** | Extended |
| **Layer** | UI |
| **Technique** | BVA |

**Preconditions:**
- Logged in as a registered user
- Editor page is open (`/editor`)

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Type a string of exactly 30 characters into the Tags input | All 30 characters are accepted |
| 2 | Attempt to type one additional character | The extra character is not accepted; the Tags input contains exactly 30 characters |

---

## US001-TC-014: Server error during submit — toast shown, form values preserved

| Field | Value |
|-------|-------|
| **ID** | US001-TC-014 |
| **AC** | AC-16 |
| **Type** | Extended |
| **Layer** | UI |
| **Technique** | Error Guessing |

**Preconditions:**
- Logged in as a registered user
- `POST /articles` network request is intercepted and forced to return a 500 response (e.g. via `page.route()`)

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Navigate to `/editor`; fill in valid Title, Description, and Body | Fields populated |
| 2 | Click "Publish Article" | A toast notification appears at the top of the page with the message "Something went wrong. Please try again."; the form is not cleared; all field values are preserved |

---

## US001-TC-015: Network failure during submit — toast shown, form values preserved

| Field | Value |
|-------|-------|
| **ID** | US001-TC-015 |
| **AC** | AC-17 |
| **Type** | Extended |
| **Layer** | UI |
| **Technique** | Error Guessing |

**Preconditions:**
- Logged in as a registered user
- Network connectivity is aborted for the submit request (e.g. via `route.abort()`)

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Navigate to `/editor`; fill in valid Title, Description, and Body | Fields populated |
| 2 | Click "Publish Article" | A toast notification appears at the top of the page with the message "Something went wrong. Please try again."; the form is not cleared; all field values are preserved |

---

## US001-TC-016: Edit and Delete controls visible only to the article author

| Field | Value |
|-------|-------|
| **ID** | US001-TC-016 |
| **AC** | AC-18 |
| **Type** | Extended |
| **Layer** | UI |
| **Technique** | EP |

**Preconditions:**
- Article with known slug exists, authored by User A
- User A and User B (non-author) are both registered users

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as User A (author) and navigate to `/article/{slug}` | Edit and Delete controls are visible on the article view page |
| 2 | Log in as User B (non-author) and navigate to `/article/{slug}` | Edit and Delete controls are NOT visible |

---

## US001-TC-017: Non-author navigating to /editor/{slug} is redirected to article view

| Field | Value |
|-------|-------|
| **ID** | US001-TC-017 |
| **AC** | AC-19 |
| **Type** | Extended |
| **Layer** | UI |
| **Technique** | Error Guessing |

**Preconditions:**
- Article with known slug exists, authored by User A
- User B (non-author) is logged in

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As User B, navigate directly to `/editor/{slug}` | User is redirected to the article view page (`/article/{slug}`) |

---

## US001-TC-018: Published article appears in global feed within 2 seconds

| Field | Value |
|-------|-------|
| **ID** | US001-TC-018 |
| **AC** | AC-15 |
| **Type** | Extended |
| **Layer** | UI |
| **Technique** | Exploratory |

**Preconditions:**
- Logged in as a registered user
- Article has just been published; user is on the article view page

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Navigate to the home page (global feed) immediately after the publish redirect | The newly published article is visible in the global feed within 2 seconds of successful submission |

---

## US001-TC-019: [E2E] Full happy-path journey — authenticated user publishes article visible in global feed

| Field | Value |
|-------|-------|
| **ID** | US001-TC-019 |
| **AC** | AC-1, AC-3, AC-5, AC-14, AC-15, AC-18 |
| **Type** | E2E |
| **Layer** | UI |
| **Technique** | State Transition |

**Preconditions:**
- Setup has saved a registered user's authenticated storage state; the UI fixture loads it without another login
- No article with the title "E2E Test Article" exists for this user

**Steps:**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open the application using the authenticated UI fixture | User is authenticated; navbar shows "New Article" link |
| 2 | Click "New Article" in the navbar | Editor page (`/editor`) opens |
| 3 | Enter "E2E Test Article" in Title, "E2E description" in Description, "E2E body content." in Body | All three fields populated |
| 4 | Type "e2e" in the Tags input and press Enter | Tag chip "e2e" appears; Tags input clears |
| 5 | Click "Publish Article" | User is redirected to `/article/{slug}`; article displays correct title, body, and tag "e2e"; Edit and Delete controls are visible |
| 6 | Navigate to the home page | The published article "E2E Test Article" appears in the global feed |

---

## Traceability Matrix

| AC | Test Case IDs | Coverage |
|----|---------------|----------|
| AC-1 | US001-TC-001, US001-TC-019 | ✓ |
| AC-2 | US001-TC-004 | ✓ |
| AC-3 | US001-TC-002 | ✓ |
| AC-4 | US001-TC-002, US001-TC-005, US001-TC-006, US001-TC-007 | ✓ (gap: no validation UI spec for Description — see TC-007) |
| AC-5 | US001-TC-003, US001-TC-010 | ✓ |
| AC-6 | US001-TC-010 | ✓ |
| AC-7 | US001-TC-011 | ✓ |
| AC-8 | US001-TC-012 | ✓ |
| AC-9 | US001-TC-013 | ✓ |
| AC-10 | US001-TC-005 | ✓ |
| AC-11 | US001-TC-006 | ✓ |
| AC-12 | US001-TC-008 | ✓ (risk: AC says 255 chars, Field Constraints says 100 chars) |
| AC-13 | US001-TC-009 | ✓ |
| AC-14 | US001-TC-002, US001-TC-003, US001-TC-019 | ✓ |
| AC-15 | US001-TC-018, US001-TC-019 | ✓ |
| AC-16 | US001-TC-014 | ✓ |
| AC-17 | US001-TC-015 | ✓ |
| AC-18 | US001-TC-016, US001-TC-019 | ✓ |
| AC-19 | US001-TC-017 | ✓ |
| AC-20 | — | [NOT COVERED] — out of scope (performance / non-functional) |

---

## Coverage Summary

- **Total UI test cases:** 19
- **Smoke:** 1 | **Critical Path:** 2 | **Extended:** 15 | **E2E:** 1
- **ACs fully covered:** 19 / 20 (AC-20 intentionally out of scope)
- **Known gaps carried from analysis:**
  1. **AC-12 vs Field Constraints conflict** — AC-12 states hard cap at 255 chars; Field Constraints table states max 100 chars. US001-TC-008 uses 255 (per AC). Needs BA/dev clarification before automation.
  2. **Description empty validation UI** — AC-4 marks Description as required but specifies no error message text or visual behavior. US001-TC-007 is marked Exploratory; the exact assertion needs to be confirmed with the team.
  3. **AC-20 (Performance)** — The 3-second interactivity requirement needs a dedicated performance test approach (e.g. Lighthouse, k6) not covered here.
