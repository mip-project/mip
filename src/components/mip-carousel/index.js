/**
 * @file index.js
 * @author mj (zoumiaojiang@gmail.com)
 * @author zhangzhiqiang(zhiqiangzhang37@163.com)
 */

const defaultDefer = 4000;
const defaultTransDuration = '.3s';
const defaultTransDurationMs = 300;
const activeItemClass = 'mip-carousel-activeitem';

let template = `
    <div
        class="mip-carousel"
        :style="{
            width: computedWidth
        }"
    >
        <div
            class="mip-carousel-wrapper"
            ref="carouselWrapper"
            @touchstart="ontouchstart"
            @touchmove="ontouchmove"
            @touchend="ontouchend"
            :style="{
                width: carouselWrapperWidth,
                transform: wrapperTransform,
                transitionDuration: transitionDuration,
                height: wrapperHeight,
                paddingBottom: computedHeightWidthRatio
            }"
        >
            <slot></slot>
        </div>
        <div v-if="showPageNum" class="mip-carousel-indicatorbox">
            <p class="mip-carousel-indicatorBoxwrap">
                <span class="mip-carousel-indicatornow">{{ imgIndex }}</span><span class="">/{{ realSlideLen }}</span>
            </p>
        </div>
        <template v-if="showBtn">
            <p class="mip-carousel-preBtn" @click="changePage(-1)"></p>
            <p class="mip-carousel-nextBtn" @click="changePage(1)"></p>
        </template>
        <slot name="indicator"></slot>
    </div>
`;

function hasAttr(attr) {
    return attr !== undefined;
}

// 移除class
function removeClass(dom, className) {
    if (!dom) {
        return;
    }
    let curClassName = dom.className;
    dom.className = curClassName.replace(className, '').replace(/(^\s*)|(\s*$)/g, '');
}

// 追加class
function addClass(dom, className) {
    if (!dom) {
        return;
    }
    let curClassName = dom.className;
    if (!curClassName) {
        dom.className = className;
    }
    else {
        dom.className = curClassName + ' ' + className;
    }
}

// changeIndicatorStyle
function changeIndicatorStyle(startDot, endDot) {
    removeClass(startDot, activeItemClass);
    addClass(endDot, activeItemClass);
}

export default {
    template,

    data() {
        return {
            imgIndex: 1,
            allWidth: 0,
            wrapperTransform: '',
            transitionDuration: '0s',
            dotItems: []
        };
    },

    props: {
        layout: {
            default() {
                return 'responsive';
            },
            type: String
        },
        width: [String, Number],
        height: [String, Number],
        autoplay: {
            default() {
                return true;
            },
            type: [String, Boolean]
        },
        defer: {
            type: [String, Number],
            default() {
                return defaultDefer;
            }
        },
        indicator: [String, Boolean],
        indicatorid: String,
        buttoncontroller: [String, Boolean],
        // 高/宽比例，用于占位，如宽50px，高100px，heightWidthRatio就是50/100=50%
        heightWidthRatio: String
    },

    computed: {
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

        carouselWrapperWidth() {
            return `${this.slideLen * 100}%`;
        },

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

        realSlideLen() {
            return this.$slots.default.length;
        },

        slideLen() {
            return this.realSlideLen + 2;
        },

        isAutoPlay() {
            return hasAttr(this.autoplay);
        },

        showPageNum() {
            return hasAttr(this.indicator);
        },

        showBtn() {
            return hasAttr(this.buttoncontroller);
        },

        realDefer() {
            let interval = parseInt(this.defer, 10);
            return isNaN(interval) ? defaultDefer : interval;
        }
    },

    mounted() {

        this.initEle();
        this.isAutoPlay && this.autoPlay();

        // 支持mip1的给id，也支持slot="indicator"
        if (this.indicatorid || this.$slots.indicator) {
            this.indicatorDot(this.indicatorid);
        }

    },

    methods: {
        // 初始化dom节点
        initEle() {
            // 没想到更好的办法来克隆节点
            let defaultSlot = this.$slots.default;
            let length = defaultSlot.length;
            let carouselWrapper = this.$refs.carouselWrapper;

            if (length <= 1) {
                return;
            }

            carouselWrapper.appendChild(defaultSlot[0].elm.cloneNode(true));
            carouselWrapper.insertBefore(
                defaultSlot[length - 1].elm.cloneNode(true),
                carouselWrapper.firstChild
            );
            this.allWidth = carouselWrapper.offsetWidth;
            this.translateToIdx(1);

        },

        // 处理圆点型指示器
        indicatorDot(domId) {
            let me = this;
            let indicDom = document.getElementById(domId) || this.$slots.indicator[0].elm;
            if (!indicDom) {
                return;
            }

            this.dotItems = indicDom.children;
            let dotItems = this.dotItems;
            let dotLen = dotItems.length;

            if (dotLen === this.slideLen - 2) {
                for (let i = 0; i < dotLen; i++) {
                    dotItems[i].count = i;
                    dotItems[i].addEventListener('click', function (event) {
                        let count = this.count;
                        clearInterval(me.moveInterval);
                        me.move(me.imgIndex, count + 1, true);
                        if (me.isAutoPlay) {
                            me.autoPlay();
                        }
                    });
                }
            }
            else {
                // 若个数不匹配，则隐藏掉indicator
                addClass(indicDom, 'hide');
                this.dotItems = [];
            }
        },

        changePage(change) {

            if (this.btnLock) {
                return;
            }

            clearInterval(this.moveInterval);
            this.move(this.imgIndex, this.imgIndex + change);
            if (this.isAutoPlay) {
                this.autoPlay();
            }

        },

        autoPlay() {
            // 自动轮播
            this.moveInterval = setInterval(() => {
                this.move(this.imgIndex, this.imgIndex + 1);
            }, this.realDefer);
        },

        translateToIdx(idx, anim) {
            this.translateTo(idx / this.slideLen * 100, anim);
        },

        /**
         * 将carousel移动到某个位置
         *
         * @param  {number} pos   位置值
         * @param  {boolean} anim 是否做动画
         * @param  {duration?} duration 动画持续时间
         */
        translateTo(pos, anim, duration) {
            this.wrapperTransform = `translate(-${pos}%)`;
            if (anim) {
                this.transitionDuration = duration || defaultTransDuration;
            }
            else {
                this.transitionDuration = '0s';
            }
        },

        // 滚动之后在特殊节点需要重置位置
        resetPosAndIdx() {

            let {imgIndex, slideLen} = this;
            let resetToIndex;

            if (imgIndex === slideLen - 1) {
                resetToIndex = 1;
            }
            else if (imgIndex === 0) {
                // if it is last one
                resetToIndex = slideLen - 2;
            }

            // 如果切换了坐标，需要在动画结束后重置translatex位置
            if (resetToIndex) {
                this.imgIndex = resetToIndex;
                setTimeout(() => {
                    this.translateToIdx(resetToIndex);
                }, defaultTransDurationMs);
            }

            return resetToIndex || imgIndex;
        },

        // 图片滑动处理与手势滑动函数endPosition为最终距离，duration变换时间
        move(startIdx, endIdx, duration) {

            let dotItems = this.dotItems;
            this.imgIndex = endIdx;
            this.translateToIdx(endIdx, true);
            // resetPosAndIdx
            endIdx = this.resetPosAndIdx();

            // 如果有指示器，需更新选中位置的样式
            if (dotItems.length > 0) {
                changeIndicatorStyle(dotItems[startIdx - 1], dotItems[endIdx - 1]);
            }

            this.btnLock = true;
            setTimeout(() => {
                this.btnLock = false;
            }, defaultTransDurationMs);
        },

        ontouchstart(event) {
            let touch = event.targetTouches[0];
            this.startPos = {
                x: touch.pageX,
                y: touch.pageY
            };
            this.isScrolling = false; // 这个参数判断是垂直滚动还是水平滚动

            // 获取手势点击位置
            this.prvGestureClientx = touch.pageX;
            clearInterval(this.moveInterval);
        },

        ontouchmove(event) {
            // 阻止触摸事件的默认行为，即阻止滚屏
            let touch = event.targetTouches[0];
            let endPos = {
                x: touch.pageX - this.startPos.x,
                y: touch.pageY - this.startPos.y
            };

            this.isScrolling = Math.abs(endPos.x) < Math.abs(endPos.y);

            if (this.isScrolling) {
                event.preventDefault();
            }

            // 获取手指移动的距离
            this.diffNum = event.targetTouches[0].pageX - this.prvGestureClientx;

            // 外框同步运动
            this.translateTo((this.imgIndex / this.slideLen - this.diffNum / this.allWidth) * 100);

            // 滚动手势锁 正在滑动
            this.slideLock = true;
        },

        ontouchend(event) {
            //  只有滑动之后才会触发
            if (this.slideLock) {
                let startIdx = this.imgIndex;
                let endIdx = startIdx;
                // 如果大于设定阈值
                if (Math.abs(this.diffNum) > this.allWidth / this.slideLen * 0.2) {
                    endIdx = (this.diffNum > 0) ? startIdx - 1 : startIdx + 1;
                }
                this.move(startIdx, endIdx);
                this.slideLock = false;
            }

            // 如果存在自动则调用自动轮播
            if (this.isAutoPlay) {
                clearInterval(this.moveInterval);
                this.autoPlay();
            }
        }
    }
};
