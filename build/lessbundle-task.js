const path = require('path');
const gulp = require('gulp');
const gulpEach = require('gulp-each');
const lessBundle = require('less-bundle');

module.exports = function buildLessBundleStream(src, outDir) {
    return gulp.src(src).pipe(gulpEach((content, file, cb) => {
        lessBundle({
            src: file.path,
            dest: path.join(outDir, '/', file.basename)
        }, cb);
    }));
};
