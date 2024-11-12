function treePath(items) {
  const possibleTags = ['introduction', 'core', 'components', 'examples', 'blogs', 'draft'];
  const result = [];
  if (!Array.isArray(items)) return;
  items.forEach((item) => {
    const {tags} = item.data;
    if (!possibleTags.includes(tags[0])) return;
    const {title, parent} = item.data;
      const parents = [{'title': tags[0].replace(/\b\w/g, c => c.toUpperCase()), 'url': `/${tags[0]}/`}];
      if (parent) {
        const nextParent = items.find((itm) => itm.data.title === parent);
        parents.push({'title': parent, 'url': nextParent.data.page.url});
      }
      result.push({title, 'parents': parents});
 })
 return result;
}

module.exports = (config) => {
  config.addFilter('treepath', treePath);
};
