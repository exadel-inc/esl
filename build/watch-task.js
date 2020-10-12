const gulp = require('gulp');
const paths = require('../paths');

const {buildTsLib, buildTsLocal} = require('./webpack-task');
const {buildLessLib, buildLessLocal} = require('./less-task');

const print = (...logArgs) => (cb) => {
  console.log(...logArgs);
  cb();
};

function watchTask() {
  gulp.watch(paths.watch.ts, {},
    gulp.series(print('TS Changed ...'), buildTsLib)
  );
  gulp.watch(paths.watch.less, {},
    gulp.series(print('LESS Changed ...'), buildLessLib)
  );

  if (paths.watch.local) {
    gulp.watch(paths.watch.local.ts, {},
      gulp.series(print('Local TS Changed ...'), buildTsLocal)
    );
    gulp.watch(paths.watch.local.less, {},
      gulp.series(print('Local LESS Changed ...'), buildLessLocal)
    );
  }
}

module.exports.watch = watchTask;
