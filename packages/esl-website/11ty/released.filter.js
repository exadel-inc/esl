import {context} from './env.config.js';

const identical = (pages) => pages;
const draftsFilter = (pages) => {
  return (pages || []).filter((page) => {
    const tags = [].concat(page.data.tags);
    return !tags.includes('draft') && !tags.includes('dev');
  });
};
const draftsOrCurrentFilter = (pages, url) => {
  return (pages || []).filter((page) => {
    if (page.url === url) return true;
    const tags = [].concat(page.data.tags);
    return !tags.includes('draft') && !tags.includes('dev');
  });
};

export default (config) => {
  config.addFilter('released', context.isDev ? identical : draftsFilter);
  config.addFilter('releasedOrActive', context.isDev ? identical : draftsOrCurrentFilter);
  config.addFilter('releasedStrict', draftsFilter);
};
