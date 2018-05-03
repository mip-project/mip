/**
 * @file mip-image
 * @author sfe
 */

/* global MIP */

export default {
    template: `
        <div class="image-from-mip-component" :style="{
            width: width + 'px',
            height: height + 'px',
            display: 'inline-block'
        }">
            <img :src="src" :alt="alt" width="100%" height="100%"/>
        </div>
    `,
    props: {
        src: String,
        alt: String,
        width: [Number, String],
        height: [Number, String],
        popup: [Boolean, String]
    },

    created() {
        console.log(this.src, this.el);
    }
};
