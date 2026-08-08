# GitHub Copilot Instructions

## Project
Demo of an **agent-driven QA pipeline** on the [RealWorld](https://demo.realworld.show/) app (Medium clone).
The same flow — User Story → Requirements Analysis → Test Design → Test Automation — is driven by custom agents and slash commands.

**Stack:** TypeScript, Playwright.

## Key Directories

| Path | Purpose |
|------|---------|
| `.github/agents/` | Custom agents (Requirements Analysis, Test Designer, Test Automator) |
| `.github/prompts/` | Slash commands (`/analyze`, `/design-tests`, `/automate`) |
| `user-stories/realworld/` | User stories per app |
| `test-cases/realworld/{module}/{US-ID}/ui/` | UI test cases (.md) |
| `test-cases/realworld/{module}/{US-ID}/api/` | API test cases (.md) |
| `src/realworld/ui/` | Page Objects + `RealWorldPageManager` |
| `src/realworld/api/` | API clients + `ApiManager` |
| `src/realworld/base/` | Base fixtures, base page/client |
| `src/realworld/tests/` | Playwright spec files |
| `docs/realworld/` | OpenAPI spec and other references |

---

## Global Rules

- **Read the agent file fully** before starting any work — do not skip steps
- **Do not skip workflow steps** — every step in an agent is mandatory
- **Do not assume** — verify selectors, file contents, and app behavior before writing code
- **Ask, don't workaround** — if actual behavior contradicts a test case or requirement, stop and ask the user
- **Language** — respond in the same language the user wrote in; agent instruction files are in English

---

## Code Conventions

Follow these when writing framework or test code:

- **Page Objects** extend `BasePage`; **API clients** extend `BaseApiClient`.
- Access pages via `RealWorldPageManager` and clients via `ApiManager` — both expose lazy getters (`this._x ??= new X(...)`). Register a new page/client there, never instantiate it directly in a spec.
- Specs import `test` from `src/realworld/base/base-test.ts` and get contexts via the `createPageManagerAs(userName)` / `createApiManagerAs(userName)` fixtures (`userName` = `null` for anonymous, or a user `name` like `user1`).
- **Test IDs** follow `US{NNN}-TC-{NNN}` (API cases use the `-A` variant, e.g. `US001-TC-A006`); tag suites with `@E2E`, `@Extended`, etc.

---

## Running Tests

```bash
npx playwright test                                   # all projects (setup runs first)
npx playwright test --project realworld-setup         # refresh auth tokens into .auth/
npx playwright test --grep @E2E --reporter=line       # filter by tag
```

Auth storage state lives in `.auth/realworld-{user}.json`; the app runs at `http://localhost:8000`.
