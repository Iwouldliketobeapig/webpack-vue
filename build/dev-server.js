var express = require('express');
var webpack = require('webpack');
const config = require('config-lite');
var proxyMiddleware = require('http-proxy-middleware');
const webpackConfig = require('./webpack.dev');

// default port where dev server listens for incoming traffic
var port = parseInt(config.port) + 1;

// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware

var app = express();
var compiler = webpack(webpackConfig);

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
});

var hotMiddleware = require('webpack-hot-middleware')(compiler);

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' });
    cb();
  });
});

app.use(proxyMiddleware('^/api/v1/**', {
  target: config.proxy.target
}));

console.log(` proxy on ${config.proxy.target}`);

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// serve pure static assets
// app.use('/dist', express.static('/'));

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`
                   .'  '. 
                :      :
                | _  _ |
             .-.|(o)(o)|.-.        _._          _._
            ( ( | .--. | ) )     .',_ '.      .' _,'.
             '-/ (    ) \\-'     / /' .\\ \\ __ / /' .\\ \\           listen on ${port}
              /   '--'   \\     / /     \\.'  './     \\ \\          here we go ~~~ 
              \\ .'===='. /     .-.     : _  _ :      .-.
               .\\      /'              |(o)(o)|
                 .\\  /'                |      |
                 /.-.-.\\_             /        \\
           _..:;\\._/V\\_./:;.._       /   .--.   \\
         .'/;:;:;\\ /^\\ /:;:;:\\'.     |  (    )  | 
        / /;:;:;:;\\| |/:;:;:;:\\ \\    _\\  '--'  /__
       / /;:;:;:;:;\\_/:;:;:;:;:\\ \\ .'  '-.__.-'   .-.
  `);
});

module.exports = config;
