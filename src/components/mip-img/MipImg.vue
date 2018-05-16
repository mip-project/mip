/**
 * @file mip-img
 * @author mj(zoumiaojiang@gmail.com)
 * @author zhangzhiqiang37(zhiqiangzhang37@163.com)
 */

<template>
    <div class="mip-img" :style="{width: computedWidth}">
        <div class="mip-img-inner"
            :style="{
                paddingBottom: computedHeightWidthRatio
            }"
        >
            <img
                :width="imgWidth"
                :src="imgSrc"
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
                :src="imgSrc"
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
    name: 'mip-img',
    data() {
        return {
            showPopup: false,
            popupImgWidth: '',
            popupImgTop: '',
            popupImgLeft: '',
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
        computedWidth() {
            // 宽度支持写百分比等，纯数字认为是像素单位
            let width = this.width;
            return /^\d+$/.test(width) ? `${width}px` : width;
        },
        imgWidth() {
            if (this.width) {
                return '100%';
            }
        },
        computedHeight() {
            // 宽度支持写百分比等，纯数字认为是像素单位
            let height = this.height;
            return /^\d+$/.test(height) ? `${height}px` : height;
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
        popupShow() {
            if (!this.popupVal) {
                return;
            }
            let img = this.$refs.img;
            // 图片未加载则不弹层
            if (!img.naturalWidth) {
                return;
            }
            let {left, top, width} = img.getBoundingClientRect();
            this.showPopup = true;
            this.popupImgLeft = `${left}px`;
            this.popupImgTop = `${top}px`;
            this.popupImgWidth = `${width}px`;
            setTimeout(() => {
                this.placeImg = true;
            }, 16);
        },
        hidePopup() {
            this.placeImg = false;
            setTimeout(() => {
                this.showPopup = false;
            }, 200);
        }
    },
    firstInviewCallback() {
        let vm = this.vm;
        this.applyFillContent(vm.$el, true);
        vm.loaded = true;
    }
};


</script>

<style lang="less" scoped>
@import '../../styles/variable.less';
mip-img {
    .mip-img {
        display: inline-block;
        font-size: 0;
    }
    .mip-img-inner {
        position: relative;
        background: @placeholder-bg;

        img {
            width: 100%;
            height: 100%;
        }
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