import {createRequire} from 'module';
import semiver from 'semiver';
import {resolveRecommendedPluginVersion} from './version.js';

const require = createRequire(import.meta.url);

let _compatChecked = false; // ensure single warning per process

/**
 * Resolves version from ESL package and compares with current eslint-config version using semiver.
 * If not compatible prints a warning.
 *
 * Compatibility rules:
 * - If ESL package declares a devDependency range for @exadel/eslint-config-esl, we parse its minimal base version.
 * - Warn if current config major doesn't match required major.
 * - Warn if current config version is lower than required minimal within same major.
 * - Otherwise remain silent.
 */
export function checkCompatibility() {
  if (_compatChecked) return; // no-op after first run
  _compatChecked = true;

  let currentPkg;
  try {
    currentPkg = require('../../../../package.json');
  } catch {
    return; // cannot read own package metadata
  }
  const currentVersion = currentPkg && currentPkg.version;
  if (!currentVersion) return;

  const recommendedRange = resolveRecommendedPluginVersion();
  if (!recommendedRange) return; // no declared recommendation

  // Extract first semver-looking core version from the range (handles ^, ~, >= etc.)
  const coreMatch = recommendedRange.match(/\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?/);
  if (!coreMatch) return;
  const minRequired = coreMatch[0];

  const currentCore = currentVersion;

  const parseMajor = (v) => Number((v || '0').split('.')[0].replace(/[^0-9]/g, ''));
  const requiredMajor = parseMajor(minRequired);
  const currentMajor = parseMajor(currentCore);

  if (currentMajor !== requiredMajor) {
    console.warn(`[@exadel/eslint-config-esl] Version mismatch: ESL recommends major ${requiredMajor} (range: ${recommendedRange}) but installed config is ${currentVersion}. Consider upgrading @exadel/eslint-config-esl.`);
    return;
  }

  try {
    if (semiver(currentCore, minRequired) < 0) {
      console.warn(`[@exadel/eslint-config-esl] Outdated version: ESL requires at least ${minRequired} (range: ${recommendedRange}), but found ${currentVersion}. Please update @exadel/eslint-config-esl.`);
    }
  } catch {
    // Fail silently if semiver cannot parse (unexpected pre-release shape); avoid blocking lint
  }
}
