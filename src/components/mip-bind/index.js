/**
 * @file mip-data.js
 * @author huanghuiquan (huanghuiquan@baidu.com)
 */

import Bind from './bind';
import debug from 'debug';
let log = debug('mip-data');

export default {
    template: '<div></div>',
    created() {
        log('create');

        this.bind = new Bind();
        this.postMessage(this.$root.$options.propsData);
    },
    mounted() {
        this.bind.start();
    },
    methods: {
        postMessage(data) {
            log('postMessage.');

            window.m = window.m ? window.m : {};
            let loc = window.location;
            let domain = loc.protocol + '//' + loc.host;
            window.postMessage({
                type: 'bind',
                m: data
            }, domain);
        }
    }
};
