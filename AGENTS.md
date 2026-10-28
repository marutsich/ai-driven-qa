# Codex Project Instructions

## Project
Demo of an **agent-driven QA pipeline** on the [RealWorld](https://demo.realworld.show/) app (Medium clone).
The same flow — User Story → Requirements Analysis → Test Design → Test Automation — is available through Codex skills and Copilot agents.

**Stack:** TypeScript, Playwright.

## Key Directories

| Path | Purpose |
|------|---------|
| `.agents/skills/` | Codex QA workflows (`$analyze`, `$design-tests`, `$automate`) |
| `.codex/config.toml` | Project-scoped Playwright MCP configuration |
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

- **Read the relevant skill fully** before starting its QA workflow — do not skip steps. Use `analyze` for requirements analysis, `design-tests` for test design, and `automate` for Playwright implementation. For unrelated work, follow these project conventions without starting a QA workflow
- **Do not skip workflow steps** — every step in the selected skill is mandatory
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
npx playwright test --reporter=line                   # all projects (setup runs first)
npx playwright test --project realworld-setup --reporter=line # refresh auth tokens into .auth/
npx playwright test --grep @E2E --reporter=line       # filter by tag
```

Auth storage state lives in `.auth/realworld-{user}.json`; the app runs at `http://localhost:8000`.


## Codex Workflows

- `$analyze <user-story path>`: read `.agents/skills/analyze/SKILL.md` and produce a requirements analysis report.
- `$design-tests <reviewed user-story path>`: read `.agents/skills/design-tests/SKILL.md` and design traceable UI/API cases.
- `$automate <test-case path(s)>`: read `.agents/skills/automate/SKILL.md` and implement and verify the selected cases.
- These skills are workflows executed by the current Codex agent; they do not require spawning separate agents.
- Copilot's `.github/prompts/` slash commands remain available to Copilot. Codex uses the skills above.

## Playwright MCP

The `playwright` server is configured in `.codex/config.toml`. Use its available browser tools for live exploration and locator validation during UI automation; inspect the exposed tool names rather than assuming a client-specific prefix.
If the tools are unavailable, report the connection issue and restore MCP access before continuing steps that require live inspection. Do not claim browser verification without executing it.
Use the app URL from `playwright.config.ts` / local environment (default `http://localhost:8000`). Keep `.env` values and `.auth/` tokens out of reports and committed files.
