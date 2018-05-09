/**
 * @file index.js
 * @author mj (zoumiaojiang@gmail.com)
 */

let template = `
    <div class="mip-carousel">
        <slot></slot>
    </div>
`;

export default {
    template,
    props: {
        layout: {
            default() {
                return 'responsive';
            },
            type: String
        },
        width: [String, Number],
        height: [String, Number],
        autoplay: {
            default() {
                return '';
            },
            type: String
        },
        defer: [String, Number],
        indicator: [String, Boolean],
        indicatorId: String,
        buttonController: [String, Boolean]
    },

    methods: {

    },

    created() {}
};
