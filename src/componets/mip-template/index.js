/**
 * @file index.js
 * @author mj(zoumiaojiang@gmail.com)
 */

let template = `
    <div class="mip-template-wrap">
        hello, {{ name }}, {{ age }}, {{ obj.name }}
        <slot></slot>
    </div>
`;

export default {
    template,

    props: ['name', 'age', 'obj'],

    created() {
        console.log('-------', this.name);
    }
};
