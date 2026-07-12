# US-001: Publish Article

## Summary
As a registered user, I want to create and publish articles so that other users can read my content.

## Description
Users should be able to create new articles using the editor page. The article form should be easy to use and provide a good writing experience. Once submitted, the article should be immediately visible to all users in the global feed.

Tags can be added to articles to help with content discovery. The system should handle tags in an appropriate way.

## Acceptance Criteria

- AC-1: The editor page is accessible from the navbar for logged-in users via the "New Article" link
- AC-2: The article form contains fields for Title, Description, Body, and Tags
- AC-3: Title, Description and Body are required fields; the form should not submit if they are empty
- AC-4: User can add multiple tags by typing and pressing Enter
- AC-5: Upon successful submission, the user is redirected to the published article page
- AC-6: The published article appears in the global feed
- AC-7: Only the article author can edit or delete their article
- AC-8: The editor should load quickly and handle long articles well

## Out of Scope
_Not defined_
