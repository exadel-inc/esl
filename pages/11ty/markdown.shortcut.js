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

      //Add headers ids
      MDRenderer.generateHeadersIds(window.document.body);

      // Add globally defined terms links
      MDRenderer.generateGloballyDefinedTermsLinks(window.document.body);

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
    const headerTags = ['h1', 'h2', 'h3', 'h4'];
    const idLengthLimit = 20;

    headerTags.forEach(tag => {
      const headers = content.getElementsByTagName(tag);

      for (let header of headers) {
        const text = header.textContent;
        const id = text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
          .replace(/[^\w\s]|_/g, "").replace(/\s+/g, "")
          .substring(0, idLengthLimit);

        header.setAttribute('id', id);

        this.generateAnchors(content, text, `#${id}`)
      }
    });
    return content;
  }

  static generateGloballyDefinedTermsLinks (content) {
    const globallyDefinedTerms = {
      ESL_Base_Element: 'https://esl-ui.com/core/esl-base-element/',
      ESL_Mixin_Element: 'https://esl-ui.com/core/esl-mixin-element/'
      // Add other globally defined terms as needed
    };

    Object.keys(globallyDefinedTerms).forEach(term => {
      this.generateAnchors(content, term.replace(/_/g, " "), globallyDefinedTerms[term]);
    });
  }

  static generateAnchors(content, text, link) {
    const matches = Array.from(content.querySelectorAll('*'))
      .filter(element => element.textContent.includes(text) || element.textContent.includes(text.replace(/_/g, " ")));
    const regex = new RegExp(`(^|\\s)${text}(\\s|[,\\.])`, 'g');

    matches.forEach(match => {
      if (!['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(match.tagName)) {
        match.innerHTML = match.innerHTML.replace(regex, `$1<a href="${link}">${text}</a>$2`);
      }
    });
  }

}

module.exports = (config) => {
  config.addNunjucksAsyncShortcode('mdRender', MDRenderer.render);
};
module.exports.MDRenderer = MDRenderer;
