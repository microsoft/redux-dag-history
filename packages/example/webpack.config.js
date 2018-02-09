const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
	devtool: 'source-map',
	context: path.join(__dirname),
	entry: {
		javascript: './src/app.tsx',
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'appbundle.js',
	},
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
		alias: {
			'react/lib/ReactMount': 'react-dom/lib/ReactMount',
		},
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'DAG History Component Example',
		}),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.ProvidePlugin({
			saveAs: 'imports?this=>global!exports?global.saveAs!filesaver.js',
		}),
	],
	module: {
		rules: [
			{ test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },
			{ test: /\.ts(x|)/, use: ['ts-loader'], exclude: /node_modules/ },
		],
	},
}
