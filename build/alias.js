/**
 * @file alias.js
 * @author huanghuiquan (huanghuiquan@baidu.com)
 */

const path = require('path');

const resolve = p => path.resolve(__dirname, '../', p);

module.exports = {
    mip: resolve('src/platforms/web/entry-runtime-with-compiler'),
    compiler: resolve('src/compiler'),
    core: resolve('src/core'),
    shared: resolve('src/shared'),
    web: resolve('src/platforms/web'),
    // server: resolve('src/server'),
    // entries: resolve('src/entries'),
    sfc: resolve('src/sfc')
};
