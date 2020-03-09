const gulp = require('gulp');
const rename = require('gulp-rename');
const task = {
    bundle: require('./build/webpack-task').buildAll,
   // es6: require('./build/es6-task').buildES6,
    less: require('./build/less-task'),
    lessBundle: require('./build/lessbundle-task'),
    clean: require('./build/clean-task')
};

const paths = require('./paths');

// === LESS ===
// all components
gulp.task('less-lib', function () {
    return task.less(paths.bundle.less)
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest(paths.bundle.target));
});
gulp.task('less-lib-bundles', function () {
    return task.lessBundle(paths.bundle.lessComponents, paths.bundle.target);
});
gulp.task('less-lib-bundles-defaults', function () {
    return task.less(paths.bundle.lessComponentsDefaults, false)
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest(paths.bundle.target));
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
gulp.task('ts-lib-bundles', function () {
    return task.bundle({
        src: paths.bundle.tsComponents,
        context: paths.bundle.context,
        commonChunk: 'smart-core'
    }).pipe(gulp.dest(paths.bundle.target))
});
gulp.task('ts-lib-polyfills', function () {
    return task.bundle({
        src: paths.polyfills.ts,
        context: paths.polyfills.context
    }).pipe(gulp.dest(paths.polyfills.target));
});
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
        src: [paths.bundle.target].map((path) => `${path}/`)
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
gulp.task('build-main', gulp.parallel('less-lib', gulp.series('ts-lib', 'ts-lib-polyfills')));
gulp.task('build-granular', gulp.parallel('less-lib-bundles', 'less-lib-bundles-defaults', 'ts-lib-bundles'));
gulp.task('build', gulp.series('clean', 'build-main'));

// Local assets
gulp.task('build-local', gulp.series('clean-local', gulp.parallel('less-local', 'ts-local')));

// default -> build
gulp.task('default', gulp.parallel('build', 'build-local'));