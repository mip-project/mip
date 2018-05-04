/**
 * @file demo mip-hello component
 * @author wangyisheng@baidu.com (wangyisheng)
 */

/* global MIP */
MIP.customElement('mip-hello', {
    template: '<h2>{{text}}</h2>',
    props: ['text']
});
