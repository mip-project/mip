/**
 * @file index.js
 * @author mj (zoumiaojiang@gmail.com)
 * @author zhangzhiqiang(zhiqiangzhang37@163.com)
 */
<template>
    <div class="mip-carousel">
        <div
            class="mip-carousel-wrapper"
            ref="carouselWrapper"
            @touchstart="ontouchstart"
            @touchmove="ontouchmove"
            @touchend="ontouchend"
            :style="{
                width: carouselWrapperWidth,
                transform: wrapperTransform,
                transitionDuration: transitionDuration
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
</template>

<script>

import resources from '../../custom-element/utils/resources';

const defaultDefer = 4000;
const defaultTransDuration = '.3s';
const defaultTransDurationMs = 300;
const activeItemClass = 'mip-carousel-activeitem';

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
    data() {
        return {
            imgIndex: 0,
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
        buttoncontroller: [String, Boolean]
    },

    computed: {

        carouselWrapperWidth() {
            return `${this.slideLen * 100}%`;
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

        // 预加载相邻的图片
        preloadImg() {
            let carouselList = this.$refs.carouselWrapper.children;
            let length = carouselList.length;

            let imgIndex = this.imgIndex;
            let curNodeIdx = imgIndex;
            let nextNodeIdx = imgIndex + 1 >= length ? 0 : imgIndex + 1;
            let preNodeIdx = imgIndex - 1 < 0 ? length - 1 : imgIndex - 1;

            // 预先加载当前和前一张和后一张图片
            resources.prerenderElement(carouselList[curNodeIdx]);
            resources.prerenderElement(carouselList[nextNodeIdx]);
            resources.prerenderElement(carouselList[preNodeIdx]);
        },

        // 初始化dom节点
        initEle() {
            // 没想到更好的办法来克隆节点
            let defaultSlot = this.$slots.default;
            let length = defaultSlot.length;
            let carouselWrapper = this.$refs.carouselWrapper;

            if (length <= 1) {
                return;
            }
            this.preloadImg();

            setTimeout(() => {
                carouselWrapper.appendChild(defaultSlot[0].elm.cloneNode(true));
                carouselWrapper.insertBefore(
                    defaultSlot[length - 1].elm.cloneNode(true),
                    carouselWrapper.firstChild
                );
                this.allWidth = carouselWrapper.offsetWidth;
                this.translateToIdx(1);
                this.imgIndex = 1;
        }, 20);

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
            this.preloadImg();
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
</script>

<style lang="less">
mip-carousel a {
    -webkit-tap-highlight-color: transparent;
}
.mip-carousel {
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
.mip-carousle-subtitle {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 25;
    color: #fff;
    line-height: 30px;
    padding-left: 10px;
}
.mip-carousel-indicator {
    position: absolute;
    z-index: 22;
    width: 30px;
    height: 30px;
    bottom: 0;
    right: 0;
    left: 0;
    text-align: right;
    margin: auto;
    width: 100%;
}
.mip-carousel-indicator > span {
    display: inline-block;
    width: 6px;
    height: 6px;
    background-color: #fff;
    border-radius: 50%;
    margin: 12px 6px 12px 0;
}
.mip-carousel-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.mip-carousel-wrapper {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    transition: transform ease .3s;
    &>* {
        position: relative;
        flex: 1;
        height: 100%;
        width: 0;
    }
}
.mip-carousel-slideBox {
    width: 100%;
    height: 100%;
    float: left;
    position: relative;
}
span.mip-carousel-current-indicator {
    background-color: #f00;
}
.mip-carousel-containeractive {
    z-index: 2
}
.mip-carousel-indicatorbox {
    position: absolute;
    bottom: 3px;
    right: 10px;
    color: #fff;
    text-shadow: 0 0 3px rgba(0, 0, 0, .8);
}
.mip-carousel-indicatornow {
    font-size: 20px;
}
.mip-carousel-preBtn,
.mip-carousel-nextBtn
 {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 10%;
    z-index: 10;
    background-size: 32px 32px;
    background-repeat: no-repeat;
    -webkit-user-select: none;
    user-select: none;
}

.mip-carousel-nextBtn {
    right: 0;
    background-position: 100% 45%;
    background-image: url(data:image/png;base64,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);
}
.mip-carousel-preBtn {
    left: 0;
    background-position: 0 45%;
    background-image: url(data:image/png;base64,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);
}
.mip-carousel-indicator-wrapper {
    text-align: center;
}
.mip-carousel-indicatorDot {
    display: inline-block;
    position: relative;
}
.mip-carousel-indicatorDot .mip-carousel-indecator-item {
    float: left;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #e1e1e1;
    margin-right: 7px;
}
.mip-carousel-indicatorDot .mip-carousel-activeitem {
    background-color: #999;
}
</style>
