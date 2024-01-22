const {sitemapCollections} = require('./site.config');

module.exports = (config) => {
  config.addCollection('sitemap', (collectionApi) => {
    return collectionApi.getAll().filter((item) => {
      const tags = [].concat(item.data.tags);
      // Exclude drafts
      if (tags.includes('draft') || tags.includes('noindex')) return false;
      // include only items that are in sitemapCollections
      return sitemapCollections.some((name) => tags.includes(name));
    }).toReversed();
  });
};
