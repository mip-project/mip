/**
 * @file mip-img
 * @author mj(zoumiaojiang@gmail.com)
 * @author zhangzhiqiang37(zhiqiangzhang37@163.com)
 */

<template>
    <div class="mip-img" :style="{width: computedWidth}">
        <img
            :src="imgSrc"
            :usemap="usemap"
            :title="title"
            :sizes="sizes"
            :ismap="ismap"
            :alt="alt"
            :srcset="imgSrcset"
            ref="img"
            @click="popupShow"
            :style="imgStyle"
        />

        <div v-if="popupVal && showPopup"
            class="mip-img-popup-wrapper"
            @click="popupHide">
            <div
                class="mip-img-popup-bg"
                :class="{
                    show: placeImg
                }"
            ></div>
            <img
                :class="{'mip-img-popup-innerimg': placeImg}"
                :src="imgSrc"
                :sizes="sizes"
                :srcset="imgSrcset"
                :style="popupImgStyle"
            />
        </div>
    </div>
</template>

<script>
import util from '../../util';

let clientWidth = document.documentElement.clientWidth;

export default {
    name: 'mip-img',
    data() {
        return {
            showPopup: false,
            popupImgStyle: null,
            imgStyle: null,
            placeImg: false,
            loaded: false
        };
    },
    props: {
        src: String,
        alt: String,
        title: String,
        usemap: String,
        sizes: String,
        ismap: String,
        srcset: String,
        // 高/宽比例，用于占位，如宽50px，高100px，heightWidthRatio就是50/100=50%
        heightWidthRatio: String,
        width: [Number, String],
        height: [Number, String],
        popup: [Boolean, String],
        layout: String
    },
    computed: {
        computedWidth() {
            // 宽度支持写百分比等，纯数字认为是像素单位
            let width = this.width;
            return /^\d+$/.test(width) ? `${width}px` : width;
        },
        popupVal() {
            return this.popup !== undefined;
        },
        imgSrcset() {
            let imgSrcset = this.srcset;
            if (imgSrcset) {
                let reg = /[\w-/]+\.(jpg|jpeg|png|gif|webp|bmp|tiff) /g;
                let srcArr = imgSrcset.replace(reg, function (url) {
                    return util.makeCacheUrl(url, 'img');
                });
                return srcArr;
            }
        },
        imgSrc() {
            return this.loaded ? this.src : undefined;
        }
    },
    methods: {
        getImgRect() {
            return this.$refs.img.getBoundingClientRect();
        },
        popupShow() {
            // 图片未加载则不弹层
            if (!this.$refs.img.naturalWidth || !this.popupVal) {
                return;
            }

            this.showPopup = true;

            let {left, top, width, height} = this.getImgRect();
            this.popupImgStyle = {
                left: left + 'px',
                top: top + 'px',
                width: width + 'px',
                height: height + 'px'
            };

            setTimeout(() => {
                this.placeImg = true;
                this.popupImgStyle = {
                    width: clientWidth + 'px',
                    height: height * clientWidth / width + 'px'
                };
                this.imgStyle = {visibility: 'hidden'};
            }, 16);
        },
        popupHide() {
            this.placeImg = false;

            let {left, top, width, height} = this.getImgRect();
            this.popupImgStyle = {
                left: left + 'px',
                top: top + 'px',
                width: width + 'px',
                height: height + 'px'
            };
            setTimeout(() => {
                this.showPopup = false;
                this.imgStyle = null;
            }, 400);
        }
    },
    firstInviewCallback(element) {
        element.applyFillContent(this.$el, true);
        this.loaded = true;
    }
};


</script>

<style lang="less" scoped>
@import '../../styles/variable.less';
mip-img {
    font-size: 0;
    background: @placeholder-bg;

    img {
        width: 100%;
        height: 100%;
    }

    .mip-img-popup-wrapper {
        z-index: 9999;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        .mip-img-popup-bg {
            height: 100%;
            background: rgba(0, 0, 0, 1);
            transition: opacity ease .4s;
            opacity: 0;

            &.show {
                opacity: 1;
            }
        }
        img {
            position: absolute;
            transition: all ease .4s;
            max-width: 100%;
            max-height: 100%;
        }
        .mip-img-popup-innerimg {
            width: 100% !important;
            top: 50% !important;
            left: 0 !important;
            transform: translate(0, -50%);
        }
    }
}
</style>
