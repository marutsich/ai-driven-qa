# US-001: Publish Article (v2 — post-analysis)

> **Changelog:** v2 resolves all findings from Requirements Analysis Report dated 2026-07-08.
> P1 and P2 questions answered by BA.

## Summary
As a registered user, I want to create and publish articles so that other users can read my content.

## Description
Logged-in users can create articles via the editor page. On successful submission the article is published immediately and the user is redirected to the article view page. There is no draft or autosave feature — publishing is the only save action.

## Field Constraints

| Field | Required | Min length | Max length | Notes |
|-------|----------|-----------|-----------|-------|
| Title | Yes | 1 char | 100 chars | |
| Description | Yes | 1 char | 300 chars | Subtitle |
| Body | Yes | 1 char | 10 000 chars | |
| Single tag | — | 1 char | 30 chars | |
| Tags collection | — | 0 | 5 tags | Duplicates silently removed |

## Acceptance Criteria

### Editor Access
- AC-1: The "New Article" link is visible in the navbar only for authenticated users
- AC-2: Unauthenticated users who navigate directly to `/editor` are redirected to the login page

### Form Fields
- AC-3: The editor form contains four fields: Title, Description, Body, and a tags inputs
- AC-4: Tags field is optional; Title, Description and Body are required

### Tag Behavior
- AC-5: User adds a tag by typing in the tag input and pressing Enter; the tag appears as a chip below the input and the field clears
- AC-6: User removes a tag by clicking the × button on its chip
- AC-7: If a user adds a tag that already exists on the article, it is silently deduplicated (no error shown, no duplicate chip added)
- AC-8: If a user attempts to add a 6th tag, the input is disabled and an inline message reads: "Maximum 5 tags allowed"
- AC-9: If a tag exceeds 30 characters, the input is disabled at 30 characters (hard cap, no typing beyond limit)

### Validation
- AC-10: If the user submits with Title empty, the form does not submit; a red border appears on the Title field and an inline error message reads: "Title is required"
- AC-11: If the user submits with Body empty, the form does not submit; a red border appears on the Body field and an inline error message reads: "Body is required"
- AC-12: If Title exceeds 255 characters, the input accepts no further characters (hard cap)
- AC-13: If Body exceeds 10 000 characters, the input accepts no further characters (hard cap)

### Submission — Success
- AC-14: On successful publish the user is redirected to the article view page (`/article/{slug}`)
- AC-15: The published article appears in the global feed within 2 seconds of successful submission

### Submission — Failure
- AC-16: If the server returns an error (4xx / 5xx), the form is not cleared; a toast notification appears at the top of the page with the message: "Something went wrong. Please try again."
- AC-17: If a network failure occurs during submission, the same toast as AC-16 is shown and all field values are preserved

### Authorization
- AC-18: The Edit and Delete controls are visible on the article view page only to the article's author
- AC-19: If a non-author navigates directly to `/editor/{slug}`, they are redirected to the article view page (`/article/{slug}`)

### Performance
- AC-20: The editor page is fully interactive (all fields enabled, tag input functional) within 3 seconds on a standard broadband connection
