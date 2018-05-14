const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const aliases = require('../build/alias');
const version = process.env.VERSION || require('../package.json').version;
console.log('version', version)

const resolve = p => path.resolve(__dirname, '../', p);

module.exports = {

  devtool: 'inline-source-map',

  entry: resolve('src/index.dev.js'),

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
      mip: resolve('src/vue/platforms/web/entry-runtime'),
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
    })
  ]

}
