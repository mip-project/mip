/**
 * @file mip-pix 统计组件
 * @author mj(zoumiaojiang@gmail.com)
 * @author zhangzhiqiang(zhiqiangzhang37@163.com)
 */

<template>
    <img
        class="mip-pix"
        :src="realSrc"
    />
</template>

<script>
/* eslint-disable fecs-esnext-ext,fecs-valid-jsdoc */
/**
 * 替换请求链接中的参数
 *
 * @param {string} src      用户填写在mip-pix中的src
 * @param {string} paraName key, 如"title"
 * @param {string} paraVal  value, 如当前时间戳
 * @return {string} url
 */
function addParas(src, paraName, paraVal) {
    let paraNameQ = new RegExp('\\$?{' + paraName + '}', 'g');
    if (src.search(paraNameQ) > -1) {
        return src.replace(paraNameQ, paraVal);
    }
    src += src.indexOf('?') > -1 ? '&' : '?';
    return src + paraName + '=' + paraVal;
}

/**
 * 从body获取mip-expeirment实验分组
 *
 * @param  {string} attr 实验名
 * @return {string}      实验分组
 */
function getBodyAttr(attr) {
    return document.body.getAttribute(attr) || 'default';
}

export default {

    data() {
        return {
            realSrc: undefined
        };
    },

    props: {
        src: String
    },

    firstInviewCallback(element) {
        let src = this.src;
        // 替换通用参数
        src = addParas(src, 'TIME', Date.now());
        src = addParas(src, 'TITLE', encodeURIComponent(document.title));
        src = addParas(src, 'HOST', encodeURIComponent(location.href));

        // 增加对<mip-experiment>支持，获取实验分组
        let expReg = /MIP-X-((\w|-|\d|_)+)/g;
        let matchExpArr = src.match(expReg);
        for (let i in matchExpArr) {
            let matchExp = matchExpArr[i];
            src = addParas(src, matchExp, getBodyAttr(matchExp));
        }

        // 去除匹配失败的其余{参数}
        src = src.replace(/\$?{.+?}/g, '');
        // 去除其余 '${', '{', '}' 确保输出不包含 MIP 定义的语法
        src = src.replace(/\$?{|}/g, '');
        this.realSrc = src;
    }
};

</script>

<style lang="less" scoped>

mip-pix {
    font-size: 0;
    .mip-pix {
        width: 0;
        height: 0;
    }
}

</style>
