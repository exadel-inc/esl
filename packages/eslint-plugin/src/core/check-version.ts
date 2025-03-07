import {lt} from 'semver';
import {log} from './log';

export const ESL_PACKAGE = '@exadel/esl';
export const PLUGIN_PACKAGE = '@exadel/eslint-plugin-esl';

export function getInstalledVersion(packageName: string): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(`${packageName}/package.json`).version;
  } catch (error) {
    return '';
  }
}

export const ESL_PACKAGE_VERSION = getInstalledVersion(ESL_PACKAGE);
export const PLUGIN_PACKAGE_VERSION = getInstalledVersion(PLUGIN_PACKAGE);

if (lt(PLUGIN_PACKAGE_VERSION, ESL_PACKAGE_VERSION)) {
  log(`Your installed version of ${PLUGIN_PACKAGE} (${PLUGIN_PACKAGE_VERSION})\
is lower than version of main package ${ESL_PACKAGE} (${ESL_PACKAGE_VERSION}).
Please update ${PLUGIN_PACKAGE} to the latest version ${ESL_PACKAGE_VERSION}`, 'warn');
}
