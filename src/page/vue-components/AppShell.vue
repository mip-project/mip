<template>
    <div :id="MIP_CONTAINER_ID">
        <app-header
            v-show="!header.hidden"
            :title="header.title"
            :logo="header.logo"
            :showBackIcon="!view.isIndex"
            :buttonGroup="header.buttonGroup"
            @appheader::click-back="onClickHeaderBack">
        </app-header>
        <div v-show="showLoading" class="mip-appshell-router-view-mask">
            <loading size="50" indeterminate></loading>
        </div>
        <transition
            :name="view.transition.effect"
            @before-enter="onBeforeEnter"
            @after-enter="onAfterEnter"
            @before-leave="onBeforeLeave">
            <mip-view
                :class="routerViewClass"
                :key="routerViewKey"
                :data-page-id="$route.fullPath">
            </mip-view>
        </transition>
    </div>
</template>

<script>
import AppHeader from './AppHeader.vue';
import Loading from './Loading.vue';
import {restoreContainerScrollPosition, restoreBodyScrollPosition} from '../util';
import Store from '../../vuex/index';
import {MIP_CONTAINER_ID, DEFAULT_SHELL_CONFIG} from '../const';

export default {
    components: {
        'app-header': AppHeader,
        'loading': Loading
    },
    computed: {
        routerViewClass() {
            return {
                'mip-appshell-router-view': true,
                'mip-appshell-router-view-with-header': !this.header.hidden,
                [`transition-${this.view.transition.mode}`]: true
            };
        },
        routerViewKey() {
            let {name, params} = this.$route;
            let paramKeys = Object.keys(params);
            if (paramKeys.length) {
                return name + paramKeys.reduce((prev, cur) => prev + params[cur], '');
            }
            return null;
        }
    },
    data() {
        return {
            ...DEFAULT_SHELL_CONFIG,
            MIP_CONTAINER_ID,
            scrollPostionMap: {},
            showLoading: true
        }
    },
    mounted() {
        document.documentElement.setAttribute('mip-ready', '');
        setTimeout(() => {
            this.showLoading = false;
        }, 320);
    },
    methods: {
        onClickHeaderBack() {
            this.$router.go(-1);
        },
        onBeforeEnter(el) {
            let pageId = el.dataset.pageId;
            let {y: scrollTop = 0} = this.scrollPostionMap[pageId] || {};
            setTimeout(() => {
                restoreContainerScrollPosition(el, scrollTop);
            }, 0);
        },
        onAfterEnter(el) {
            let pageId = el.dataset.pageId;
            let {y: scrollTop = 0} = this.scrollPostionMap[pageId] || {};
            restoreBodyScrollPosition(el, scrollTop);
        },
        onBeforeLeave(el) {
            let pageId = el.dataset.pageId;
            let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            setTimeout(() => {
                restoreContainerScrollPosition(el, scrollTop);
            }, 0);
            this.scrollPostionMap = Object.assign(this.scrollPostionMap, {
                [pageId]: {y: scrollTop}
            });
        }
    }
}
</script>

<style lang="less">
@import '../../styles/mip.less';

@page-transition-duration: 5.35s;

[mip-ready] {
    display: block;
}
[mip-cloak] {
    display: none !important;
}

.mip-appshell-router-view {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    -webkit-overflow-scrolling: touch;
    background: white;
    width: 100%;

    &.mip-appshell-router-view-with-header {
        top: @appshell-header-height;
    }

    &::-webkit-scrollbar {
        width: 0;
        background: transparent;
    }

    &.transition-fade {
        opacity: 1;
        transition: opacity 1s ease;
        &.fade-enter {
            opacity: 0;
        }
        &.fade-leave-active {
            opacity: 0;
        }
    }

    &.transition-slide {
        &.slide-left-enter {
            transform: translate(100%, 0);
        }
        &.slide-left-enter-active {
            transition: transform @page-transition-duration cubic-bezier(0, 0, 0.2, 1);
            box-shadow: 0 16px 16px 2px rgba(0, 0, 0, 0.3);
        }
        &.slide-left-enter-to,
        &.slide-left-leave {
            transform: translate(0, 0);
        }
        &.slide-left-leave-active {
            transition: transform @page-transition-duration linear;
        }
        &.slide-left-leave-to {
            transform: translate(-30%, 0);
        }

        &.slide-right-enter {
            transform: translate(-30%, 0);
        }
        &.slide-right-enter-active {
            transition: transform @page-transition-duration linear;
        }
        &.slide-right-enter-to,
        &.slide-right-leave {
            transform: translate(0, 0);
        }
        &.slide-right-leave-active {
            transition: transform @page-transition-duration cubic-bezier(0, 0, 0.2, 1);
            box-shadow: 0 16px 16px 2px rgba(0, 0, 0, 0.3);
            z-index: 99999;
        }
        &.slide-right-leave-to {
            transform: translate(100%, 0);
        }
        &.mip-appshell-router-view-scroll-enabled,
        &.slide-left-enter-active,
        &.slide-left-leave-active,
        &.slide-right-enter-active,
        &.slide-right-leave-active {
            overflow-y: auto;
        }
    }
}

.mip-appshell-router-view-mask {
    position: absolute;
    top: @appshell-header-height;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    z-index: 10;
    touch-action: none;
}
</style>
