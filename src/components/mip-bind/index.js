/**
 * @file mip-data.js
 * @author huanghuiquan (huanghuiquan@baidu.com)
 */

import Bind from './bind';

export default {
    template: '<div></div>',
    created() {
        this.bind = new Bind();
        this.postMessage(this.$root.$options.propsData);
    },
    mounted() {
        this.bind.start();
    },
    methods: {
        postMessage(data) {
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
