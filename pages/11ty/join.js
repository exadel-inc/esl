module.exports = function (config) {
  config.addCollection('news', function(collection) {
    const collections = collection.getAll()[0].data.collections;
    const news = collections.blogs.concat(collections.articles).sort((a, b) => a.date - b.date)
    news.title = 'Articles & News'
    return news;
    /* collection.getAll().filter((item) => {
      console.log(item.data.tags)
      return item.data?.tags?.includes('articles')})*/
  });
};  
