const gulp = require('gulp');

const named = require('vinyl-named');
const webpackStream = require('webpack-stream');

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
	filename: '[name].js',
	sourceMapFilename: '[name].js.map'
};

module.exports.buildAll = function tsBuildAll(config) {
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
				'core/**/*.ts',
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
				// commons: {
				// 	test: /[\\/]smart-utils[\\/]/,
				// 	name: 'smart-utils',
				// 	enforce: true
				// }
			}
		};
	}

    return gulp.src(config.src)
        .pipe(named(config.nameFunction))
        .pipe(webpackStream(webpackConfig));
};
