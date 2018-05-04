/**
 * @file mip-list demo
 * @author mj(zoumiaojiang@gmail.com)
 */

/* global MIP */

MIP.mip.customElement('mip-list', {
    template: `
        <div class="mip-list-wrap">
            <slot></slot>
        </div>
    `,
    props: ['items']
});
