<template>
    <div :id="CONTAINER_ID">
        <app-header
            ref="appHeader"
            :title="MIPRouterTitle"
            :icon="MIPRouterIcon"
            @click-back="onClickHeaderBack">
        </app-header>
        <div v-show="showLoading" class="mip-appshell-router-view-mask">
            <loading size="50" indeterminate></loading>
        </div>
        <transition
            :name="pageTransitionEffect"
            @before-enter="onBeforeEnter"
            @after-enter="onAfterEnter"
            @before-leave="onBeforeLeave">
            <mip-view
                :class="['mip-appshell-router-view', pageTransitionClass]"
                :key="routerViewKey"
                :data-page-id="$route.fullPath">
            </mip-view>
        </transition>
    </div>
</template>

<script>
import AppHeader from './AppHeader.vue';
import Loading from './Loading.vue';
import * as constants from '../const';
import {restoreContainerScrollPosition, restoreBodyScrollPosition} from '../util';
import Store from '../../vuex/index';

const CONTAINER_ID = constants.MIP_CONTAINER_ID;

export default {
    components: {
        'app-header': AppHeader,
        'loading': Loading
    },
    computed: {
        pageTransitionClass() {
            return `transition-${this.pageTransitionType}`;
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
            CONTAINER_ID,
            MIPRouterTitle: '',
            MIPRouterIcon: undefined,
            scrollPostionMap: {},
            pageTransitionType: 'fade',
            pageTransitionEffect: 'fade',
            showLoading: true
        }
    },
    mounted() {
        document.documentElement.setAttribute('mip-ready', '');
        setTimeout(() => {
            this.showLoading = false;
        }, 500);
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
            restoreContainerScrollPosition(el, scrollTop);
            this.scrollPostionMap = Object.assign(this.scrollPostionMap, {
                [pageId]: {y: scrollTop}
            });
        }
    }
}
</script>

<style lang="less">
@appshell-header-height: 44px;

[mip] {
    display: none;
}
[mip-ready] {
    display: block;
}
[mip-cloak] {
    display: none !important;
}

.mip-appshell-router-view {
    position: absolute;
    top: @appshell-header-height;
    right: 0;
    bottom: 0;
    left: 0;
    -webkit-overflow-scrolling: touch;
    background: white;

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
        transition: transform 0.35s cubic-bezier(0, 0, 0.2, 1);
        &.slide-left-enter {
            transform: translate(100%, 0);
        }
        &.slide-left-enter-active {
            box-shadow: 0 16px 16px 2px rgba(0, 0, 0, 0.3);
        }
        &.slide-right-enter {
            transform: translate(-30%, 0);
            transition-timing-function: linear;
        }
        &.slide-right-leave-active {
            transform: translate(100%, 0);
            box-shadow: 0 16px 16px 2px rgba(0, 0, 0, 0.3);
            z-index: 99;
        }
        &.slide-left-leave-active {
            transform: translate(-30%, 0);
            transition-timing-function: linear;
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
