import * as constants from './const';
import {restoreContainerScrollPosition, restoreBodyScrollPosition} from './util';
import AppHeader from './vue-components/app-header';

const CONTAINER_ID = constants.MIP_CONTAINER_ID;

export default function createAppShell({Vue, router, store}) {
    new Vue({
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
                Vue.nextTick(() => {
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
