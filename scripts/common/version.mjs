import {getProjectFile} from './config.mjs';

export async function getVersionForProject(projectName) {
  const packageJson = await getProjectFile(projectName, 'package.json');
  return JSON.parse(packageJson).version;
}
