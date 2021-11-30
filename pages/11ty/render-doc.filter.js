const {groupBy} = require('./_typeDoc/groupBy-docs');
const typeDoc = require('./_typeDoc/typeDoc');
const {parseJSON} = require('./_typeDoc/parser/typeDoc-json-parse');

module.exports = (config) => {
  const generateDoc = async(entryPoint, output, callback) => {
    await typeDoc(entryPoint, output);
    const json = require('../' + output);
    const data = groupBy(json);
    callback(null, parseJSON(data));
  }

  config.addNunjucksAsyncFilter('generateDoc', generateDoc);
}
