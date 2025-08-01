#!/usr/bin/env node
import color from 'kleur';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

/** ========================
 * It's too boring without any fun ;)
 * =========================*/

const MIN_WIDTH = 30;
const TEMPLATES = 'catlog.txt';

const PWD = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_PATH = path.resolve(PWD, TEMPLATES);

/**
 * Loads cat templates from simple text file
 * @returns {string[]} Array of cat ASCII art strings
 */
function loadCatTemplates() {
  try {
    const textContent = fs.readFileSync(TEMPLATES_PATH, 'utf8');
    // Split by double newlines and filter out empty entries
    return textContent.split(`${os.EOL}${os.EOL}${os.EOL}`)
      .filter(cat => cat.trim().length > 0);
  } catch (error) {
    console.error(color.red(`Error loading cat templates from ${TEMPLATES_PATH}:`), error.message);
    // Fallback to a simple cat if file loading fails
    return [`Cats are gone somewhere...${os.EOL}Please contact the maintainer!`];
  }
}

function centerText(text, width, textWidth = text.length) {
  const padding = Math.max(0, Math.floor((width - textWidth) / 2));
  const padString = ' '.repeat(padding);
  return padString + text + padString;
}

function normalizeCat(cat) {
  const width = Math.max(...cat.map(line => line.length));
  // Ensure each line is the same width by padding with spaces at the end
  return cat.map(line => line.padEnd(width, ' '));
}

function getRandomCat() {
  const catTemplates = loadCatTemplates();
  const randomIndex = Math.floor(Math.random() * catTemplates.length);
  return normalizeCat(catTemplates[randomIndex].split(os.EOL)); // Split into lines for display
}

function calculateDisplayWidth(message, catLines) {
  const catWidth = Math.max(...catLines.map(line => line.length));
  return Math.max(message.length, catWidth, MIN_WIDTH) + 4; // Extra padding
}

/**
 * Displays a cute cat with a message
 * @param {string} message - Message to display with the cat
 */
function catlog(message) {
  const catLines = getRandomCat();
  const displayWidth = calculateDisplayWidth(message, catLines);

  // Center each line of the cat
  const centeredCatLines = catLines.map(line =>
    centerText(line, displayWidth, line.length)
  );

  // Create the output
  const output = [
    ...centeredCatLines,
    '', // Empty line separator
    color.bgGreen().white(centerText(` ${message} `, displayWidth))
  ];

  console.log(output.join('\n'));
}

// Main execution
const [message] = process.argv.slice(2);
if (message) {
  catlog(message);
} else {
  catlog('Success! 🐱');
}
