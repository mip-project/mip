/**
 * @file index.js
 * @author mj(zoumiaojiang@gmail.com)
 */

let template = `
    <div
        v-if="ifsrc && height"
        class="mip-element mip-layout-fixed mip-layout-size-defined"
        :allowfullscreen="allowfullscreen"
        :sanbox="sanbox"
        :allowtransparency="allowtransparency"
        :style="{
            width: width + 'px',
            height: height + 'px'
        }"
    >
        <iframe
            frameBorder="0"
            scrolling="no"
            :src="ifsrc"
        ></iframe>
    </div>
`;

export default {
    template,
    props: {
        src: String,
        width: {
            default() {
                return '100%';
            },
            type: [Number, String]
        },
        height: [Number, String],
        srcdoc: [String],
        sanbox: [String],
        allowfullscreen: {
            default() {
                return false;
            },
            type: [Boolean, String]
        },
        allowtransparency: [Boolean, String]
    },

    computed: {
        ifsrc() {
            if (this.srcdoc) {
                return 'data:text/html;charset=utf-8;base64,' + window.btoa(this.srcdoc);
            }
            return this.src;
        }
    }
};
