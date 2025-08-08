#!/usr/bin/env node
import {getVersionForProject} from './common/version.mjs';

const projectName = process.argv[2] || process.env.PROJECT_NAME || '';

try {
  console.log(await getVersionForProject(projectName.trim()));
  process.exit(0);
} catch (error) {
  console.error(`Error retrieving version for project ${projectName}:`, error.message);
  process.exit(1);
}
