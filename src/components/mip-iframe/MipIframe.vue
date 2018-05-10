/**
 * @file index.js
 * @author mj(zoumiaojiang@gmail.com)
 */
<template>
    <div class="mip-iframe"></div>
</template>

<script>
export default {
    props: {
        src: String,
        width: [Number, String],
        height: [Number, String],
        allowfullscreen: [Boolean, String],
        srcdoc: [String],
        sanbox: [String],
        allowtransparency: [String]
    }
};
</script>

<style lang="less">
mip-iframe {
    display: block;
    position: relative;
    overflow: hidden;
    iframe {
        display: block;
        width: 100px;
        min-width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }
}
</style>
