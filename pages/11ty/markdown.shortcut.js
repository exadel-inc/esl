const path = require('path');
const fsAsync = require('fs').promises;

const {JSDOM} = require('jsdom');
const {isDev} = require('./env.config');
const {markdown} = require('./markdown.lib');

const {github} = require('../views/_data/site.json');

const fileCache = new Map();

const parseFile = async (filePath) => {
  const absolutePath = path.resolve(__dirname, '../../', filePath);

  if (!isDev && fileCache.has(absolutePath)) return fileCache.get(absolutePath);

  const data = await fsAsync.readFile(absolutePath);
  const content = data.toString();
  const renderedContent = markdown.render(content);

  fileCache.set(absolutePath, renderedContent);
  return renderedContent;
};

class MDRenderer {
  static wrapContent(content) {
    return `<div class="markdown-container">${content}</div>`;
  }

  static resolveLinks(dom, fileBase) {
    dom.querySelectorAll('a[href^="."]').forEach((node) => {
      node.href = github.srcUrl + path.join(path.dirname(fileBase), node.href);
    });
  }

  static findAnchor(dom, name) {
    const anchor = dom.querySelector(`a[name='${name}']`);
    // <p><a name></a></p>
    return anchor && anchor.matches(':only-child') ? anchor.parentElement : anchor;
  }

  static async render(filePath, startAnchor, endAnchor) {
    try {
      const content = await parseFile(filePath);

      if (!startAnchor) return MDRenderer.wrapContent(content);

      const { window } = new JSDOM(content);

      MDRenderer.resolveLinks(window.document, filePath);

      let node = MDRenderer.findAnchor(window.document, startAnchor);
      let endNode = MDRenderer.findAnchor(window.document, endAnchor);
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

module.exports = (config) => {
  config.addNunjucksAsyncShortcode('mdRender', MDRenderer.render);
};
module.exports.MDRenderer = MDRenderer;
