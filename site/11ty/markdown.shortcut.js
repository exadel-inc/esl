const path = require('path');
const fsAsync = require('fs').promises;

const color = require('kleur');
const {JSDOM} = require('jsdom');
const {markdown} = require('./markdown.lib');

const {github, rewriteRules} = require('./site.config');

class MDRenderer {
  static async render(filePath, startAnchor, endAnchor) {
    try {
      const content = await MDRenderer.parseFile(filePath);
      const {window} = new JSDOM(content);

      // Exclude part before start anchor
      if (startAnchor) {
        const startAnchorElement = MDRenderer.findAnchor(window.document, startAnchor);
        if (startAnchorElement) {
          while (startAnchorElement.previousSibling) startAnchorElement.previousSibling.remove();
          startAnchorElement.remove();
        } else {
          console.error('MDRenderer.render: start anchor "%s" not found for %s', startAnchor, filePath);
        }
      }

      // Exclude part after end anchor
      if (endAnchor) {
        const endAnchorElement = MDRenderer.findAnchor(window.document, endAnchor);
        if (endAnchorElement) {
          while (endAnchorElement.nextSibling) endAnchorElement.nextSibling.remove();
          endAnchorElement.remove();
        } else {
          console.error('MDRenderer.render: end anchor "%s" not found for %s', endAnchor, filePath);
        }
      }

      // Resolve content links
      MDRenderer.resolveLinks(window.document.body, filePath);

      // Render result content
      return MDRenderer.renderContent(window.document.body);
    } catch (e) {
      console.error('MDRenderer.render: error during rendering...\n%s', e);
      return `Critical rendering error: ${e}`;
    }
  }

  /** Read file and render markdown */
  static async parseFile(filePath) {
    const absolutePath = path.resolve(__dirname, '../../', filePath);
    const data = await fsAsync.readFile(absolutePath);
    const content = data.toString();
    return markdown.render(content);
  }

  static findAnchor(dom, name) {
    const anchor = dom.querySelector(`a[name='${name}']`);
    // <p><a name></a></p>
    return anchor && anchor.matches(':only-child') ? anchor.parentElement : anchor;
  }

  static renderContent(content) {
    return `<div class="markdown-container">${content.innerHTML}</div>`;
  }

  static resolveLinks(dom, basePath) {
    dom.querySelectorAll('a[href]').forEach((link) => {
      if (link.href.startsWith('.')) {
        const absolutePath = path.join(path.dirname(basePath), link.href).replace(/\\/g, '/');
        const resultPath = MDRenderer.processRewriteRules(absolutePath);
        console.log(color.yellow(`Rewrite link "${link.href}" to "${resultPath}"`));
        link.href = resultPath;
      }
      if (['https:', 'http:'].includes(link.protocol)) {
        link.target = '_blank';
        link.rel = 'noopener';
      }
    });
  }
  static processRewriteRules(linkPath) {
    for (const [key, value] of Object.entries(rewriteRules)) {
      if (!linkPath.endsWith(key)) continue;
      if (value.startsWith('/')) return value;
      return value;
    }
    return github.srcUrl + linkPath;
  }
}

module.exports = (config) => {
  config.addNunjucksAsyncShortcode('mdRender', MDRenderer.render);
};
module.exports.MDRenderer = MDRenderer;
