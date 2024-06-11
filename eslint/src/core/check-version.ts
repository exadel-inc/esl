import {lt} from 'semver';
import color from 'kleur';

const ESL_PACKAGE = '@exadel/esl';
const PLUGIN_PACKAGE = '@exadel/eslint-plugin-esl';

function getInstalledVersion(packageName: string): string | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    return require(`${packageName}/package.json`).version;
  } catch (error) {
    return null;
  }
}

export function checkVersion(): void {
  const eslintVersion = getInstalledVersion(PLUGIN_PACKAGE);
  const eslVersion = getInstalledVersion(ESL_PACKAGE);
  if  (!(eslintVersion && eslVersion && lt(eslintVersion, eslVersion))) return;

  console.log(`\n${color.yellow('⚠️ Warning:')}
  Your installed version of ${color.yellow(PLUGIN_PACKAGE)} (${color.red(eslintVersion)}) \
is lower than version of main package ${color.yellow(ESL_PACKAGE)} (${color.green(eslVersion)}).
  Please update ${color.yellow(PLUGIN_PACKAGE)} to the latest version ${color.green(eslVersion)}\n`);
}
