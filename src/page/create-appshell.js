import * as constants from './const';

const CONTAINER_ID = constants.MIP_CONTAINER_ID;
const template = `
<div id="${CONTAINER_ID}">
    <header id="mip-router__header">{{MIPRouterTitle}}</header>
    <transition
        name="fade"
        @before-enter="onBeforeEnter"
        @after-enter="onAfterEnter"
        @before-leave="onBeforeLeave">
        <mip-view></mip-view>
    </transition>
</div>`;

export default function createAppShell({VueConstructor, router}) {
    new VueConstructor({
        router,
        el: `#${CONTAINER_ID}`,
        template,
        data() {
            return {
                MIPRouterTitle: ''
            }
        },
        methods: {
            onBeforeEnter(el) {},
            onAfterEnter(el) {},
            onBeforeLeave(el) {}
        }
    });
}
