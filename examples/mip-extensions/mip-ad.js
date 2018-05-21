/**
 * @file mip-image
 * @author sfe
 */

/* global mip */

mip.customElement('mip-ad', {
    template: `
        <div>
            <slot></slot>
        </div>
    `,
    props: {
        name: String
    }
});
