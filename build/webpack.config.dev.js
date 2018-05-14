// const fs = require('fs');
// const path = require('path');
// const webpack = require('webpack');
// const aliases = require('../build/alias');
// const version = process.env.VERSION || require('../package.json').version;

const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');

const resolve = p => path.resolve(__dirname, '../', p);

module.exports = merge(baseConfig, {
  devtool: 'inline-source-map',
  entry: resolve('src/index.dev.js')
});

