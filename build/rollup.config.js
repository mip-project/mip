/**
 * @file rollup.config.js
 * @author sfe-sy (sfe-sy@baidu.com)
 */

const path = require('path');
const babel = require('rollup-plugin-babel');
const alias = require('rollup-plugin-alias');
const replace = require('rollup-plugin-replace');
const node = require('rollup-plugin-node-resolve');
const cjs = require('rollup-plugin-commonjs');
const version = process.env.VERSION || require('../package.json').version;
const aliases = require('./alias');

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
        entry: resolve('src/index.js'),
        dest: resolve('dist/mip.js'),
        format: 'umd',
        env: 'development',
        // alias: {he: './entity-decoder'},
        banner
    },
    // 'web-full-esm': {
    //     entry: resolve('web/entry-runtime-with-compiler.js'),
    //     dest: resolve('dist/mip.esm.js'),
    //     format: 'es',
    //     alias: {
    //         he: './entity-decoder'
    //     },
    //     banner
    // }
};

function genConfig(name) {
    const opts = builds[name];
    const config = {
        input: opts.entry,
        // external: opts.external,
        plugins: [
            node(),
            // cjs(),
            replace({
                __VERSION__: version
            }),
            babel()
            // alias(Object.assign({}, aliases, opts.alias))
        ].concat(opts.plugins || []),
        output: {
            file: opts.dest,
            format: opts.format,
            banner: opts.banner,
            name: opts.moduleName || 'MIP'
        }
    };

    if (opts.env) {
        config.plugins.push(replace({
            'process.env.NODE_ENV': JSON.stringify(opts.env)
        }));
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
