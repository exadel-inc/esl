module.exports.printBuildStart = function () {
  console.log('=== Running Exadel Smart Library Build ===');
};

module.exports.print = (...logArgs) => (cb) => {
  console.log(...logArgs);
  cb();
};
