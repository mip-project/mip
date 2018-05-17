/**
 * @file mip-complevel2
 * @author sfe
 */

/* global mip */

mip.customElement('mip-complevel2', {
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
    mounted() {
        console.log(this.userinfo)
    },
    methods: {
    }
});
