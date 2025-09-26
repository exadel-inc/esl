import {createRequire} from 'module';
import semiver from 'semiver';
import {resolveRecommendedPluginVersion} from './version.js';

const require = createRequire(import.meta.url);

let _compatChecked = false; // ensures single auto check unless forced

const SEMVER_CORE_RE = /\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?/;
const parseMajor = (v) => Number((v || '0').split('.')[0].replace(/\D/g, ''));

function resolveCurrentVersion() {
  try {
    return require('../../../../package.json').version;
  } catch {
    return null;
  }
}

/**
 * Checks runtime compatibility between this installed config and the ESL package's declared recommendation.
 *
 * Logic:
 * 1. Reads own package version (current config).
 * 2. Reads devDependency range for @exadel/eslint-config-esl from resolved ESL package.
 * 3. Extracts minimal core version token from the range (e.g. ^5.2.0 -> 5.2.0).
 * 4. Warns when majors differ OR current version below minimal required inside same major.
 * 5. Safe: never throws; silent on malformed or missing data.
 *
 * Caching: runs once per process unless force=true provided.
 *
 * @param {boolean} [force=false] Re-run the compatibility check even if it has already executed.
 * @returns {void}
 */
export function checkCompatibility(force = false) {
  if (!force && _compatChecked) return;
  _compatChecked = true;

  const currentVersion = resolveCurrentVersion();
  if (!currentVersion) return;

  const recommendedRange = resolveRecommendedPluginVersion();
  if (!recommendedRange) return;

  const coreMatch = recommendedRange.match(SEMVER_CORE_RE);
  if (!coreMatch) return;

  const minRequired = coreMatch[0];
  const currentMajor = parseMajor(currentVersion);
  const requiredMajor = parseMajor(minRequired);

  if (currentMajor !== requiredMajor) {
    // eslint-disable-next-line @stylistic/max-len
    console.warn(`[@exadel/eslint-config-esl] Version mismatch: ESL recommends major ${requiredMajor} (range: ${recommendedRange}) but installed config is ${currentVersion}. Consider upgrading @exadel/eslint-config-esl.`);
    return;
  }
  try {
    if (semiver(currentVersion, minRequired) < 0) {
      // eslint-disable-next-line @stylistic/max-len
      console.warn(`[@exadel/eslint-config-esl] Outdated version: ESL requires at least ${minRequired} (range: ${recommendedRange}), but found ${currentVersion}. Please update @exadel/eslint-config-esl.`);
    }
  } catch { /* swallow unexpected parse issues */ }
}
