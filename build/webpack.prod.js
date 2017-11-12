const path = require("path");
var merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
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
  // resolveLoader: {
  //   fallback: [path.join(root, "node_modules")]
  // },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(js|es6)$/,
        loaders: ["strip-loader?strip[]=console.log,strip[]=console.warn", "babel-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: "json-loader",
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
        loader: "style!css!postcss!sass",
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: "vue-html-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
        query: {
          limit: 8048,
          name: "assets/imgs/[name].[hash:7].[ext]"
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        query: {
          limit: 8048,
          name: "assets/fonts/[name].[hash:7].[ext]"
        }
      }
    ]
  },
  // vue: { // vue 的配置
  //   loaders: {
  //     css: ExtractTextPlugin.extract("vue-style-loader", "css"),
  //     scss: ExtractTextPlugin.extract("vue-style-loader", "css!sass")
  //   }
  // },
  plugins: [

    // new CleanWebpackPlugin(["dist"], root),
    new ExtractTextPlugin("css/[name].[contenthash].css", {
      allChunks: true
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
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
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_debugger: true,
        drop_console: true
      }
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
      chunks: ["vendors", key],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: "dependency"
    });
  })
});

module.exports = config;
