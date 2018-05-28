/**
 * @file mip-complevel2
 * @author sfe
 */

/* global mip */

mip.registerVueCustomElement('mip-complevel2', {
    template: `
        <p>{{userinfo.name}}</p>
    `,
    props: {
        userinfo: {
            default() {
                return {};
            },
            type: Object
        }
    },
    updated() {
        // console.log(this.userinfo)
    },
    methods: {
    }
});
