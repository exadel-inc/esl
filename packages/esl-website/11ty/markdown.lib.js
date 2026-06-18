import MarkdownIt from 'markdown-it';
import imgPlugin from './markdown.img.lib.js';
import tablePlugin from './markdown.table.lib.js';
import frontMaterPlugin from './markdown.frontmater.lib.js';

import {highlight} from './prismjs.lib.js';

export const markdown = MarkdownIt({html: true, highlight});

markdown.use(imgPlugin.plugin);
markdown.use(tablePlugin.plugin);
markdown.use(frontMaterPlugin.plugin);

export default (config) => {
  config.setLibrary('md', markdown);
  config.addPairedShortcode('markdown', (content) => markdown.render(content));
};
