/**
 * @file mip-complevel1
 * @author sfe
 */

/* global mip */

mip.customElement('mip-complevel1', {
    template: `
        <div class="mip-complevel1">
            <mip-complevel2 m-bind:userinfo="userinfo" userinfo="userInfo"></mip-complevel2>
            <p @click="changeData">click me to change name</p>
        </div>
    `,
    props: {
        userinfo: {
            default() {
                return {};
            },
            type: Object
        }
    },
    methods: {
        changeData() {
            this.$emit('test-event', {name:'sfe-1'});
        }
    }
});
