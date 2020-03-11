const HtmlWebpackPlugin = require('html-webpack-plugin');
// const RMLPlugin = require('../src/plugin');
const path = require('path');
const rmlLoader = require.resolve('..');

module.exports = {
  context: __dirname,
  devtool: 'source-map',
  mode: 'development',
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.rml$/i,
        loader: rmlLoader,
        options: {
          renderer: 'react',
        },
      },
      {
        test: /\.css$/,
        use: require.resolve('stylesheet-loader'),
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ].map(require.resolve),
      }
    ],
  },
  plugins: [
    // new RMLPlugin(),
    new HtmlWebpackPlugin({ template: 'index.html' }),
  ],
};
