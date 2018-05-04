/**
 * @file mip-image
 * @author sfe
 */

/* global mip */

mip.customElement('mip-stats-baidu', {
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
