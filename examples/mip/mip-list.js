/**
 * @file mip-list demo
 * @author mj(zoumiaojiang@gmail.com)
 */

/* global mip */

mip.customElement('mip-list', {
    template: `
        <div class="mip-list-wrap">
            <div
                class="mip-tr"
                v-for="(item, index) in items"
                :key="index"
            >{{ renderItem(item) }}</div>
            <slot></slot>
        </div>
    `,
    props: ['items'],
    methods: {
        renderItem(item) {
            console.log(this.$el, item);
            // use mustache render data
        }
    }
});
