import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import {readFile} from 'fs/promises';

import color from 'kleur';
import {JSDOM} from 'jsdom';
import {markdown} from './markdown.lib.js';
import {siteConfig} from './site.config.js';

const PWD = dirname(fileURLToPath(import.meta.url));

class MDRenderer {
  static FIRST_HEADER = 'body>:is(h1,h2,h3,h4)';

  static async render(filePath, startAnchor, endAnchor) {
    try {
      const content = await MDRenderer.parseFile(filePath);
      const {window} = new JSDOM(content);

      if (startAnchor) MDRenderer.dropContentBefore(window, startAnchor, filePath);
      if (endAnchor) MDRenderer.dropContentAfter(window, endAnchor, filePath);

      // Resolve content links
      MDRenderer.resolveLinks(window.document.body, filePath);

      // Render result content
      return MDRenderer.renderContent(window.document.body);
    } catch (e) {
      console.error('MDRenderer.render: error during rendering...\n%s', e);
      return `Critical rendering error: ${e}`;
    }
  }

  static dropHeader(context) {
    const firstHeader = context.document.querySelector(MDRenderer.FIRST_HEADER);
    if (firstHeader) firstHeader.remove();
  }
  static dropCopyright(context) {
    // Get last 3 elements of the body
    const [hr, text, logo] = [...context.document.body.children].slice(-3);
    if (!logo || !text || !hr) return;
    if (!hr.matches('hr')) return; // Starts with ruler
    if (!text.textContent.includes(siteConfig.copyright)) return; // Contains copyright text
    [hr, text, logo].forEach((el) => el.remove());
  }

  static dropContentBefore(context, marker, src) {
    if (marker === '$content') return MDRenderer.dropHeader(context);
    // Exclude part before start anchor (legacy behavior)
    const startElement = MDRenderer.findAnchor(context.document, marker);
    if (startElement) {
      while (startElement.previousSibling) startElement.previousSibling.remove();
      startElement.remove();
    } else {
      console.error('MDRenderer.render: start anchor "%s" not found for %s', marker, src);
    }
  }
  static dropContentAfter(context, marker, src) {
    if (marker === '$content') return MDRenderer.dropCopyright(context);
    const startElement = MDRenderer.findAnchor(context.document, marker);
    if (startElement) {
      while (startElement.nextSibling) startElement.nextSibling.remove();
      startElement.remove();
    } else {
      console.error('MDRenderer.render: end anchor "%s" not found for %s', marker, src);
    }
  }

  /** Read file and render markdown */
  static async parseFile(filePath) {
    const routedPath = filePath.replace(/^@/, 'node_modules/@');
    const absolutePath = path.resolve(PWD, '../../../', routedPath);
    const data = await readFile(absolutePath);
    const content = data.toString();
    return markdown.render(content, {
      basePath: absolutePath
    });
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
    // Processing base path rewrite (e.g. node_modules resolve)
    for (const [key, value] of Object.entries(siteConfig.rewriteBasePaths)) {
      if (linkPath.startsWith(key)) {
        linkPath = linkPath.replace(key, value);
      }
    }
    // Processing full link rewrite
    const [link, anchor] = linkPath.split('#');
    for (const [key, value] of Object.entries(siteConfig.rewriteRules)) {
      if (!link.endsWith(key)) continue;
      return value + (anchor ? `#${anchor}` : '');
    }
    return siteConfig.github.srcUrl + linkPath;
  }
}

export default (config) => {
  config.addNunjucksAsyncShortcode('mdRender', MDRenderer.render);
};
