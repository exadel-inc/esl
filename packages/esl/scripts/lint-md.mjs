import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

import MarkdownIt from 'markdown-it';
import {load as loadYaml, FAILSAFE_SCHEMA} from 'js-yaml';

const currentDir = fileURLToPath(new URL('.', import.meta.url));
const projectRoot = path.resolve(currentDir, '..');
const markdown = new MarkdownIt();
const markdownExtensions = new Set(['.md']);
const ignoredDirectories = new Set(['node_modules']);

const fail = (message) => {
  throw new Error(`[esl:lint:md] ${message}`);
};

const relativeToProject = (filePath) => path.relative(projectRoot, filePath).replace(/\\/g, '/');

const stripBom = (content) => (content.charCodeAt(0) === 0xFEFF ? content.slice(1) : content);

const listMarkdownFiles = (directory) => {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return ignoredDirectories.has(entry.name) ? [] : listMarkdownFiles(filePath);
    return markdownExtensions.has(path.extname(entry.name).toLowerCase()) ? [filePath] : [];
  });
};

const parseFrontmatter = (content, filePath) => {
  // Detect an escaped frontmatter marker (literal "\\---") at the very start
  if (/^\\---(?:\r?\n|$)/.test(content)) {
    fail(`${relativeToProject(filePath)} starts with an escaped frontmatter marker \\---.`);
  }

  if (!content.startsWith('---\n') && !content.startsWith('---\r\n')) return {body: content, hasFrontmatter: false};

  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) fail(`${relativeToProject(filePath)} starts with frontmatter but does not contain a closing --- line.`);

  const [block, source] = match;
  try {
    loadYaml(source, {
      schema: FAILSAFE_SCHEMA,
      filename: relativeToProject(filePath)
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    fail(`${relativeToProject(filePath)} has invalid YAML frontmatter: ${message}`);
  }

  return {body: content.slice(block.length), hasFrontmatter: true};
};

const validateCodeFences = (content, filePath) => {
  const lines = content.split(/\r?\n/);
  let opened = null;

  for (const [i, line] of lines.entries()) {
    const m = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (!m) continue;

    const marker = m[1][0];
    const size = m[1].length;
    if (!opened) {
      opened = {marker, size, line: i + 1};
      continue;
    }
    if (opened.marker === marker && size >= opened.size) opened = null;
  }

  if (opened) fail(`${relativeToProject(filePath)} has an unclosed code fence opened on line ${opened.line}.`);
};

const validateMarkdown = (content, filePath) => {
  validateCodeFences(content, filePath);
  try {
    markdown.parse(content, {});
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    fail(`${relativeToProject(filePath)} has invalid markdown syntax: ${message}`);
  }
};

// Allow optional CLI argument: node lint-md.mjs <dir>
const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : projectRoot;

try {
  const markdownFiles = listMarkdownFiles(targetDir);
  if (!markdownFiles.length) fail('No markdown files were found.');

  for (const filePath of markdownFiles) {
    const source = stripBom(fs.readFileSync(filePath, 'utf8'));
    const {body} = parseFrontmatter(source, filePath);
    validateMarkdown(body, filePath);
  }

  console.log(`[esl:lint:md] Checked ${markdownFiles.length} markdown files.`);
} catch (err) {
  // Ensure a clear error message and non-zero exit code
  const message = err instanceof Error ? err.message : String(err);
  // Print to stderr and exit with failure
  console.error(message);
  // Use process.exitCode instead of process.exit to allow cleanup/higher-level handling
  process.exitCode = 1;
}
