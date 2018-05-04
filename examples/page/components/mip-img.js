/**
 * @file mip-image
 * @author sfe
 */

/* global MIP */

MIP.customElement('mip-img', {
    template: `
        <div class="image-from-mip-component" :style="{
            width: width + 'px',
            height: height + 'px',
            display: 'inline-block'
        }">
            <img :src="src" :alt="alt" style="width: 100%"/>
        </div>
    `,
    props: {
        src: String,
        alt: String,
        width: [Number, String],
        height: [Number, String],
        popup: [Boolean, String]
    }
});
