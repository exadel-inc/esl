const {ESLDoc} = require('./eslDoc/render');
const nunjucks = require('nunjucks');
const path = require('path');

const generateDoc = (entryPoint) => {
  const syntaxTree = ESLDoc.render(entryPoint);
  return nunjucks.render(path.resolve(__dirname, '../views/_includes/eslDoc/render.njk'), {declarations: syntaxTree});
}

module.exports = (config) => {
  config.addNunjucksShortcode('eslDoc', generateDoc);
};
