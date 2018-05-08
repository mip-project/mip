/**
 * @file mip-img
 * @author mj(zoumiaojiang@gmail.com)
 * @author zhangzhiqiang37(zhiqiangzhang37@163.com)
 */

function getScrollInfo() {
    return {
        scrollTop: document.body.scrollTop || document.documentElement.scrollTop,
        scrollLeft: document.body.scrollLeft || document.documentElement.scrollLeft
    }
}

function getOffset(ele) {
    let top = 0;
    let left = 0;
    let {scrollLeft, scrollTop} = getScrollInfo();

    while (ele.offsetParent) {
        top += ele.offsetTop;
        left += ele.offsetLeft;
        ele = ele.offsetParent;
    }

    return {
        top: top - scrollTop,
        left: left - scrollLeft
    }
}

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
                    :src="src"
                    :usemap="usemap"
                    :title="title"
                    :sizes="sizes"
                    :ismap="ismap"
                    :alt="alt"
                    :srcset="srcset"
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
                    :src="src"
                    :sizes="sizes"
                    :srcset="srcset"
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
        }
    },

    mounted() {

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

            let {left, top} = getOffset(img);
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
