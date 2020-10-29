module.exports.printBuildStart = function () {
  console.log('=== Running ESL Build ===');
};

module.exports.print = (...logArgs) => (cb) => {
  console.log(...logArgs);
  cb();
};
