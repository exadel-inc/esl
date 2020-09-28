const gulp = require('gulp');
const paths = require('../paths');

const named = require('vinyl-named');
const webpackStream = require('webpack-stream');

const { FAST_BUILD } = require('./config');

const OPTIONS_DEFAULT = {
	dev: false,
	check: true,
	target: 'ES5'
};

const INITIAL_CONFIG = {
	watch: false,
	devtool: 'source-map',
	module: { rules: [] },
	mode: 'production',
	plugins: [],
	optimization: {}
};

const OUTPUT_DEFAULT = {
	umdNamedDefine: true,
	globalObject: 'window',
	jsonpFunction: '~ESLCore~',
	filename: '[name].js',
	sourceMapFilename: '[name].js.map'
};

function buildTs(config) {
	const webpackConfig = Object.assign({}, INITIAL_CONFIG);
	config = Object.assign({}, OPTIONS_DEFAULT, config);

    webpackConfig.context = config.content;
    webpackConfig.output = Object.assign({}, OUTPUT_DEFAULT, config.output);
    webpackConfig.resolve = {
		extensions: ['.ts', '.js']
	};
    webpackConfig.module.rules.push({
		test: /\.ts?$/,
		loader: 'ts-loader',
		options: {
			compilerOptions: {
				declaration: config.declarations,
				target: config.target
			},
			reportFiles: [
				'components/**/*.ts'
			],
			transpileOnly: !config.check && !config.declarations
		}
	});

	if (config.declarations) {
		const DeclarationPlugin = require('./plugins/declaration-webpack-plugin');
		webpackConfig.plugins.push(new DeclarationPlugin());
	}

	if (config.check) {
		webpackConfig.module.rules.push({
			enforce: 'pre',
			test: /\.ts$/,
			exclude: /node_modules/,
			loader: 'eslint-loader',
			options: {
				formatter: 'unix',
				emitWarning: true
			}
		});
	}
	webpackConfig.optimization.namedChunks = true;
	if (config.commonChunk) {
		webpackConfig.optimization.splitChunks = {
			chunks: 'all',
			minSize: 90 * 1024,
			cacheGroups: {
				commons: {
					name: 'esl-core',
					test: /[\\/](esl-utils|esl-base-element)[\\/]/,
					enforce: true
				}
			}
		};
	}

    return gulp.src(config.src)
        .pipe(named(config.nameFunction))
        .pipe(webpackStream(webpackConfig));
}

module.exports.default = buildTs;

module.exports.buildTsLib = function buildTsLib() {
	return buildTs({
		src: paths.bundle.ts,
		context: paths.bundle.context,
		check: !FAST_BUILD,
		output: {
			library: 'ESL',
			libraryTarget: 'umd'
		}
	}).pipe(gulp.dest(paths.bundle.target));
};

module.exports.buildTsBundles = function buildBundles() {
	return buildTs({
		src: paths.bundle.tsComponents,
		target: 'ES6',
		context: paths.bundle.context,
		commonChunk: true,
		check: !FAST_BUILD,
		output: {
			library: 'ESL',
			libraryTarget: 'umd'
		}
	}).pipe(gulp.dest(paths.bundle.target));
};

module.exports.buildTsLocal = function buildTsLocal() {
	return buildTs({
		src: paths.test.ts,
		context: paths.bundle.context,
		check: false
	}).pipe(gulp.dest(paths.test.target));
};
