const HtmlWebpackPlugin = require('html-webpack-plugin');
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
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: 'index.html' }),
  ],
};
