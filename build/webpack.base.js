const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const sourceMap = require('./webpack.entry');

const root = process.cwd();
const entry = sourceMap('js');

const config = {
  entry: Object.assign(entry, {
    vendors: ['vue', 'vue-router', 'vuex', 'axios', 'normalize.css',
      'assets/css/common.css']
  }),
  output: {
    path: path.resolve(root, 'dist/static'),
    publicPath: '/',
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: '[id].[chunkhash].js'
  },
  devtool: false,
  resolve: {
    extensions: ['.js', '.vue'],
    modules: [
      path.join(root, 'node_modules')
    ],
    alias: {
      'pages': path.resolve(root, 'pages'),
      'assets': path.resolve(root, 'pages/assets'),
      'layouts': path.resolve(root, 'pages/layouts'),
      'components': path.resolve(root, 'pages/components'),
      'common': path.resolve(root, 'pages/common'),
      vue: 'vue/dist/vue.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(js|es6)$/,
        loader: 'babel-loader', // loaders: ['strip-loader?strip[]=console.log,strip[]=console.warn', 'babel-loader']
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'sass-loader'
        ]
      },
      {
        test: /\.html$/,
        loader: 'vue-html-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 8048,
          name: 'assets/imgs/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 8048,
          name: 'assets/fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('css/[name].[contenthash].css', {
      allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      chunks: Object.keys(entry),
      minChunks: entry.length
    })
  ]
};

module.exports = config;
