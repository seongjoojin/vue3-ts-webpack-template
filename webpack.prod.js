const os = require('os');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { GenerateSW } = require('workbox-webpack-plugin');
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = merge(common, {
	mode: 'production',
	output: {
		filename: 'js/[name].[contenthash].js',
		chunkFilename: 'js/[name].[contenthash].js',
	},
	module: {
		rules: [
			{
				test: /\.(tsx?)(\?.*)?$/,
				use: [
					{
						loader: 'babel-loader',
					},
					{
						loader: 'ts-loader',
						options: {
							transpileOnly: true,
							appendTsSuffixTo: ['\\.vue$'],
							happyPackMode: false,
						},
					},
				],
			},
			{
				test: /\.(js)(\?.*)?$/,
				exclude: /node_modules/,
				use: ['babel-loader'],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),
		new PreloadWebpackPlugin({
			rel: 'preload',
			include: 'initial',
			fileBlacklist: [/\.map$/, /hot-update\.js$/],
		}),
		new GenerateSW({
			include: [/^index\.html$/, /\.css$/, /\.js$/],
			exclude: [],
			runtimeCaching: [
				{
					urlPattern: /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/,
					handler: 'CacheFirst',
					options: {
						cacheName: 'images-cache',
					},
				},
				{
					urlPattern: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
					handler: 'CacheFirst',
					options: {
						cacheName: 'videos-cache',
					},
				},
				{
					urlPattern: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
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
		new ImageMinimizerPlugin({
			exclude: /node_modules/,
			minimizerOptions: {
				plugins: [
					['gifsicle', { interlaced: true }],
					['jpegtran', { progressive: true }],
					['optipng', { optimizationLevel: 5 }],
					['svgo'],
				],
			},
		}),
	],
	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
			cacheGroups: {
				vendors: {
					name: 'chunk-vendors',
					test: /[\\/]node_modules[\\/]/,
					priority: -10,
					chunks: 'initial',
				},
				common: {
					name: 'chunk-common',
					minChunks: 2,
					priority: -20,
					chunks: 'initial',
					reuseExistingChunk: true,
				},
			},
		},
		minimize: true,
		minimizer: [
			new CssMinimizerPlugin({
				parallel: os.cpus().length - 1,
			}),
		],
	},
});