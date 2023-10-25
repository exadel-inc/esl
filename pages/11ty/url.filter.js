const ghurl = (url) => 'https://github.com/exadel-inc/esl/' + url;

module.exports = (config) => {
  config.addFilter('ghurl', ghurl);
};
