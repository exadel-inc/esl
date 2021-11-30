module.exports =  {
  groupBy(data){
    const obj = {};
    data.children.forEach(item => {
      const {kindString} = item;
      if (!obj[kindString]) {
          obj[kindString] = [];
      }
      obj[kindString].push(item);
    })
    return obj;
  }
}
