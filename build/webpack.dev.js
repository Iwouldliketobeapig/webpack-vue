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
    filename: "js/[name].js",
    chunkFilename: "[name].js"
  },
  devtool: "#eval-source-map",
  resolve: {
    extensions: ["", ".js", ".vue"],
    fallback: [path.join(root, "node_modules")],
    alias: {
      "pages": path.resolve(root, "pages"),
      "assets": path.resolve(root, "pages/assets"),
      "layouts": path.resolve(root, "pages/layouts"),
      "components": path.resolve(root, "pages/components"),
      "common": path.resolve(root, "pages/common"),
      vue: "vue/dist/vue.js"
    }
  },
  resolveLoader: {
    fallback: [path.join(root, "node_modules")]
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(js|es6)$/,
        loader: "babel",
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: "json",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style", "css")
      },
      {
        test: /\.scss$/,
        loader: "style!css!postcss!sass",
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: "vue-html",
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "file"
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "file"
      }
    ]
  },
  vue: { // vue 的配置
    loaders: {
      js: "babel",
      css: ExtractTextPlugin.extract("vue-style-loader", "css"),
      scss: ExtractTextPlugin.extract("vue-style-loader", "css!sass")
    }
  },
  plugins: [
    new ExtractTextPlugin("css/[name].css", {
      allChunks: true
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
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
      filename: `templates/${key}.html`,
      template: htmls[key],
      inject: true,
      chunks: ["vendors", key],
      hash: true
    });
  })
});

// add hot-reload related code to entry chunks
Object.keys(config.entry).forEach(function (name) {
  config.entry[name] = ["./build/dev-client"].concat(config.entry[name]);
});

module.exports = config;
