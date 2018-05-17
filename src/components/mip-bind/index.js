/**
 * @file mip-data.js
 * @author huanghuiquan (huanghuiquan@baidu.com)
 */

import Bind from './bind';

let uid = 0;

export default {
    render() {
        return null;
    },
    created() {
        this.uid = uid++;
        this.bind = new Bind(this.uid);

        if (this.mipsrc) {
            this.getDataBySrc(this.mipsrc);
        }
        else {
            delete this.$root.$options.propsData.mipsrc;
            this.postMessage(this.$root.$options.propsData);
        }
    },
    props: {
        mipsrc: String
    },
    // mounted() {
    //     this.bind.start();
    // },
    methods: {
        getDataBySrc(url) {
            if (!url) {
                return;
            }

            fetch(url, {
                credentials: 'include'
            }).then(res => {
                if (res.ok) {
                    res.json().then(data => this.postMessage(data));
                }
                else {
                    console.error('Fetch request failed!');
                }
            }).catch(console.error);
        },

        postMessage(data) {
            window.m = window.m ? window.m : {};
            let loc = window.location;
            let domain = loc.protocol + '//' + loc.host;
            window.postMessage({
                type: 'bind' + this.uid,
                m: data
            }, domain);
        }
    }
};
