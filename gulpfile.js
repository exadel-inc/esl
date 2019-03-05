const gulp = require('gulp');
const task = {
    ts: require('./build/webpack-task'),
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
        'test-pages/assets/*.less'
    ]).pipe(gulp.dest(
        'test-pages/static'
    ));
});

// === TS ===
// all components
gulp.task('ts-lib', function () {
    return task.ts({
        src: ['src/bundles/all.ts'],
        context: 'src/components'
    }).pipe(gulp.dest(
        'lib'
    ));
});


// === BUILD TASKS ===

gulp.task('build', gulp.parallel('less-lib', 'ts-lib'));
gulp.task('build-local', gulp.parallel('build', 'less-local'));

// default -> build
gulp.task('default', gulp.series('build'));