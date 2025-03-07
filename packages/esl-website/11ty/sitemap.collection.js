import {siteConfig} from './site.config.js';

export default (config) => {
  config.addCollection('sitemap', (collectionApi) => {
    return collectionApi.getAll().filter((item) => {
      const tags = [].concat(item.data.tags);
      // Exclude drafts
      if (tags.includes('draft') || tags.includes('noindex')) return false;
      // include only items that are in sitemapCollections
      return siteConfig.sitemapCollections.some((name) => tags.includes(name));
    }).toReversed();
  });
};
