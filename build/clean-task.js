const gulp = require('gulp');
const clean = require('gulp-clean');

module.exports = function cleanPath(config) {
	return gulp.src(config.src, {read: false, allowEmpty: true})
		.pipe(clean({force: true}));
};