# AGENTS.md — ESL (Exadel Smart Library) Codebase Guide

This file is the **AI-oriented entry point** for working in the ESL monorepo.
Keep it short, repo-specific, and focused on decision-making. Detailed ESL usage patterns belong in the skills and docs linked below.

## Repository Overview

**ESL** is an Nx-managed monorepo of TypeScript + LESS packages:

| Package | Path | Purpose | Published |
|---|---|---|---|
| `@exadel/esl` | `packages/esl` | Core web-components library | ✓ |
| `@exadel/ui-playground` | `packages/ui-playground` | Real-time code preview widget | ✓ |
| `@exadel/eslint-config-esl` | `packages/eslint-config` | Shared ESLint config | ✓ |
| `@exadel/stylelint-config-esl` | `packages/stylelint-config` | Shared Stylelint config | ✓ |
| `esl-website` | `packages/esl-website` | 11ty + webpack demo site | — internal |
| `esl-website-e2e` | `packages/esl-website-e2e` | Playwright snapshot tests | — internal |
| `esl-website-monitoring` | `packages/esl-website-monitoring` | Website monitoring scripts/actions | — internal |

### Core library shape (`packages/esl/src/<component>/`)
Typical component layout:

```text
esl-<name>/
  core.ts          # only public re-export barrel
  core.less        # styles for custom tags
  core/            # implementation
  test/            # unit tests
```

Rules:
- `core.ts` is the only public component entry.
- Do **not** import from `core/` implementation files as public API.
- Source code lives in `src/`; published build output goes to `modules/`.

## Design Philosophy

ESL is a **base library** — it ships in downstream applications. Each addition is weighed against bundle size, runtime cost, and long-term readability for consumers who will extend and debug it.

When making changes, prefer:

1. **Composition over inheritance**  
   `ESLMixinElement` exists because not every behavior warrants a new custom tag. Before adding a new component, ask whether the behavior should be a mixin on an existing element.

2. **Decorators over boilerplate**  
   Attribute mapping, event subscription, and lifecycle guarding already have first-class primitives such as `@attr`, `@listen`, `@ready`, `@memoize`. Manual `addEventListener`, `removeEventListener`, `getAttribute`, or `setAttribute` inside component code usually means an ESL primitive or utility was missed.

3. **No magic at the call site**  
   Public API should stay readable without internal knowledge. Helpers like `$$find`, `$$fire`, and `$$cls` are intentionally short but explicit. Avoid abstractions that require reading implementation details to understand usage.

4. **Utilities first**  
   Check `packages/esl/src/esl-utils/` before writing helpers. The library already contains traversal, class, async, attribute, focus, and event utilities. Duplication inside component code is a bug, not a style preference. Before implementing any DOM, Async, or Array helper, you must list the contents of esl-utils to check for an existing solution.

5. **Small, targeted diffs**  
   Preserve existing public API, file layout, and naming style unless the task explicitly requires broader refactoring.

## AI Editing Rules

Use these rules when modifying this repository:

### 1. Choose the correct host model
- New custom tag → `ESLBaseElement`
- Attribute-driven behavior on an existing node → `ESLMixinElement`
- In mixins, the real DOM host is `this.$host`, not `this`

For details, see [`packages/esl/skills/esl/references/esl-core.md`](./packages/esl/skills/esl/references/esl-core.md).

### 2. Prefer ESL primitives over raw DOM code
Reach for the existing ESL APIs first:
- decorators: `@attr`, `@boolAttr`, `@jsonAttr`, `@prop`, `@listen`, `@ready`, `@memoize`
- host shortcuts: `$$find`, `$$findAll`, `$$cls`, `$$attr`, `$$fire`, `$$on`, `$$off`
- responsive/event utilities: `ESLTraversingQuery`, `ESLMediaQuery`, `ESLMediaRuleList`, `esl-event-listener` targets

If code looks like generic DOM code with an ESL wrapper, ask which ESL primitive should own it instead.

### 3. Respect public boundaries
- In library source, keep public entrypoints at `core.ts`
- Prefer named exports
- Avoid importing repository internals when a public barrel already exists
- Consumer-facing import patterns are described in [`packages/esl/skills/esl/references/esl-core.md`](./packages/esl/skills/esl/references/esl-core.md)

### 4. Preserve registration and lifecycle contracts
- Set `static is` before `register()`
- Do **not** mutate `is` on built-in ESL components after registration
- Preserve `super.connectedCallback()` / `super.disconnectedCallback()`
- Stable listeners should normally use `@listen`

### 5. Reuse existing event infrastructure
Prefer ESL event abstractions over manual wiring:
- `@listen` for stable class-owned listeners
- `$$on` / `$$off` for dynamic subscriptions
- existing adapters such as resize, intersection, swipe, wheel, or decorated event targets when applicable

### 6. Follow repo conventions via docs, not duplication
- Naming rules: [`docs/CODE_CONVENTIONS.md`](./docs/CODE_CONVENTIONS.md)
- Commit format: [`docs/COMMIT_CONVENTION.md`](./docs/COMMIT_CONVENTION.md)
- Dev workflow and setup: [`docs/DEVELOPMENT.md`](./docs/DEVELOPMENT.md)

### 7. Prefer existing npm scripts and Nx targets
- Prefer existing root or package-level `npm run ...` scripts first; they already encode the supported workflow for this repo.
- If a narrower run is useful, prefer direct Nx targets such as `nx run <project>:<target>` or `nx run-many -t <target>` over ad-hoc commands.
- Keep commands aligned with the requested scope, but remember this repo uses **Nx task caching**: a broader command is often still acceptable because unchanged targets are restored from cache rather than fully re-executed.
- In practice, do not avoid `npm run build`, `npm run test`, or other shared scripts only because they look broader; use a narrower Nx command when it makes the intent clearer or avoids unrelated side effects.

### 8. Validate code changes before completion
- Final code changes should be checked with lint and relevant tests before completion.
- Prefer the existing repo commands for validation first, such as `npm run lint`, `npm run test`, or the corresponding narrower Nx targets when that better matches the change scope.
- When adding or changing functionality in `packages/esl`, propose missing unit tests in the nearest component `test/` folder.

## Skills to Use First

The canonical bundled ESL skill lives in [`packages/esl/skills/esl/SKILL.md`](./packages/esl/skills/esl/SKILL.md).
Its bundled references are also useful for **internal ESL development** because they describe the same `esl-core` mental model and review criteria.

- [`packages/esl/skills/esl/references/esl-core.md`](./packages/esl/skills/esl/references/esl-core.md)  
  Use for component authoring, decorators, host model, traversal, events, media APIs, and idiomatic ESL patterns.

- [`packages/esl/skills/esl/references/esl-review.md`](./packages/esl/skills/esl/references/esl-review.md)  
  Use for review/refactoring tasks: host correctness, public imports, lifecycle, decorators, events, traversal, responsive logic, and existing utility reuse.

Do not duplicate detailed decorator/event/traversal documentation here; keep this file as a router to the canonical skill/docs content.

## Key Commands

Use the docs for full workflow details. The most common commands are:

```bash
npm i
npm run start
npm run build
npm run test
npm run lint
```

These root scripts are wrappers around Nx targets and should usually be the default entrypoint for builds, tests, and linting.

This repo uses **Nx caching**, so broader scoped commands often stay reasonably fast when unaffected targets are restored from cache.

For package-specific or release-related commands, see [`docs/DEVELOPMENT.md`](./docs/DEVELOPMENT.md), `package.json` scripts, and direct Nx targets such as `nx run esl:build` when a narrower command is preferable.

When a narrower scope helps, typical targeted runs include:

```bash
nx run esl:build
nx run esl:test
nx run esl-website:build
nx run esl-website:start
```

## Key Reference Files

- `packages/esl/src/esl-base-element/core/esl-base-element.ts` — root custom-element base class
- `packages/esl/src/esl-mixin-element/` — mixin base model and host-driven behavior
- `packages/esl/src/esl-event-listener/` — event listener system and adapters
- `packages/esl/src/esl-utils/` — decorators, DOM helpers, async helpers, misc utilities
- `packages/esl/src/esl-toggleable/` — toggleable base for Panel, Popup, Alert, and related components
- `packages/esl/src/all.ts` / `all.less` — full library bundle entry points
- `docs/DEVELOPMENT.md` — environment setup and workflows
- `docs/CODE_CONVENTIONS.md` — naming and style conventions
- `docs/COMMIT_CONVENTION.md` — commit message format

## Quick Decision Checklist for AI

Before changing code, verify:
- Is this repo-specific guidance, or should details live in a skill/doc instead?
- Am I using the correct host model (`ESLBaseElement` vs `ESLMixinElement`)?
- Am I reusing existing ESL decorators/utilities/event adapters?
- Am I preserving public entrypoints and lifecycle contracts?
- Have I validated the final change with lint and relevant tests?
- If I changed `packages/esl` functionality, should I add or propose missing unit tests?
- Is the diff as small and readable as possible?
