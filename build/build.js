/**
 * @file webpack build 脚本
 * @author wangyisheng@baidu.com (wangyisheng)
 */

'use strict';

process.env.NODE_ENV = 'production';

const ora = require('ora');
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.prod');

const spinner = ora('building for production...');
spinner.start();

rm(path.join(__dirname, '../dist'), err => {
    if (err) {
        throw err;
    }

    webpack(webpackConfig, (err, stats) => {
        spinner.stop();
        if (err) {
            throw err;
        }

        process.stdout.write(stats.toString({
                colors: true,
                modules: false,
                children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
                chunks: false,
                chunkModules: false
            }) + '\n\n');

        if (stats.hasErrors()) {
            console.log(chalk.red('  Build failed with errors.\n'));
            process.exit(1);
        }

        console.log(chalk.cyan('  Build complete.\n'));
    });
});
