const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const CSS_LOADERS = ['style-loader', 'css-loader', 'postcss-loader'];

module.exports = {
  devtool: 'source-map',
  context: path.join(__dirname),
  entry: {
    javascript: './example/app.tsx',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'appbundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      'react/lib/ReactMount': 'react-dom/lib/ReactMount',
      sinon: 'sinon/pkg/sinon',
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
        { test: /\.css$/, use: CSS_LOADERS },
        { test: /\.scss$/, use: [...CSS_LOADERS, 'sass-loader'] },
        { test: /\.ts(x|)/, use: ['ts-loader'], exclude: /node_modules/ },
    ],
  },
};
