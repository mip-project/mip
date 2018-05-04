/**
 * @file alias.js
 * @author huanghuiquan (huanghuiquan@baidu.com)
 */

const path = require('path');

const resolve = p => path.resolve(__dirname, '../', p);

module.exports = {
    mip: resolve('src/vue/platforms/web/entry-runtime-with-compiler'),
    compiler: resolve('src/vue/compiler'),
    core: resolve('src/vue/core'),
    shared: resolve('src/vue/shared'),
    web: resolve('src/vue/platforms/web'),
    // server: resolve('src/server'),
    // entries: resolve('src/entries'),
    sfc: resolve('src/vue/sfc')
};
