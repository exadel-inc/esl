import MarkdownIt from 'markdown-it';
import imglib from './markdown.img.lib.js';

import {highlight} from './prismjs.lib.js';

export const markdown = MarkdownIt({html: true, highlight});
markdown.use(imglib.plugin);

export default (config) => {
  config.setLibrary('md', markdown);
  config.addPairedShortcode('markdown', (content) => markdown.render(content));
};
