const {github} = require('./site.config');

const ghurl = (url) => github.srcUrl + url;

module.exports = (config) => {
  config.addFilter('ghurl', ghurl);
};
