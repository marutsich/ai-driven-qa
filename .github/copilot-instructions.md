# GitHub Copilot Instructions

## Project
Playwright test automation demo project for the [RealWorld](https://demo.realworld.show/) app (Medium clone).
Stack: TypeScript, Playwright. 
## Key Directories

| Path | Purpose |
|------|---------|
| `user-stories/realworld/` | User stories per app |
| `test-cases/realworld/{module}/{US-ID}/ui/` | UI test cases (.md) |
| `test-cases/realworld/{module}/{US-ID}/api/` | API test cases (.md) |
| `src/realworld/ui/` | Page Objects |
| `src/realworld/tests/` | Playwright spec files |
| `docs/realworld/` | OpenAPI spec and other references |

---

## Global Rules

- **Read the agent file fully** before starting any work — do not skip steps
- **Do not skip workflow steps** — every step in an agent is mandatory
- **Do not assume** — verify selectors, file contents, and app behavior before writing code
- **Ask, don't workaround** — if actual behavior contradicts a test case or requirement, stop and ask the user
- **Language** — respond in the same language the user wrote in; agent instruction files are in English
