const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
	cache: { type: 'memory' },
	resolve: {
		extensions: ['.ts', '.js', '.jsx', '.vue', '.json', '.wasm'],
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
	entry: './src/main.ts',
	output: {
		filename: 'js/[name].js',
		chunkFilename: 'js/[name].js',
		clean: true,
	},

	module: {
		noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
		rules: [
			{
				test: /\.(vue)(\?.*)?$/,
				use: {
					loader: 'vue-loader',
					options: {
						babelParserPlugins: ['jsx', 'classProperties', 'decorators-legacy'],
					},
				},
			},
			{
				test: /\.(s?css|sass)(\?.*)?$/,
				use: [
					'vue-style-loader',
					'style-loader',
					'css-loader',
					'postcss-loader',
					'sass-loader',
				],
			},
			{
				test: /\.(tsx?)(\?.*)?$/,
				use: [
					{
						loader: 'esbuild-loader',
						options: {
							loader: 'tsx',
							target: 'es2015',
						},
					},
				],
			},
			{
				test: /\.(js)(\?.*)?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'esbuild-loader',
						options: {
							target: 'es2015',
						},
					},
				],
			},
			{
				test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
				type: 'asset',
			},
			{
				test: /\.(svg)(\?.*)?$/,
				type: 'asset',
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				type: 'asset',
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				type: 'asset',
			},
		],
	},
	plugins: [
		new HtmlPlugin({
			title: 'vue3-ts-webpack-template',
			template: './index.html',
		}),
		new CopyPlugin({
			patterns: [
				{
					from: 'public',
					to: '',
					toType: 'dir',
					globOptions: {
						ignore: ['.DS_Store'],
					},
				},
			],
		}),
		new ForkTsCheckerWebpackPlugin({
			typescript: {
				extensions: {
					vue: {
						enabled: true,
						compiler: '@vue/compiler-sfc',
					},
				},
				diagnosticOptions: {
					semantic: true,
					syntactic: false,
				},
			},
		}),
		new VueLoaderPlugin(),
	],
};
