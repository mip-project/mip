/**
 * @file webpack 基础配置
 * @author wangyisheng@baidu.com (wangyisheng)
 */

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const ConcatPlugin = require('webpack-concat-plugin');
const version = process.env.VERSION || require('../package.json').version;

const resolve = p => path.resolve(__dirname, '../', p);

let filesToConcat = [
    resolve('deps/fetch.js'),
    resolve('deps/fetch-jsonp.js'),
    'zepto',
    'esljs'
];

module.exports = {

    output: {
        path: resolve('dist'),
        filename: 'mip.js',
        publicPath: '/dist/'
        // chunkFilename: '[id].chunk.js'
    },

    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.vue$/, loader: 'vue-loader' },
        ]
    },

    resolve: {
        alias: {
            vue: resolve('src/vue/platforms/web/entry-runtime'),
            compiler: resolve('src/vue/compiler'),
            core: resolve('src/vue/core'),
            shared: resolve('src/vue/shared'),
            web: resolve('src/vue/platforms/web'),
            sfc: resolve('src/vue/sfc'),
            deps: resolve('deps')
        }
    },

    // Expose __dirname to allow automatically setting basename.
    context: __dirname,
    node: {
        __dirname: true
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            '__VERSION__': JSON.stringify(version.toString())
        }),
        new ConcatPlugin({
            // uglify: true,
            name: 'deps',
            filesToConcat
        })
    ]

}
