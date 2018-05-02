/**
 * @file mip-image
 * @author sfe
 */

/* global MIP */

MIP.customElement('mip-stats-baidu', {
    template: `
        <div>
            <slot></slot>
        </div>
    `,
    props: {
        src: String,
        alt: String
    }
});
