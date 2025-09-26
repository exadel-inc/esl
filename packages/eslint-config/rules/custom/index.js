import semiver from 'semiver';
import plugin from './plugin/plugin.js';
import {configs} from './configs.js';
import {resolveESLVersion} from './compatibility/version.js';
import {checkCompatibility} from './compatibility/check.js';

// Detect ESLint verbose mode via CLI flag
const DEBUG = Array.isArray(process.argv) && process.argv.includes('--verbose');

/** Decide if a version falls into a block's range (original simple logic) */
function inRange(version, {min, max}) {
  if (!version) return true; // unknown -> include all (safe superset)
  if (min && semiver(version, min) < 0) return false; // version < min
  if (max && semiver(version, max) >= 0) return false; // version >= max
  return true;
}

/** Build merged config for detected ESL version */
function buildConfigFor(version) {
  const merged = {aliases: {}, paths: {}, staticMembers: {}};
  for (const block of configs) {
    if (!block || typeof block !== 'object') continue;
    if (!inRange(version, block)) continue;
    if (block.aliases) Object.assign(merged.aliases, block.aliases);
    if (block.paths) Object.assign(merged.paths, block.paths);
    if (block.staticMembers) Object.assign(merged.staticMembers, block.staticMembers);
  }
  return merged;
}

/** Assemble rule array from merged config */
function asFlatConfig(cfg, severity = 1) {
  return [{
    plugins: {'@exadel/esl': plugin},
    rules: {
      '@exadel/esl/deprecated-alias': [severity, cfg.aliases],
      '@exadel/esl/deprecated-paths': [severity, cfg.paths],
      '@exadel/esl/deprecated-static': [severity, cfg.staticMembers]
    }
  }];
}

/**
 * Build deprecation configuration for a specific ESL version (testing / manual scenarios).
 * Logs forced version when --verbose supplied.
 * @param {string} eslVersion
 * @param {0|1|2|'off'|'warn'|'error'} [severity=1]
 * @returns {Array<object>}
 */
export function version(eslVersion, severity = 1) {
  if (DEBUG) console.log('[@exadel/eslint-config-esl] building deprecation config for forced ESL version: ' + eslVersion);
  return asFlatConfig(buildConfigFor(eslVersion), severity);
}


let _warnedMissingVersion = false;

/**
 * Build version-aware recommended ESL deprecation configuration.
 * If ESL version can't be resolved, all known deprecations are included (superset) and a warning is logged once.
 * Logs chosen version only if ESLint invoked with --verbose.
 * @param {0|1|2|'off'|'warn'|'error'} [severity=1]
 * @returns {Array<object>}
 */
export function recommended(severity = 1) {
  checkCompatibility();
  const v = resolveESLVersion();
  if (!v && !_warnedMissingVersion) {
    console.warn('[@exadel/eslint-config-esl] ESL package version not detected; applying all known deprecations.');
    _warnedMissingVersion = true;
  }
  return version(v, severity);
}

export default { plugin, configs, recommended, version };
