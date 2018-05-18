/**
 * @file index.js
 * @author huanghuiquan (huanghuiquan@baidu.com)
 */

import mipImg from './mip-img/MipImg.vue';
import mipIframe from './mip-iframe/MipIframe.vue';
import mipVideo from './mip-video/MipVideo.vue';
import mipCarousel from './mip-carousel/MipCarousel.vue';
import mipPix from './mip-pix/MipPix.vue';
import mipData from './mip-bind';

function install(Vue) {
    [
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
            tag: 'mip-template',
            component: {props: ['data']}
        },
        {
            tag: 'mip-data',
            component: mipData
        }
    ].forEach(element => {
        Vue.customElement(element.tag, element.component);
    });
}

export default install;
