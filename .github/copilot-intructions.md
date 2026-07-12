# GitHub Copilot Instructions

## Project
Playwright test automation demo project for the [RealWorld](https://demo.realworld.show/) app (Medium clone).
Stack: TypeScript, Playwright. Auth via storage state (`.auth/realworld.json`).

## Key Directories

| Path | Purpose |
|------|---------|
| `ai/` | Agent instruction files |
| `user-stories/realworld/` | User stories per app |
| `test-cases/realworld/{module}/{US-ID}/ui/` | UI test cases (.md) |
| `test-cases/realworld/{module}/{US-ID}/api/` | API test cases (.md) |
| `src/realworld/ui/` | Page Objects |
| `src/realworld/tests/` | Playwright spec files |
| `docs/realworld/` | OpenAPI spec and other references |

---

## Agent Routing

When the user's request matches a key phrase — load the corresponding agent file and follow it fully before doing anything else.

| Key phrases | Agent | Invoke with |
|-------------|-------|-------------|
| "analyze requirements", "check requirements" | Requirements Analysis | `#file:ai/REQUIREMENTS_ANALYSIS.md` |
| "design test cases", "create test cases", "write test cases" | Test Designer | `#file:ai/TEST_DESIGNER.md` |
| "automate", "write test", "automate UI", "automate API" | Test Automator | `#file:ai/TEST_AUTOMATOR.md` |

---

## Global Rules

- **Read the agent file fully** before starting any work — do not skip steps
- **Do not skip workflow steps** — every step in an agent is mandatory
- **Do not assume** — verify selectors, file contents, and app behavior before writing code
- **Ask, don't workaround** — if actual behavior contradicts a test case or requirement, stop and ask the user
- **Language** — respond in the same language the user wrote in; agent instruction files are in English
