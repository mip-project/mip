/**
 * @file index.js
 * @author mj(zoumiaojiang@gmail.com)
 */

let template = `
    <span>{{ text }}</span>
`;

export default {
    template,
    props: ['text']
};
