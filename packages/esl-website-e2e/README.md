# ESL Website E2E (Playwright)

End-to-end and visual (snapshot) tests for the ESL Website.

This package is part of the ESL monorepo and is executed via Nx.

## Quick start

From the repository root:

1) Install dependencies:

```bash
npm ci
```

2) Install Playwright browsers.

> On Linux it may require elevated privileges ("sudo" / root) to install OS dependencies.

```bash
npx playwright install --with-deps
```

3) Run the E2E tests:

```bash
npm run test:e2e
# or
npx nx run esl-website-e2e:run
```

## Common commands

All commands are expected to be executed from the repository root.

- Run tests:

```bash
npm run test:e2e
# or
npx nx run esl-website-e2e:run
```

- Update Playwright snapshots:

```bash
npm run test:e2e:update
# or
npx nx run esl-website-e2e:run:update
```

- Start the website server (if you want to run Playwright against an already running instance):

```bash
npx nx run esl-website-e2e:run:server
```

## Debugging

### Tracing / video / screenshots

The Playwright configuration is optimized for local debugging:

- locally: tracing is enabled (`trace: 'on'`)
- in CI: tracing is disabled by default and can be enabled via `E2E_DEBUG=1`

You can enable CI-like behaviour locally by setting `CI=1`.

### Playwright report

After a run, the HTML report is available in:

- `packages/esl-website-e2e/playwright-report/`

In CI it is uploaded as an artifact (on failures and on manual runs).

## How it works

The project uses Playwright Test Runner with an Nx wrapper.
The website is started automatically via Playwright `webServer` config:

- command: `npx nx run esl-website:run`
- default URL: `http://127.0.0.1:3007`

You can override the URL with `PLAYWRIGHT_BASE_URL`.

## Project structure

- `tests/` — Playwright tests
- `tests/**/*.spec.ts` — test files
- `tests/*-snapshots/` — Playwright snapshot images
- `common/` — shared helpers used by tests
- `playwright.config.ts` — Playwright configuration (projects, tracing, webServer, etc.)
- `playwright-report/` — HTML report output (generated)
- `test-results/` — raw Playwright artifacts (generated)

## Notes for CI

CI uses the same commands as described above:

- `npm ci`
- `npx playwright install --with-deps`
- `npx nx run esl-website-e2e:run`

For snapshot updates the job runs:

- `npx nx run esl-website-e2e:run:update`

If you edit visual tests or snapshots, make sure you can reproduce the CI flow locally.
