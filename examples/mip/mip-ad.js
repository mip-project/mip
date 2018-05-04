/**
 * @file mip-image
 * @author sfe
 */

/* global MIP */

MIP.customElement('mip-ad', {
    template: `
        <div>
            <slot></slot>
        </div>
    `,
    props: {
        name: String
    }
});
