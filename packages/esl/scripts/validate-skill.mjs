import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {parseDocument} from 'yaml';

const currentDir = fileURLToPath(new URL('.', import.meta.url));
const projectRoot = path.resolve(currentDir, '..');
const skillRoot = path.join(projectRoot, 'skills/esl');
const skillFile = path.join(skillRoot, 'SKILL.md');
const referenceFiles = [
  'references/esl-core.md',
  'references/esl-review.md'
].map((file) => path.join(skillRoot, file));

const legacyArtifacts = [
  {token: '\\---', message: 'Found escaped frontmatter marker `\\---`.'},
  {token: '&#x20;', message: 'Found escaped HTML space entity `&#x20;`.'},
  {token: '\\#', message: 'Found escaped markdown heading marker `\\#`.'},
  {token: '\\-', message: 'Found escaped markdown list marker `\\-`.'}
];

const fail = (message) => {
  throw new Error(`[esl:lint:skills] ${message}`);
};

const relativeToProject = (filePath) => path.relative(projectRoot, filePath).replace(/\\/g, '/');

const ensureFileExists = (filePath) => {
  if (!fs.existsSync(filePath)) fail(`Missing required file: ${relativeToProject(filePath)}`);
};

const readUtf8 = (filePath) => fs.readFileSync(filePath, 'utf8');

const extractFrontmatter = (content) => {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) fail('SKILL.md must start with a valid YAML frontmatter block.');
  return match[1];
};

const parseFrontmatter = (content) => {
  const frontmatterSource = extractFrontmatter(content);
  const document = parseDocument(frontmatterSource);

  if (document.errors.length) {
    const details = document.errors.map((error) => error.message).join('; ');
    fail(`SKILL.md frontmatter YAML is invalid: ${details}`);
  }

  return document.toJSON() ?? {};
};

const validateFrontmatter = (frontmatter) => {
  if (frontmatter.name !== 'esl') fail('SKILL.md frontmatter must declare `name: esl`.');
  if (typeof frontmatter.description !== 'string' || !frontmatter.description.trim()) {
    fail('SKILL.md frontmatter must declare a non-empty `description`.');
  }
};

const validateContent = (content) => {
  for (const {token, message} of legacyArtifacts) {
    if (content.includes(token)) fail(message);
  }

  if (!content.includes('references/esl-core.md')) fail('SKILL.md must reference `references/esl-core.md`.');
  if (!content.includes('references/esl-review.md')) fail('SKILL.md must reference `references/esl-review.md`.');
  if (!/^# ESL Consumer Code$/m.test(content)) fail('SKILL.md must contain the main `# ESL Consumer Code` heading.');
};

ensureFileExists(skillFile);
referenceFiles.forEach(ensureFileExists);

const skillContent = readUtf8(skillFile);
const frontmatter = parseFrontmatter(skillContent);

validateFrontmatter(frontmatter);
validateContent(skillContent);

console.log('[esl:lint:skills] Skill bundle looks valid.');

