/**
 * @file index.js
 * @author huanghuiquan (huanghuiquan@baidu.com)
 */

import mipImg from './mip-img/MipImg.vue';
import mipIframe from './mip-iframe/MipIframe.vue';
import mipVideo from './mip-video/MipVideo.vue';
import mipStore from './mip-store';
import mipCarousel from './mip-carousel/MipCarousel.vue';
import mipPix from './mip-pix';
import mipData from './mip-bind';
import mipLink from './mip-link';

function install(Vue) {
    Vue.__customElements__ = [
        {
            tag: 'mip-link',
            component: mipLink
        },
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
        },
        {
            tag: 'mip-data',
            component: mipData
        }
    ];

    Vue.__customElements__.forEach(element => Vue.customElement(element.tag, element.component));
}

export default install;
