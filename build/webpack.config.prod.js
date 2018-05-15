/**
 * @file webpack prod 配置
 * @author wangyisheng@baidu.com (wangyisheng)
 */

const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const resolve = p => path.resolve(__dirname, '../', p);

module.exports = merge.smart(baseConfig, {
    entry: resolve('src/index.js'),

    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    extractCSS: true
                }
            }
        ]
    },

    plugins: [
        new ExtractTextPlugin('mip.css'),
        new UglifyJsPlugin()
    ]
});
