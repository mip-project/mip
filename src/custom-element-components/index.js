/**
 * @file index.js Builtins register
 * @author zhangzhiqiang(zhiqiangzhang37@163.com)
 */

import registerEle from '../mip1-polyfill/element';
import MipImg from './mip-img';
import MipVideo from './mip-video';
import MipCarousel from './mip-carousel';
import MipIframe from './mip-iframe';
import MipPix from './mip-pix';
import MipData from './mip-bind/mip-data';

export default {

    /**
     * Register the builtin components.
     */
    register() {
        registerEle('mip-pix', MipPix);
        registerEle('mip-img', MipImg);
        registerEle('mip-carousel', MipCarousel);
        registerEle('mip-iframe', MipIframe);
        registerEle('mip-video', MipVideo);
        registerEle('mip-data', MipData);
    }
};
