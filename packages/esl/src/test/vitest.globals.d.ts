// Type hints for Vitest globals in test files.
//
// Some IDEs (e.g., IntelliJ IDEA) may not reliably apply per-file `tsconfig.*.json` settings.
// Keeping this reference in a dedicated .d.ts and including it from `tsconfig.vitest.json`
// ensures `vi`/`expect`/etc. are available only for tests.

/// <reference types="vitest/globals" />
