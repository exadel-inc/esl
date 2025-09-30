import {createRequire} from 'module';

const require = createRequire(import.meta.url);

/** Internal cache for resolved ESL package.json object (null when not found). */
let _eslPackageCache; // undefined => not attempted; null => failed; object => pkg.json contents

const tryResolve = (paths) => {
  try {
    return require.resolve('@exadel/esl/package.json', paths ? {paths} : undefined);
  } catch {
    return null;
  }
};

/**
 * Resolves and reads consumer-installed `@exadel/esl` package.json (parsed object).
 *
 * Resolution strategy:
 * 1. Attempt resolution starting from consumer CWD (flat config execution context).
 * 2. Fallback to Node resolution relative to this package.
 * 3. Return null if not found / unreadable.
 *
 * Result is cached for subsequent calls in the same process.
 *
 * @param {boolean} [force=false] Re-resolve even if cached (rarely needed).
 * @returns {object|null} Parsed package.json object or null when unavailable.
 */
export function resolveESLPackage(force = false) {
  if (!force && _eslPackageCache !== undefined) return _eslPackageCache;

  let pkgPath = tryResolve([process.cwd()]);
  if (!pkgPath) pkgPath = tryResolve();
  if (!pkgPath) return (_eslPackageCache = null);

  try {
    _eslPackageCache = require(pkgPath);
  } catch {
    _eslPackageCache = null;
  }
  return _eslPackageCache;
}

/**
 * Gets resolved ESL package version.
 * @param {boolean} [force=false] Force re-resolution of underlying package.
 * @returns {string|null} Version string or null if not found.
 */
export function resolveESLVersion(force = false) {
  const pkg = resolveESLPackage(force);
  return (pkg && pkg.version) || null;
}

/**
 * Resolves recommended @exadel/eslint-config-esl version range declared in ESL devDependencies.
 * @param {boolean} [force=false] Force re-resolution of underlying package.
 * @returns {string|null} Semver range string (e.g. "^5.0.0") or null if not declared.
 */
export function resolveRecommendedPluginVersion(force = false) {
  const pkg = resolveESLPackage(force);
  return (pkg && pkg.devDependencies && pkg.devDependencies['@exadel/eslint-config-esl']) || null;
}
