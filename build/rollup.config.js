/**
 * @file rollup.config.js
 * @author sfe-sy (sfe-sy@baidu.com)
 */

const path = require('path');
const babel = require('rollup-plugin-babel');
const alias = require('rollup-plugin-alias');
const cjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const node = require('rollup-plugin-node-resolve');
const async = require('rollup-plugin-async');
const less = require('rollup-plugin-less');
const vue = require('rollup-plugin-vue2');
const uglify = require('rollup-plugin-uglify');
const version = process.env.VERSION || require('../package.json').version;
const aliases = require('./alias');
const fs = require('fs-extra');

const banner = '/* mip */';

const resolve = p => {
    const base = p.split('/')[0];
    if (aliases[base]) {
        return path.resolve(aliases[base], p.slice(base.length + 1));
    }

    return path.resolve(__dirname, '../', p);
};

const builds = {
    // Runtime+compiler development build (Browser)
    'web-full-dev': {
        entry: resolve('src/index.dev.js'),
        dest: resolve('dist/mip.js'),
        format: 'umd',
        env: 'development',
        alias: {
            he: './entity-decoder'
        },
        banner,
        plugins: [
            node({
                jsNext: true,
                main: true,
                browser: true
            }),
            cjs()
        ]
    },
    'web-full-prod': {
        entry: resolve('src/index.js'),
        dest: resolve('dist/mip.min.js'),
        format: 'umd',
        env: 'production',
        alias: {
            he: './entity-decoder'
        },
        banner,
        plugins: [
            node({
                jsNext: true,
                main: true,
                browser: true
            }),
            cjs()
        ]
    }
};

function genConfig(name) {
    let distPath = path.resolve(__dirname, '..', 'dist');
    if (!fs.existsSync(distPath)) {
        fs.mkdirp(distPath);
    }
    const opts = builds[name];
    const config = {
        input: opts.entry,
        external: opts.external,
        plugins: (opts.plugins || []).concat(...[
            replace({
                __VERSION__: version
            }),
            vue({css: false}),
            less({
                output: resolve('dist/mip.css')
            }),
            async(),
            babel(),
            alias(Object.assign({}, aliases, opts.alias))
        ]),
        output: {
            file: opts.dest,
            format: opts.format,
            banner: opts.banner,
            name: opts.moduleName || 'mip'
        }
    };

    if (opts.env) {
        config.plugins.push(replace({
            'process.env.NODE_ENV': JSON.stringify(opts.env)
        }));
        if (opts.env === 'production') {
            config.plugins.push(uglify());
        }
    }

    Object.defineProperty(config, '_name', {
        enumerable: false,
        value: name
    });

    return config;
}

if (process.env.TARGET) {
    module.exports = genConfig(process.env.TARGET);
}
else {
    exports.getBuild = genConfig;
    exports.getAllBuilds = () => Object.keys(builds).map(genConfig);
}
