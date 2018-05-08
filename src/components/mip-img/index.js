/**
 * @file mip-img
 * @author mj(zoumiaojiang@gmail.com)
 * @author zhangzhiqiang37(zhiqiangzhang37@163.com)
 */

import util from '../../util';

export default {
    template: `
        <div
            class="image-from-mip-component"
            :style="{
                width: computedWidth,
            }"
        >
            <div
                class="image-from-mip-component-inner"
                :style="{
                    height: wrapperHeight,
                    paddingBottom: computedHeightWidthRatio
                }"
            >
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
                    :style="{
                        width: computedWidth,
                        height: computedHeight
                    }"
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
                        width: computedWidth,
                        height: computedHeight,
                        top: popupImgTop,
                        left: popupImgLeft
                    }"

                />
            </div>
        </div>
    `,

    data() {
        return {
            showPopup: false,
            popupImgTop: '',
            popupImgLeft: '',
            placeImg: false
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

        computedWidth() {
            // 宽度支持写百分比等，纯数字认为是像素单位
            let width = this.width;
            return /^\d+$/.test(width) ? `${width}px` : width;
        },

        computedHeight() {
            // 宽度支持写百分比等，纯数字认为是像素单位
            let height = this.height;
            return /^\d+$/.test(height) ? `${height}px` : height;
        },

        popupVal() {
            return this.popup !== undefined;
        },

        imgSrc() {
            return util.makeCacheUrl(this.src, 'img');
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

            let {left, top} = img.getBoundingClientRect();
            this.showPopup = true;
            this.popupImgLeft = `${left}px`;
            this.popupImgTop = `${top}px`;

            setTimeout(() => {
                this.placeImg = true;
            }, 5);

        },

        hidePopup() {
            this.placeImg = false;
            setTimeout(() => {
                this.showPopup = false;
            }, 300);
        }
    }
};
