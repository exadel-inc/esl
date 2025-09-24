# ESL Custom Elements JSX Type Integration Guide

<a name="intro"></a>

This guide explains how to enable TypeScript IntelliSense (props completion, type checking) for ESL custom elements (`<esl-alert>`, `<esl-panel>`, etc.) in different JSX runtimes.

## Contents
1. Overview
2. JSX-DOM v6 (legacy) – zero config
3. JSX-DOM v8+ – manual intrinsic elements augmentation
4. React / Preact – global JSX augmentation
5. Minimal vs full import strategies
6. Advanced: selective tag exposure
7. Project configuration checklist
8. Troubleshooting

---
## 1. Overview
`@exadel/esl` ships tag shape interfaces (e.g. `ESLAlertShape`) and a helper interface `ESLIntrinsicElements` that maps tag names to their TypeScript shapes. To make editors recognize those tags inside TSX/JSX, you must extend the host runtime's `JSX.IntrinsicElements` with `ESLIntrinsicElements`.

## 2. JSX-DOM v6 (legacy)
In JSX-DOM v6, the ESL package automatically augments the global `JSX` namespace. Just import ESL once in your project (usually in your main bundle or `global.d.ts` extra types file) and you can start writing ESL tags:
```ts 
// global.d.ts
import '@exadel/esl';
```

Then use:
```ts
const view = <esl-alert active="" variant="info">Hello</esl-alert>;
```

## 3. JSX-DOM v8+ (current)
Starting from JSX-DOM v8, implicit global augmentation is no longer applied. You must create a declaration file and explicitly extend the runtime module.

Create (or update) `types/global.d.ts` (path/name arbitrary, ensure it is included by `tsconfig.json`):
```ts
// Example: src/types/global.d.ts
import type {ESLIntrinsicElements} from '@exadel/esl';

declare module 'jsx-dom' {
  namespace JSX {
    interface IntrinsicElements extends ESLIntrinsicElements {}
  }
}
```
Usage:
```tsx
export const Card = () => (
  <esl-panel opened>
    <esl-alert variant="success">Done</esl-alert>
  </esl-panel>
);
```

## 4. React / Preact
React 19+ uses module declaration same as JSX-DOM 8:
```ts
// src/types/esl-jsx.d.ts
import type {ESLIntrinsicElements} from '@exadel/esl';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements extends ESLIntrinsicElements {}
  }
}
export {};
```
Then:
```tsx
const Layout = () => (
  <esl-panel-group>
    <esl-panel opened>
      <esl-tooltip for="btn" position="top">Tip</esl-tooltip>
      <button id="btn">Hover me</button>
    </esl-panel>
  </esl-panel-group>
);
```

For older versions of React, the steps declared for legacy JSX-DOM 6 are sufficient - no extra type definitions are required.

## 5. Advanced: selective tag exposure
If you want IntelliSense only for a subset of tags (e.g., design-system curation), build a custom interface:
```ts
import type {ESLAlertShape} from '@exadel/esl/esl-alert/core';
import type {ESLPanelTagShape} from '@exadel/esl/esl-panel/core';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'esl-alert': ESLAlertShape;
      'esl-panel': ESLPanelTagShape;
    }
  }
}
export {};
```
You can still register more elements at runtime; only the curated subset gets editor assistance.

## 6. Project configuration checklist
Ensure:
- `tsconfig.json` has your declaration file in `include` or picked up via `"types"`.
- No conflicting manual `IntrinsicElements` replacement (must extend, not override).
- `skipLibCheck` doesn't hide genuine type issues while integrating (recommended: `false` during setup).
- ESL runtime module imported once so custom elements actually define (types alone don't register elements).

## 7. Troubleshooting
Issue: Tags show red squiggles / unknown intrinsic element.
Fix: Verify the augmentation file is included by TypeScript and that it uses `extends ESLIntrinsicElements`.

Issue: Properties not suggested.
Fix: Confirm you imported the correct shape (e.g., `ESLAlertShape` vs generic). Also ensure language server restart after adding the .d.ts file.

Issue: Works in editor, fails at runtime (unknown element).
Fix: Missing runtime import: `import '@exadel/esl';` or selective `register` imports.

Issue: Duplicate identifier errors.
Fix: Avoid declaring `interface IntrinsicElements` multiple times in the same scope with identical members. Merge them or keep a single file.

Issue: React 17+ automatic runtime.
Fix: Augmentation still applies; your `esl-jsx.d.ts` file just needs to be in scope. No change required.

## Reference
ESL provides the helper interface `ESLIntrinsicElements` (see package `@exadel/esl`) with the following mapping:
```
'esl-a11y-group' -> ESLA11yGroupTagShape
'esl-alert'       -> ESLAlertTagShape
'esl-anchornav'   -> ESLAnchornavTagShape
... (see source: src/types/jsx.shape.ts)
```

Use it to keep your augmentation DRY and automatically in sync with new releases.

---
Questions or suggestions? Open an issue or PR in the ESL repository.

