import * as constants from './const';
import {restoreContainerScrollPosition, restoreBodyScrollPosition} from './util';

const CONTAINER_ID = constants.MIP_CONTAINER_ID;

const AppHeader = {
    template: `
        <div class="mip-appshell-header">
            <svg @click="onClick('back')" class="mip-appshell-header-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1076" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs></defs><path d="M263.570286 530.285714l261.376 261.339429a18.285714 18.285714 0 0 1-25.892572 25.892571l-292.571428-292.571428a18.285714 18.285714 0 0 1 0-25.892572l292.571428-292.571428a18.285714 18.285714 0 0 1 25.892572 25.892571L263.570286 493.714286H804.571429a18.285714 18.285714 0 1 1 0 36.571428H263.570286z" p-id="1077"></path></svg>
            {{title}}
        </div>
    `,
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    methods: {
        onClick(source) {
            this.$emit(`click-${source}`);
        }
    }
};

export default function createAppShell({VueConstructor, router, store}) {
    new VueConstructor({
        components: {
            'app-header': AppHeader
        },
        router,
        store,
        el: `#${CONTAINER_ID}`,
        template: `
            <div id="${CONTAINER_ID}">
                <app-header
                    :title="MIPRouterTitle"
                    @click-back="onClickHeaderBack">
                </app-header>
                <transition
                    :name="pageTransitionEffect"
                    @before-enter="onBeforeEnter"
                    @after-enter="onAfterEnter"
                    @before-leave="onBeforeLeave">
                    <mip-view
                        :class="[pageTransitionClass]"
                        :key="routerViewKey"
                        :data-page-id="$route.fullPath">
                    </mip-view>
                </transition>
            </div>
        `,
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
                MIPRouterTitle: '',
                scrollPostionMap: {},
                pageTransitionType: 'fade',
                pageTransitionEffect: 'fade'
            }
        },
        methods: {
            onClickHeaderBack() {
                this.$router.go(-1);
            },
            onBeforeEnter(el) {
                let pageId = el.dataset.pageId;
                let {y: scrollTop = 0} = this.scrollPostionMap[pageId] || {};
                VueConstructor.nextTick(() => {
                    restoreContainerScrollPosition(el, scrollTop);
                });
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
    });
}
