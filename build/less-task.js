const gulp = require('gulp');

// STYLES
const less = require('gulp-less');
const postcss = require('gulp-postcss');

// UTILS
const sourcemaps = require('gulp-sourcemaps');

// POSTCSS PLUGINS
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');


module.exports = function buildLessStream(paths) {
	return gulp.src(paths)
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(postcss([
			autoprefixer({
				browsers: [
					'last 3 version'
				]
			}),
			cssnano()
		]))
		.pipe(sourcemaps.write('/'));
};
