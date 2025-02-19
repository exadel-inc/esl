import {siteConfig} from './site.config.js';

export default (config) => {
  config.addFilter('canonical', (path) => {
    if (/^https?:\/\//.test(path)) return path;
    return (siteConfig.url + path).replace(/\/$/, '');
  });
};
