const path = require('path');
const fsAsync = require('fs').promises;

const color = require('kleur');
const {JSDOM} = require('jsdom');
const {markdown} = require('./markdown.lib');

const {github, rewriteRules, urlPrefix, globalTerms} = require('./site.config');

class MDRenderer {
  static async render(filePath, startAnchor, endAnchor) {
    try {
      const content = await MDRenderer.parseFile(filePath);
      const {window} = new JSDOM(content);
      const localTerms = MDRenderer.generateHeadersIds(window.document.body);
      const terms = Object.assign({}, globalTerms, localTerms);

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

      // Add anchors and globally defined terms links
      MDRenderer.fillReferenceLinks(window.document, window.document.body, terms);

      // Resolve content links
      MDRenderer.resolveLinks(window.document.body, filePath);

      // Render result content
      return MDRenderer.renderContent(window.document.body);
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

  static generateHeadersIds(content) {
    const headers = [...content.querySelectorAll('h1, h2, h3, h4')];
    const localTerms = {};
    for (const header of headers) {
      const text = header.textContent;
      const id = MDRenderer.createIDFromText(text)
      header.setAttribute('id', id);
      const anchor = `#${id}`
      localTerms[text] = anchor;
    }
    return localTerms
  }
  static createIDFromText(text, idLengthLimit = 20) {
    return text
      .replace(/[^a-zA-Z0-9]+/g, ' ')
      .toLowerCase()
      .replace(/(?:^|\s)\w/g, (symbol, index) => (index === 0 ? symbol : symbol.toUpperCase()))
      .replace(/\s/g, '')
      .substring(0, idLengthLimit);
  }

  static findTextNodes(root) {
    const all = [];
    for (let node = root.firstChild; node; node = node.nextSibling) {
      if (node.nodeType === 3) all.push(node);
      else all.push(...MDRenderer.findTextNodes(node));
    }
    return all
  }

  static fillReferenceLinks(document, content, terms) {
    const nodes = MDRenderer.findTextNodes(content)
      .filter((node) => !node.parentElement.closest('h1, h2, h3, h4, h5, h6'))

    for (const [text, link] of Object.entries(terms)) {

      for (const node of nodes) {
        if (node.textContent.includes(text)) {
          MDRenderer.wrapTextNode(document, node, text, link)
        }
      }
    }
  }

  static wrapTextNode(document, node, text, link) {
    const wrapper = document.createElement('span');
    wrapper.innerHTML = node.textContent.replace(text, `<a href="${link}">${text}</a>`);
    node.replaceWith(...wrapper.childNodes);
  }
}

module.exports = (config) => {
  config.addNunjucksAsyncShortcode('mdRender', MDRenderer.render);
};
module.exports.MDRenderer = MDRenderer;
