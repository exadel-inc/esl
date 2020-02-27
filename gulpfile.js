const gulp = require('gulp');
const task = {
    bundle: require('./build/webpack-task').buildAll,
    es6: require('./build/es6-task').buildES6,
    less: require('./build/less-task'),
    clean: require('./build/clean-task')
};
const paths = require('./paths');

// === LESS ===
// all components
gulp.task('less-lib', function () {
    return task.less(paths.bundle.less).pipe(gulp.dest(paths.bundle.target));
});
gulp.task('less-lib-es6', function () {
    return gulp.src(paths.es6.less).pipe(gulp.dest(paths.es6.target));
});
// local dev assets
gulp.task('less-local', function () {
    return task.less(paths.test.less).pipe(gulp.dest(paths.test.target));
});

// === TS ===
// all components
gulp.task('ts-lib', function () {
    return task.bundle({
        src: paths.bundle.ts,
        context: paths.bundle.context,
        output: {
            library: 'SmartLibrary',
            libraryTarget: 'umd',
            umdNamedDefine: true
        }
    }).pipe(gulp.dest(paths.bundle.target));
});
gulp.task('ts-lib-es6', function () {
    return task.es6({
        src: paths.es6.ts,
        context: paths.es6.context
    }).pipe(gulp.dest(paths.es6.target));
});
gulp.task('ts-lib-polyfills', function () {
    return task.bundle({
        src: paths.polyfills.ts,
        context: paths.polyfills.context
    }).pipe(gulp.dest(paths.polyfills.target));
});
// gulp.task('ts-lib-granular', function () {
//     return task.bundle({
//         src: 'src/components/*/*.ts',
//         context: paths.polyfills.context
//     }).pipe(gulp.dest(paths.bundle.target));
// });
// local dev assets
gulp.task('ts-local', function () {
	return task.bundle({
		src: paths.test.ts,
        context: paths.bundle.context
	}).pipe(gulp.dest(paths.test.target));
});

// === CLEAN TASK ===
gulp.task('clean', function () {
    return task.clean({
        src: [paths.bundle.target, paths.es6.target].map((path) => `${path}/`)
    });
});
gulp.task('clean-local', function () {
    return task.clean({
        src: `${paths.test.target}/`
    });
});

// === WATCH TASKS ===
gulp.task('watch', function () {
    gulp.watch(paths.watch.ts, {}, gulp.series((cb) => {
        console.log('TS Changed ...');
        cb();
    }, 'ts-lib'));
    gulp.watch(paths.watch.less, {}, gulp.series((cb) => {
        console.log('LESS Changed ...');
        cb();
    }, 'less-lib'));
    if (paths.watch.local) {
        gulp.watch(paths.watch.local.ts, {}, gulp.series((cb) => {
            console.log('Local TS Changed ...');
            cb();
        }, 'ts-local'));
        gulp.watch(paths.watch.local.less, {}, gulp.series((cb) => {
            console.log('Local LESS Changed ...');
            cb();
        }, 'less-local'));
    }
});

// === BUILD TASKS ===
gulp.task('build', gulp.series('clean', gulp.parallel('less-lib', gulp.series('ts-lib', 'ts-lib-polyfills'))));
gulp.task('build-es6', gulp.parallel('less-lib-es6', 'ts-lib-es6'));

// Local assets
gulp.task('build-local', gulp.series('clean-local', gulp.parallel('less-local', 'ts-local')));

// default -> build
gulp.task('default', gulp.parallel('build', 'build-local'));