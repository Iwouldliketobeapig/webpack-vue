const path = require('path');
var merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const sourceMap = require('./webpack.entry');
let config = require('./webpack.base.config');
const root = process.cwd();
const htmls = sourceMap('html');

config = merge(config, {
  plugins: Object.keys(htmls).map(function (key) {
    return new HtmlWebpackPlugin({
      filename: path.resolve(root, `dist/templates/${key}.html`),
      template: htmls[key],
      inject: true,
      chunks: ['vendors', key],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    });
  })
}, {
  plugins: [
    new CleanWebpackPlugin(['dist'], root),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '\'production\''
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_debugger: true,
        drop_console: true
      }
    })
  ]
});

module.exports = config;
