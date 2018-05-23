/**
 * @file index.js
 * @author mj(zoumiaojiang@gmail.com)
 */

<template>
    <div
        v-if="ifsrc && height"
        class="mip-iframe"
        :allowfullscreen="allowfullscreen"
        :sanbox="sanbox"
        :allowtransparency="allowtransparency"
    >
        <iframe
            frameBorder="0"
            scrolling="no"
            :src="ifsrc"
        ></iframe>
    </div>
</template>

<script>
/* eslint-disable fecs-esnext-ext,fecs-valid-jsdoc */
export default {
    props: {
        src: String,
        width: [Number, String],
        height: [Number, String],
        srcdoc: [String],
        sanbox: [String],
        allowfullscreen: {
            default() {
                return false;
            },
            type: [Boolean, String]
        },
        allowtransparency: [Boolean, String]
    },

    computed: {
        ifsrc() {
            if (this.srcdoc) {
                return 'data:text/html;charset=utf-8;base64,' + window.btoa(this.srcdoc);
            }
            return this.src;
        }
    }
};
</script>

<style lang="less" scoped>
.mip-iframe {
    display: block;
    position: relative;
    overflow: hidden;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    iframe {
        display: block;
        width: 100px;
        min-width: 100%;
        height: 100%;
        left: 0;
        top: 0;
    }
}
</style>
