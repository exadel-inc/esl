const path = require('path');
const fsAsync = require('fs').promises;

const {markdown} = require('./markdown.lib');

class MDRenderer {

  /** Read file and render markdown */
  static async renderFromFile(filePath) {
    const absolutePath = path.resolve(__dirname, '../../', filePath);
    const data = await fsAsync.readFile(absolutePath);
    const content = data.toString();
    return markdown.render(content);
  }
}

module.exports = (config) => {
  config.addNunjucksAsyncShortcode('markdown', MDRenderer.renderFromFile);
};
module.exports.MDRenderer = MDRenderer;
