/**
 * @file mip-img
 * @author mj(zoumiaojiang@gmail.com)
 * @author zhangzhiqiang37(zhiqiangzhang37@163.com)
 */

<template>
    <div
        class="mip-img"
    >
        <div
            class="mip-img-inner"
        >
            <img
                :src="src"
                :usemap="usemap"
                :title="title"
                :sizes="sizes"
                :ismap="ismap"
                :alt="alt"
                :srcset="imgSrcset"
                ref="img"
                @click="popupShow"
            />
        </div>
        <div
            v-if="popupVal && showPopup"
            class="mip-img-popup-wrapper"
            @click="hidePopup"
        >
            <div
                class="mip-img-popup-bg"
                :class="{
                    show: placeImg
                }"
            ></div>
            <img
                :class="{'mip-img-popup-innerimg': placeImg}"
                :src="src"
                :sizes="sizes"
                :srcset="imgSrcset"
                :style="{
                    width: popupImgWidth,
                    top: popupImgTop,
                    left: popupImgLeft
                }"

            />
        </div>
    </div>
</template>

<script>
import util from '../../util';

export default {
    name: 'mip-image',
    data() {
        return {
            showPopup: false,
            popupImgWidth: '',
            popupImgTop: '',
            popupImgLeft: '',
            placeImg: false,
            computedWidth: 0,
            computedHeight: 0
        };
    },

    props: {
        layout: {
            default() {
                return 'responsive';
            },
            type: String
        },
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
        popup: [Boolean, String]
    },

    computed: {
        wrapperHeight() {
            return this.computedHeight
                ? this.computedHeight
                : (this.heightWidthRatio ? 0 : '');
        },

        computedHeightWidthRatio() {
            if (!this.computedHeight) {
                return this.heightWidthRatio;
            }
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

        }
    },

    methods: {
        popupShow() {

            if (!this.popupVal) {
                return;
            }

            let img = this.$refs.img;
            // 图片未加载则不弹层
            if (!img.naturalWidth) {
                return;
            }

            let {left, top, width, height} = img.getBoundingClientRect();
            this.showPopup = true;
            this.popupImgLeft = `${left}px`;
            this.popupImgTop = `${top}px`;
            this.computedWidth = width + 'px';
            this.computedHeight = height + 'px';

            setTimeout(() => {
                this.placeImg = true;
            }, 16);

        },

        hidePopup() {
            this.placeImg = false;
            setTimeout(() => {
                this.showPopup = false;
            }, 200);
        },

        firstInviewCallback() {
            this.imgSrc = util.makeCacheUrl(this.src, 'img');
        }
    }
};
</script>

<style lang="less" scoped>
@import './src/styles/variable.less';

mip-img {
    .mip-img {
        display: inline-block;
        font-size: 0;
    }

    .mip-img-inner {
        position: relative;
        background: @placeholder-bg;
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
            transition: all ease .2s;
            opacity: 0;
            &.show {
                opacity: 1;
            }
        }
        img {
            position: absolute;
            transition: all linear .2s;
            max-width: 100%;
            max-height: 100%;
        }
        .mip-img-popup-innerimg {
            width: 100% !important;
            height: auto !important;
            top: 50% !important;
            left: 0 !important;
            transform: translate(0, -50%);
        }
    }
}
</style>
