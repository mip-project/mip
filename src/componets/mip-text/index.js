/**
 * @file index.js
 * @author huanghuiquan (huanghuiquan@baidu.com)
 */

let template = `
    <span>{{ text }}</span>
`;

export default {
    template,
    props: ['text']
};
