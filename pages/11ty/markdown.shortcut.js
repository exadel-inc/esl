const path = require('path');
const fsAsync = require('fs').promises;

const color = require('kleur');
const {JSDOM} = require('jsdom');
const {markdown} = require('./markdown.lib');

const {github, rewriteRules, urlPrefix} = require('./site.config');

class MDRenderer {
  static async render(filePath, startAnchor, endAnchor) {
    try {
      const content = await MDRenderer.parseFile(filePath);
      const {window} = new JSDOM(content);

      // Exclude part before start anchor
      if (startAnchor) {
        const startAnchorElement = MDRenderer.findAnchor(window.document, startAnchor);
        while (startAnchorElement.previousSibling) startAnchorElement.previousSibling.remove();
        startAnchorElement.remove();
      }

      // Exclude part after end anchor
      if (endAnchor) {
        const endAnchorElement = MDRenderer.findAnchor(window.document, endAnchor);
        while (endAnchorElement.nextSibling) endAnchorElement.nextSibling.remove();
        endAnchorElement.remove();
      }

      // Resolve content links
      MDRenderer.resolveLinks(window.document.body, filePath);

      // Render result content
      return MDRenderer.renderContent(window.document.body);
    } catch (e) {
      return `Rendering error: ${e}`;
    }
  }

  static async renderTruncate(content, maxLength = 250) {
    try {
      const {body} = new JSDOM(content).window.document;

      let limitReached = false;
      let index = 0;
    
      const nodeHandler = (node) => {
        if (limitReached) {
          node.remove();
          return;
        }
    
        const childNodes = Array.from(node.childNodes);
        if (childNodes.length) {
          childNodes.forEach((childNode) => nodeHandler(childNode));
        } else {
          index += node.textContent.length;
          if (index < maxLength) return;
          limitReached = true;
          node.textContent += `${node.textContent.slice(0, -(index - maxLength))}... `;
          node.parentNode.insertAdjacentHTML('beforeend', `<p class="news-content-cta">Read more</p>`);
        }
      };
    
      nodeHandler(body);
      return MDRenderer.renderContent(body);
    } catch (e) {
      return `Rendering error: ${e}`;
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
    dom.querySelectorAll('a[href^="."]').forEach((link) => {
      const absolutePath = path.join(path.dirname(basePath), link.href).replace(/\\/g, '/');
      const resultPath = MDRenderer.processRewriteRules(absolutePath);
      console.log(color.yellow(`Rewrite link "${link.href}" to "${resultPath}"`));
      link.href = resultPath;
    });
  }
  static processRewriteRules(linkPath) {
    for (const [key, value] of Object.entries(rewriteRules)) {
      if (!linkPath.endsWith(key)) continue;
      if (value.startsWith('/')) return urlPrefix + value;
      return value;
    }
    return github.srcUrl + linkPath;
  }
}

module.exports = (config) => {
  config.addNunjucksAsyncShortcode('mdRender', MDRenderer.render);
  config.addNunjucksAsyncShortcode('mdRenderTruncate', MDRenderer.renderTruncate);
};
module.exports.MDRenderer = MDRenderer;
