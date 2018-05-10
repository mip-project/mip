/**
 * @file index.js
 * @author huanghuiquan (huanghuiquan@baidu.com)
 */

import mipImg from './mip-img';
import mipIframe from './mip-iframe';
import mipVideo from './mip-video';
import mipStore from './mip-store';
import mipCarousel from './mip-carousel';
import mipPix from './mip-pix';

function install(Vue) {
    Vue.__customElements__ = [
        {
            tag: 'mip-img',
            component: mipImg
        },
        {
            tag: 'mip-iframe',
            component: mipIframe
        },
        {
            tag: 'mip-pix',
            component: mipPix
        },
        {
            tag: 'mip-carousel',
            component: mipCarousel
        },
        {
            tag: 'mip-video',
            component: mipVideo
        },
        {
            tag: 'mip-store',
            component: mipStore
        },
        {
            tag: 'mip-template',
            component: {props: ['data']}
        }
    ];

    Vue.__customElements__.forEach(element => Vue.customElement(element.tag, element.component));
}

export default install;
