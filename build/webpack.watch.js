const path = require('path');
var merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Stylelint = require('stylelint-webpack-plugin');
const webpack = require('webpack');
const sourceMap = require('./webpack.entry');
const root = process.cwd();
let config = require('./webpack.base.config');
const htmls = sourceMap('html');

config = merge(config, {
  plugins: Object.keys(htmls).map(function (key) {
    return new HtmlWebpackPlugin({
      filename: path.resolve(root, `dist/templates/${key}.html`),
      template: htmls[key],
      inject: true,
      chunks: ['vendors', key]
    });
  })
}, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '\'production\''
      }
    }),
    new Stylelint({
      files: ['**/*.s?(a|c)ss', '**/*.vue'],
      syntax: 'scss'
    })
  ]
});

module.exports = config;
