const gulp = require('gulp');

// STYLES
const less = require('gulp-less');
const postcss = require('gulp-postcss');

// UTILS
const sourcemaps = require('gulp-sourcemaps');

// POSTCSS PLUGINS
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');


module.exports = function buildLessStream(paths, sourceMaps = true) {
	let files = gulp.src(paths);
	files = sourceMaps ? files.pipe(sourcemaps.init()) : files;
	files = files.pipe(less());
	files = files.pipe(postcss([
		autoprefixer(),
		cssnano()
	]));
	files = sourceMaps ? files.pipe(sourcemaps.write('/')) : files;
	return files;
};
