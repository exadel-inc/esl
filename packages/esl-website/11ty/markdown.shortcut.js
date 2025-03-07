import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import {readFile} from 'fs/promises';

import color from 'kleur';
import {JSDOM} from 'jsdom';
import {markdown} from './markdown.lib.js';
import {siteConfig} from './site.config.js';

const FILE_ROOT = dirname(fileURLToPath(import.meta.url));

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
    const absolutePath = path.resolve(FILE_ROOT, '../../../', filePath);
    const data = await readFile(absolutePath);
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
    for (const [key, value] of Object.entries(siteConfig.rewriteRules)) {
      if (!linkPath.endsWith(key)) continue;
      if (value.startsWith('/')) return value;
      return value;
    }
    return siteConfig.github.srcUrl + linkPath;
  }
}

export default (config) => {
  config.addNunjucksAsyncShortcode('mdRender', MDRenderer.render);
};
