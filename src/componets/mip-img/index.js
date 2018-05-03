/**
 * @file mip-img
 * @author mj(zoumiaojiang@gmail.com)
 */

export default {
    template: `
        <div
            class="image-from-mip-component"
            :style="{
                width: width + 'px',
                height: height + 'px',
                display: 'inline-block'
            }"
        >
            <img :src="src" :alt="alt" width="100%" height="100%"/>
        </div>
    `,
    props: {
        layout: {
            default() {
                return 'responsive';
            },
            type: String
        },
        src: String,
        alt: String,
        title: String,
        usemap: String,
        sizes: String,
        ismap: String,
        width: [Number, String],
        height: [Number, String],
        popup: [Boolean, String]
    },

    mounted() {
    }
};
