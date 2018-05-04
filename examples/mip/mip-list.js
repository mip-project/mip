/**
 * @file mip-list demo
 * @author mj(zoumiaojiang@gmail.com)
 */

/* global MIP */

MIP.customElement('mip-list', {
    template: `
        <div class="mip-list-wrap">
            <slot></slot>
        </div>
    `,
    props: ['items']
});
