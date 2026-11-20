# RealWorld QA Automation

A TypeScript and Playwright test framework for RealWorld, with UI and API coverage for article publishing. Tests run locally, in Docker, and through GitHub Actions, which publishes Playwright HTML and Allure reports. The repository also includes experimental Codex skills and GitHub Copilot agents for QA workflows.

[Published reports](https://marutsich.github.io/realworld-qa-portfolio/) · [Playwright spec](src/realworld/tests/articles/us001-publish-article.spec.ts) · [Quick Start](#quick-start)

## Example — Publish an Article

[US-001 user story](user-stories/realworld/US-001-publish-article-v2.md) → [UI cases](test-cases/realworld/articles/US-001/ui/test-cases.md) and [API cases](test-cases/realworld/articles/US-001/api/test-cases.md) → [Playwright tests](src/realworld/tests/articles/us001-publish-article.spec.ts)

Coverage includes publishing through the UI and finding the article in the global feed, an unauthenticated API request returning `401`, and successful API publishing with a 100-character title.

## Quick Start

Use Node.js 24 and the [hosted RealWorld demo](https://demo.realworld.show/).

```bash
git clone https://github.com/marutsich/realworld-qa-portfolio.git
cd realworld-qa-portfolio
npm ci
npx playwright install chromium
cp example.env .env
```

On Linux, add `--with-deps` to the Chromium install command if system libraries are missing.

Set `REAL_WORLD_PROJECT_DATA` in `.env` as one line of JSON using [`example.env`](example.env). Keep the demo URLs and replace the credential placeholders.

```dotenv
REAL_WORLD_PROJECT_DATA={"baseUrl":"https://demo.realworld.show","apiBaseUrl":"https://api.realworld.show/api/","users":[{"name":"<test-username>","username":"<test-email>","password":"<test-password>"}]}
```

`baseUrl` is the frontend URL and `apiBaseUrl` is the API root. For each user, `name` is the signup username and `username` holds the signup email.

```bash
npm test
npm run report
```

Playwright automatically runs `realworld-setup` before the suite. [Setup](src/realworld/tests/users.setup.ts) submits the demo's signup form and saves the browser session. The hosted demo accepts repeat signup with the same credentials.

```bash
npm run test:e2e -- --reporter=line  # E2E
npm run test:setup                  # Authentication setup
npm run typecheck
npm run lint
npm run format:check
```

## Test Framework

- [Fixtures](src/realworld/base/base-test.ts) create browser and API contexts and provide [Page Objects](src/realworld/ui/RealWorldPageManager.ts) and [API clients](src/realworld/api/ApiManager.ts).
- UI tests load `.auth/realworld-<name>.json` and API tests read its JWT. Fixtures select accounts by worker index or accept an explicit account index or `null` for anonymous access.
- An `afterEach` hook deletes created articles by slug through the API and checks for `204`.

## CI, Docker & Reports

| GitHub Actions workflow | What it does |
| --- | --- |
| [Run Tests from Source](.github/workflows/run_test_from_branch.yml) | Manual run from the selected ref using `npx allure run -- npm test`. |
| [Build Image with Tests](.github/workflows/build-image-with-tests.yml) | Pushes to `master` publish GHCR images tagged `latest` and by commit SHA. |
| [Run Tests from Container](.github/workflows/run_tests_from_container.yml) | Manual run from a GHCR `image_tag` that defaults to `latest`. |
| [Code Static Check](.github/workflows/code-quality.yml) | TypeScript, ESLint and Prettier checks on push or manual dispatch. |

Both test workflows use the `REAL_WORLD_PROJECT_DATA` secret and publish to GitHub Pages. The workflow artifacts retain `reports/playwright-report/`, `reports/allure-report/`, `test-results/` and `allure-results/` for three days.

<details>
<summary>Run locally in Docker and keep reports</summary>

Build from the [Dockerfile](Dockerfile) and reuse the `.env` from Quick Start. Bind mounts preserve the reports and results after `--rm`.

```bash
docker build -t realworld-qa .
mkdir -p playwright-report test-results allure-results allure-report
docker run --rm --init --ipc=host --env-file .env \
  --mount type=bind,source="$(pwd)/playwright-report",target=/app/playwright-report \
  --mount type=bind,source="$(pwd)/test-results",target=/app/test-results \
  --mount type=bind,source="$(pwd)/allure-results",target=/app/allure-results \
  --mount type=bind,source="$(pwd)/allure-report",target=/app/allure-report \
  realworld-qa
```

To use the published image, replace the final argument with `ghcr.io/marutsich/ai-driven-qa:latest`.

</details>

- **Playwright HTML** lives in `playwright-report/`. Open it with `npm run report`.
- **Allure** reports are generated in `allure-report/` by `npx allure run -- npm test` or a Docker run. Open the report with `npx allure open ./allure-report`. If you already ran `npm test`, first generate the report with `npx allure generate ./allure-results`.
- For extracted CI artifacts, use `npm run report -- ./reports/playwright-report` or `npx allure open ./reports/allure-report` from the project root.

## Experimental AI Workflow

Codex skills and GitHub Copilot agents experiment with turning requirements into test cases and Playwright specs.

| Task | Codex | Copilot |
| --- | --- | --- |
| Analyze requirements | [`$analyze`](.agents/skills/analyze/SKILL.md) + story path | [`/analyze`](.github/prompts/analyze.prompt.md) |
| Design tests | [`$design-tests`](.agents/skills/design-tests/SKILL.md) + reviewed story path | [`/design-tests`](.github/prompts/design-tests.prompt.md) |
| Automate cases | [`$automate`](.agents/skills/automate/SKILL.md) + case path and IDs | [`/automate`](.github/prompts/automate.prompt.md) |

[Project instructions](AGENTS.md) · [Copilot agents](.github/agents/) · [Playwright MCP config](.codex/config.toml)
