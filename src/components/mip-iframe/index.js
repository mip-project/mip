/**
 * @file index.js
 * @author mj(zoumiaojiang@gmail.com)
 */

let template = `
    <div class="mip-iframe"></div>
`;

export default {
    template,
    props: {
        src: String,
        width: [Number, String],
        height: [Number, String],
        allowfullscreen: [Boolean, String],
        srcdoc: [String],
        sanbox: [String],
        allowtransparency: [String]
    }
};
