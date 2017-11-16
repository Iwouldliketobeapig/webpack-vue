const path = require("path");
var merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const Stylelint = require("stylelint-webpack-plugin");
const glob = require("glob");
const webpack = require("webpack");
const assert = require("assert");
const sourceDir = "pages";
const process = require("process");

const root = process.cwd();

function sourceMap (suffix) {
  const maps = {};
  glob.sync(`${sourceDir}/modules/**/*.${suffix}`).forEach(function (url) {
    const ret = url.match(`${sourceDir}\/modules\/(.*).${suffix}$`);
    assert(ret);

    maps[ret[1]] = ret[0];
  });

  return maps;
};

const entry = sourceMap("js");
const htmls = sourceMap("html");

let config = {
  entry: Object.assign(entry, {
    vendors: ["vue", "vue-router", "vuex", "axios", "normalize.css",
      "assets/css/common.css"]
  }),
  output: {
    path: path.resolve(root, "dist/static"),
    publicPath: "/",
    filename: "js/[name].[chunkhash].js",
    chunkFilename: "[id].[chunkhash].js"
  },
  devtool: false,
  resolve: {
    extensions: [".js", ".vue"],
    modules: [
      path.join(root, "node_modules")
    ],
    alias: {
      "pages": path.resolve(root, "pages"),
      "assets": path.resolve(root, "pages/assets"),
      "layouts": path.resolve(root, "pages/layouts"),
      "components": path.resolve(root, "pages/components"),
      "common": path.resolve(root, "pages/common"),
      vue: "vue/dist/vue.js"
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.(js|es6)$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          { loader: 'css-loader', options: { importLoaders: 1 } },
          "sass-loader"
        ]
      },
      {
        test: /\.html$/,
        loader: "vue-html-loader"
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "file-loader"
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "file-loader"
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("css/[name].[contenthash].css", {
      allChunks: true
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: "\"production\""
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendors",
      chunks: Object.keys(entry),
      minChunks: entry.length
    }),
    new Stylelint({
      files: ["**/*.s?(a|c)ss", "**/*.vue"],
      syntax: "scss"
    })
  ]
};

config = merge(config, {
  plugins: Object.keys(htmls).map(function (key) {
    return new HtmlWebpackPlugin({
      filename: path.resolve(root, `dist/templates/${key}.html`),
      template: htmls[key],
      inject: true,
      chunks: ["vendors", key]
    });
  })
});

module.exports = config;
