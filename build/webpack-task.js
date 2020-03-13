const gulp = require('gulp');

const named = require('vinyl-named');
const webpackStream = require('webpack-stream');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;

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

    config = Object.assign({dev: false, check: true}, config);

    webpackConfig.context = config.content;
    webpackConfig.output = Object.assign({}, OUTPUT_DEFAULT, config.output);
    webpackConfig.resolve = {
		extensions: ['.ts', '.js']
	};
    webpackConfig.module.rules.push({
		test: /\.ts?$/,
		loader: 'awesome-typescript-loader',
		options: {
			configFileName: 'tsconfig.json',
			reportFiles: [
				'src/helpers/**/*.ts',
				'src/components/**/*.ts'
			]
		}
	});

	// if (config.declarations) {
	// 	webpackConfig.plugins.push(new DeclarationBundlerPlugin({
	// 		moduleName: '"smart-library"',
	// 		out: '../@types/index.d.ts'
	// 	}));
	// }

	if (config.check) {
		webpackConfig.plugins.push(new CheckerPlugin());
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

	if (config.commonChunk) {
		webpackConfig.optimization.splitChunks = {
			chunks: 'all',
			minSize: 90 * 1024,
			cacheGroups: {
				commons: {
					test: /[\\/]helpers[\\/]/,
					name: config.commonChunk,
					enforce: true
				}
			}
		};
	}

    return gulp.src(config.src)
        .pipe(named(config.nameFunction))
        .pipe(webpackStream(webpackConfig));
};
