/**
 * @file index.js
 * @author huanghuiquan (huanghuiquan@baidu.com)
 */

let template = `
    <img :src="src">
`;

export default {
    template,
    props: ['src']
};
