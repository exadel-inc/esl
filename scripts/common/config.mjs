import path from 'path';
import fs from 'fs/promises';
import { workspaceRoot, createProjectGraphAsync, readProjectsConfigurationFromProjectGraph } from '@nx/devkit';

let projects = null;
export async function getProjects() {
  if (projects) return projects;
  const projectGraph = await createProjectGraphAsync();
  const config = readProjectsConfigurationFromProjectGraph(projectGraph);
  return (projects = config.projects);
}

export async function getProject(projectName) {
  const projects = await getProjects();
  if (!projects[projectName]) {
    throw new Error(`Project "${projectName}" not found in the workspace.`);
  }
  return projects[projectName];
}

export async function resolveProjectFile(projectName, ...pathParts) {
  if (!projectName) return path.join(workspaceRoot, ...pathParts);
  const project = await getProject(projectName);
  return path.join(workspaceRoot, project.root, ...pathParts);
}

export async function getProjectFile(projectName, file) {
  const filePath = await resolveProjectFile(projectName, file);
  try {
    return (await fs.readFile(filePath, 'utf8')).toString();
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Changelog file not found for project "${projectName}".`);
    }
    throw error;
  }
}
