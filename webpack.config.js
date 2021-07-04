const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { GenerateSW } = require('workbox-webpack-plugin');
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');
const BundleAnalyzerPlugin =
	require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
	cache: { type: 'memory' },
	resolve: {
		extensions: ['.ts', '.js', '.jsx', '.vue', '.json', '.wasm'],
		alias: {
			'@': path.resolve(__dirname, 'src'),
			vue$: 'vue/dist/vue.runtime.esm-bundler.js',
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
				test: /\.vue$/,
				use: {
					loader: 'vue-loader',
					options: {
						babelParserPlugins: ['jsx', 'classProperties', 'decorators-legacy'],
					},
				},
			},
			{
				test: /\.s?css$/,
				use: [
					'vue-style-loader',
					'style-loader',
					'css-loader',
					'postcss-loader',
					{
						loader: 'sass-loader',
					},
				],
			},
			{
				test: /\.sass$/,
				use: [
					'vue-style-loader',
					'style-loader',
					'css-loader',
					'postcss-loader',
					{
						loader: 'sass-loader',
					},
				],
			},
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
					},
					{
						loader: 'ts-loader',
						options: {
							appendTsSuffixTo: ['\\.vue$'],
						},
					},
				],
			},
			{
				test: /\.tsx$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
					},
					{
						loader: 'ts-loader',
						options: {
							appendTsxSuffixTo: ['\\.vue$'],
						},
					},
				],
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['babel-loader'],
			},
			{
				test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 4096,
							fallback: {
								loader: 'file-loader',
								options: {
									name: 'img/[name].[hash:8].[ext]',
								},
							},
						},
					},
				],
			},
			{
				test: /\.(svg)(\?.*)?$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'img/[name].[hash:8].[ext]',
						},
					},
				],
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 4096,
							fallback: {
								loader: 'file-loader',
								options: {
									name: 'img/[name].[hash:8].[ext]',
								},
							},
						},
					},
				],
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 4096,
							fallback: {
								loader: 'file-loader',
								options: {
									name: 'img/[name].[hash:8].[ext]',
								},
							},
						},
					},
				],
			},
		],
	},
	optimization: {
		minimize: true,
	},
	plugins: [
		new HtmlPlugin({
			title: 'vue3-ts-webpack-template',
			template: './public/index.html',
		}),
		new PreloadWebpackPlugin(),
		new CopyPlugin({
			patterns: [
				{
					from: 'public',
					to: 'dist',
					toType: 'dir',
					globOptions: {
						ignore: ['.DS_Store', 'index.html'],
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
		new GenerateSW({
			include: [/^index\.html$/, /\.css$/, /\.js$/],
			exclude: [],
			runtimeCaching: [
				{
					urlPattern: /\.(?:png|jpe?g|gif|webp|svg)$/,
					handler: 'CacheFirst',
					options: {
						cacheName: 'images-cache',
					},
				},
				{
					urlPattern: /\.(?:mp4|webm|ogg|mp3|wav|flac|aac)$/,
					handler: 'CacheFirst',
					options: {
						cacheName: 'videos-cache',
					},
				},
				{
					urlPattern: /\.(?:woff2?|eot|ttf|otf)$/,
					handler: 'CacheFirst',
					options: {
						cacheName: 'fonts-cache',
					},
				},
				{
					urlPattern: /\.css$/,
					handler: 'StaleWhileRevalidate',
					options: {
						cacheName: 'css-cache',
					},
				},
				{
					urlPattern: /\.js$/,
					handler: 'StaleWhileRevalidate',
					options: {
						cacheName: 'js-cache',
					},
				},
			],
		}),
		new VueLoaderPlugin(),
		new BundleAnalyzerPlugin({
			openAnalyzer: false,
		}),
	],
	devServer: {
		host: 'localhost',
		port: 8000,
		hot: true,
		overlay: false,
	},
};
