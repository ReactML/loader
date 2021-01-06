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
        test: /\.html$/i,
        loader: rmlLoader,
        options: {
          renderer: 'vanilla',
          inlineStyle: true,
        },
      },
      {
        test: /\.css$/,
        use: require.resolve('stylesheet-loader'),
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin(),
  ],
  devServer: {
    hot: false,
    inline: false,
  },
};
