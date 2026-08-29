import fs from 'fs/promises';
import path from 'path';
import { workspaceRoot } from '@nx/devkit';
import { getProject, getProjectFile } from './config.mjs';

function normalizeProjects(projects) {
  if (!projects) return [];
  return Array.isArray(projects) ? projects : [projects];
}

function interpolateReleaseTag(pattern, projectName, version) {
  return pattern
    .replaceAll('{projectName}', projectName)
    .replaceAll('{version}', version);
}

function getReleaseTagGlob(pattern, projectName) {
  return pattern
    .replaceAll('{projectName}', projectName)
    .replaceAll('{version}', '*');
}

function getTarballFileName(packageName, version) {
  return `${packageName.replace(/^@/, '').replaceAll('/', '-')}-${version}.tgz`;
}

export async function getNxReleaseConfig() {
  const nxJsonPath = path.join(workspaceRoot, 'nx.json');
  return JSON.parse(await fs.readFile(nxJsonPath, 'utf8')).release || {};
}

export async function getPackageManifestForProject(projectName) {
  return JSON.parse(await getProjectFile(projectName, 'package.json'));
}

function getGroupProjectsRelationship(group, release) {
  return group.projectsRelationship || release.projectsRelationship || 'fixed';
}

function getGroupVersion(groupName, projects, projectsRelationship) {
  const versions = [...new Set(projects.map((project) => project.version))];

  if (projectsRelationship === 'independent' && projects.length > 1) {
    throw new Error(`Release group "${groupName}" must be fixed to produce one tag and GitHub Release.`);
  }
  if (versions.length !== 1) {
    throw new Error(`Release group "${groupName}" has projects with different versions: ${versions.join(', ')}.`);
  }

  return versions[0];
}

export async function getReleaseGroups() {
  const release = await getNxReleaseConfig();
  const groups = release.groups || {};
  const result = [];

  for (const [groupName, group] of Object.entries(groups)) {
    const projectNames = normalizeProjects(group.projects);
    if (projectNames.length === 0) {
      throw new Error(`Release group "${groupName}" must target at least one project.`);
    }

    const projects = await Promise.all(projectNames.map(async (projectName) => {
      const [project, manifest] = await Promise.all([
        getProject(projectName),
        getPackageManifestForProject(projectName)
      ]);
      return {
        projectName,
        projectRoot: project.root,
        packageName: manifest.name,
        private: manifest.private === true,
        version: manifest.version,
        tarballFileName: getTarballFileName(manifest.name, manifest.version),
        hasPackTarget: Boolean(project.targets?.pack)
      };
    }));
    const projectsRelationship = getGroupProjectsRelationship(group, release);
    const version = getGroupVersion(groupName, projects, projectsRelationship);
    const releaseTagPattern = group.releaseTag?.pattern || release.releaseTag?.pattern || 'v{version}';
    if (projects.length > 1 && releaseTagPattern.includes('{projectName}')) {
      throw new Error(`Release group "${groupName}" cannot use {projectName} in a shared release tag.`);
    }
    const releaseTag = interpolateReleaseTag(releaseTagPattern, projects[0].projectName, version);
    const tarballFileNames = projects
      .filter((project) => !project.private && project.hasPackTarget)
      .map((project) => project.tarballFileName);

    result.push({
      groupName,
      projectsRelationship,
      projects,
      projectNames,
      version,
      isPrerelease: version.includes('-'),
      releaseTagPattern,
      releaseTagGlob: getReleaseTagGlob(releaseTagPattern, projects[0].projectName),
      releaseTag,
      changelogProjects: projects.map((project) => `${project.projectName}@${version}`).join(','),
      tarballFileNames,
      artifacts: tarballFileNames.map((fileName) => `target/${fileName}`).join(',')
    });
  }

  return result;
}

export async function getPublicReleaseProjectNames() {
  const groups = await getReleaseGroups();
  return groups.flatMap((group) => group.projects)
    .filter((project) => !project.private)
    .map((project) => project.projectName);
}


