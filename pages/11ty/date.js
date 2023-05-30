module.exports = (config) => {
  /** Filter items by hidden marker */
  const notHiddenFilter = (date2) => {
    let date = new Date(date2);
    let year = date.getFullYear();
    let month = date.getMonth() +1
    let day = date.getDate();
    let finaldate = `${month}-${day}-${year}`

    return finaldate
  };

  config.addFilter('date', notHiddenFilter);
};
