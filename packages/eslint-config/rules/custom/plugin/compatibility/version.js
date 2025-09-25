import {createRequire} from 'module';

const require = createRequire(import.meta.url);

/** Internal simple cache for resolved ESL package (full info) */
let _eslPackageCache = undefined; // null | { path: string, pkg: any, version: string|null }

/**
 * Resolve and read consumer-installed `@exadel/esl` package.json (full object, not only version).
 *
 * Resolution strategy:
 * 1. Attempt resolution starting from consumer CWD (flat config execution context)
 * 2. Fallback to Node resolution relative to this package
 * 3. If not found or unreadable, return null
 *
 * Returned object (when found):
 * { path: <absolute path to package.json>, pkg: <parsed package.json>, version: <pkg.version || null> }
 *
 * Value is cached for subsequent calls in the same process.
 *
 * @returns {null | {path: string, pkg: any, version: string|null}}
 */
export function resolveESLPackage() {
  if (_eslPackageCache !== undefined) return _eslPackageCache;

  const tryResolve = (paths) => {
    try {
      return require.resolve('@exadel/esl/package.json', paths ? {paths} : undefined);
    } catch {
      return null;
    }
  };

  // 1. Try from consumer working directory
  let pkgPath = tryResolve([process.cwd()]);
  // 2. Fallback to default resolver (relative to this file/package)
  if (!pkgPath) pkgPath = tryResolve();

  if (!pkgPath) {
    _eslPackageCache = null;
    return _eslPackageCache;
  }

  try {
    _eslPackageCache = require(pkgPath);
  } catch {
    _eslPackageCache = null;
  }
  return _eslPackageCache;
}

/**
 * Resolve recommended version based on esl dev dependencies
 */
export function resolveRecommendedPluginVersion() {
  const info = resolveESLPackage();
  if (!info || !info.devDependencies) return null;
  return info.devDependencies['@exadel/eslint-config-esl'];
}
