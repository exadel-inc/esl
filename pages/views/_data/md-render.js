const path = require('path');
const fsAsync = require('fs').promises;
const { JSDOM } = require('jsdom');

const { markdown } = require('./markdown');

const fileCache = new Map();

const parseFile = async (filePath) => {
  const absolutePath = path.resolve(__dirname, '../../../', filePath);

  if (fileCache.has(absolutePath)) return fileCache.get(absolutePath);

  const data = await fsAsync.readFile(absolutePath);
  const content = data.toString();
  const renderedContent = markdown.render(content);

  fileCache.set(absolutePath, renderedContent);
  return renderedContent;
};

// <p><a name></a></p>
const unwrapAnchor = (anchor) => anchor && anchor.matches(':only-child') ? anchor.parentElement : anchor;

class MDRenderer {
  static wrapContent(content) {
    return `<div class="markdown-container">${content}</div>`;
  }

  static async render(filePath, startSel, endSel) {
    try {
      const content = await parseFile(filePath);

      if (!startSel) return MDRenderer.wrapContent(content);

      const { window } = new JSDOM(content);
      const startAnchor = window.document.querySelector(`a[name='${startSel}']`);
      const endAnchor = window.document.querySelector(`a[name='${endSel}']`);

      let node = unwrapAnchor(startAnchor);
      console.log(node, '')
      let endNode = unwrapAnchor(endAnchor);
      let partContent = '';

      for (node = node.nextSibling; !!node && node !== endNode; node = node.nextSibling) {
        partContent += node.outerHTML || node.textContent;
      }

      return MDRenderer.wrapContent(partContent);
    } catch (e) {
      return `Rendering error: ${e}`;
    }
  }
}

module.exports = { MDRenderer };
