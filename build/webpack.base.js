const path = require('path');
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
  devtool: false
};

export default config;
