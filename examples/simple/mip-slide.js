/**
 * @file mip-slide
 * @author sfe
 */

/* global MIP */

MIP.customElement('mip-slide', {
    template: `
        <div>
            <transition name="fade">
                <p v-show="show">----- :) ------</p>
            </transition>
            <button v-on:click="show = !show">
                click me
            </button>
            <slot></slot>
        </div>
    `,
    data() {
        return {
            show: true
        };
    }
});
