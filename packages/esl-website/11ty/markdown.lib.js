import MarkdownIt from 'markdown-it';
import imglib from './markdown.img.lib.js';
import tablePlugin from './markdown.table.lib.js';

import {highlight} from './prismjs.lib.js';

export const markdown = MarkdownIt({html: true, highlight});

markdown.use(imglib.plugin);
markdown.use(tablePlugin.plugin);

export default (config) => {
  config.setLibrary('md', markdown);
  config.addPairedShortcode('markdown', (content) => markdown.render(content));
};
