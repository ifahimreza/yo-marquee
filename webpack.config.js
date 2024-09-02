const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: './src/yo-marquee.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'yo-marquee.min.js',
		libraryTarget: 'umd',
		globalObject: 'this',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
			{
				test: /\.scss$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'yo-marquee.css',
		}),
	],
	mode: 'production',
};
