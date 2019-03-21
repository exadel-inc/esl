const gulp = require('gulp');
const task = {
    ts: require('./build/webpack-task').buildAll,
    less: require('./build/less-task'),
};

// === LESS ===
// all components
gulp.task('less-lib', function () {
    return task.less([
        // TODO: possibly rename in the result folder
        'src/bundles/all.less'
    ]).pipe(gulp.dest(
        'lib'
    ));
});
// local dev assets
gulp.task('less-local', function () {
    return task.less([
        'test-server/assets/*.less',
    ]).pipe(gulp.dest(
        'test-server/static'
    ));
});

// === TS ===
// all components
gulp.task('ts-lib', function () {
    return task.ts({
        src: [
            'src/bundles/all.ts',
            'src/bundles/polyfill-prebuild.ts'
        ],
        context: 'src/components'
    }).pipe(gulp.dest(
        'lib'
    ));
});
// local dev assets
gulp.task('ts-local', function () {
	return task.ts({
		src: ['test-server/assets/*.ts'],
		context: 'src/components'
	}).pipe(gulp.dest(
		'test-server/static'
	));
});


// === BUILD TASKS ===
gulp.task('build', gulp.parallel('less-lib', 'ts-lib'));
// Main assets + local assets
gulp.task('build-local', gulp.series('build', gulp.parallel('less-local', 'ts-local')));

// default -> build
gulp.task('default', gulp.series('build'));