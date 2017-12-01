const glob = require('glob');
const assert = require('assert');

function sourceMap (suffix) {
  const maps = {};
  glob.sync(`pages/modules/**/*.${suffix}`).forEach(function (url) {
    const ret = url.match(`pages\/modules\/(.*).${suffix}$`);
    assert(ret);

    maps[ret[1]] = ret[0];
  });
  return maps;
};

module.exports = sourceMap;
