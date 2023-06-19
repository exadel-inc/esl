module.exports = (config) => {
  config.addCollection('news', (collection) => {
    const collections = collection.getAll()[0].data.collections;
    return collections.blogs.concat(collections.articles).sort((a, b) => a.date - b.date);
  });
};  
