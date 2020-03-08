const path = require('path');
const gulp = require('gulp');

const named = require('vinyl-named');
const webpackStream = require('webpack-stream');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const TS_LINT = path.join(__dirname, '../tslint.json');
const TS_CONFIG = path.join(__dirname, '../tsconfig.json');

const TS_LOADER = {
	test: /\.ts?$/,
	loader: 'ts-loader',
	exclude: /node_modules/,
	options: {
		configFile: TS_CONFIG,
		reportFiles: [
			'src/**/*.{ts,tsx}'
		],
		// disable type checker - we will use it in fork plugin
		transpileOnly: true
	}
};

const INITIAL_CONFIG = {
	watch: false,
	devtool: 'source-map',
	module: { rules: [TS_LOADER] },
	mode: 'production',
	plugins: [],
	optimization: {}
};

const OUTPUT_DEFAULT = {
	filename: '[name].js',
	sourceMapFilename: '[name].js.map'
};

const createTsCheckPlugin = () => new ForkTsCheckerWebpackPlugin({
    tslint: TS_LINT,
    tsconfig: TS_CONFIG,
    reportFiles: [
        'src/**/*.{ts,tsx}'
    ]
});

module.exports.buildAll = function tsBuildAll(config) {
	const webpackConfig = Object.assign({}, INITIAL_CONFIG);

    config = Object.assign({dev: false, check: true}, config);

    webpackConfig.context = config.content;
    webpackConfig.output = Object.assign({}, OUTPUT_DEFAULT, config.output);
    webpackConfig.resolve = {
		extensions: ['.ts', '.js'],
		plugins: [new TsconfigPathsPlugin({configFile: TS_CONFIG})]
	};

	if (config.check) {
		webpackConfig.plugins.push(createTsCheckPlugin());
	}

	if (config.commonChunk) {
		webpackConfig.optimization.splitChunks = {
			chunks: 'all',
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
