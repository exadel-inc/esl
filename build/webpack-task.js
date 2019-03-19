const path = require('path');
const gulp = require('gulp');

const named = require('vinyl-named');
const webpackStream = require('webpack-stream');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const TS_LINT = path.join(__dirname, '../tslint.json');
const TS_CONFIG = path.join(__dirname, '../tsconfig.json');

module.exports = function tsBuild(config) {
	config = Object.assign({
		dev: false
	}, config);

	const webpackConfig = Object({
		context: config.content,
		output: Object.assign({
			sourceMapFilename: '[name].js.map',
			filename: '[name].js',
			library: 'SmartWC',
			libraryTarget: 'umd'
		}, config.output),
		watch: false,
		devtool: 'source-map',
		module: {
			rules: [
				{
					test: /\.ts?$/,
					loader: 'ts-loader',
					exclude: /node_modules/,
					options: {
						// disable type checker - we will use it in fork plugin
						transpileOnly: true,
						configFile: TS_CONFIG
					}
				}
			]
		},
		resolve: {
			extensions: ['.ts']
		},
		mode: 'production',
		plugins: [
			new ForkTsCheckerWebpackPlugin({
				tslint: TS_LINT,
				tsconfig: TS_CONFIG,
				reportFiles: [
					'src/**/*.{ts,tsx}'
				]
			})
		]
	});
	return gulp.src(config.src)
		.pipe(named(config.nameFunction))
		.pipe(webpackStream(webpackConfig));
};
