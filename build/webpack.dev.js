var merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Stylelint = require('stylelint-webpack-plugin');
const webpack = require('webpack');
const sourceMap = require('./webpack.entry');
let config = require('./webpack.base.config');
const defConfig = require('config-lite');
const htmls = sourceMap('html');

config.output.filename = 'js/[name].js';
config.output.chunkFilename = '[id].js';
config = merge(config, {
  plugins: Object.keys(htmls).map(function (key) {
    return new HtmlWebpackPlugin({
      filename: `templates/${key}.html`,
      template: htmls[key],
      inject: true,
      chunks: ['vendors', key],
      hash: true,
      title: defConfig.title
    });
  })
}, {
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new Stylelint({
      files: ['**/*.s?(a|c)ss', '**/*.vue'],
      syntax: 'scss'
    })
  ]
});

// add hot-reload related code to entry chunks
Object.keys(config.entry).forEach(function (name) {
  config.entry[name] = ['./build/dev-client'].concat(config.entry[name]);
});

module.exports = config;
