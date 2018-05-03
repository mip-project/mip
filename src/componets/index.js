/**
 * @file index.js
 * @author huanghuiquan (huanghuiquan@baidu.com)
 */

import mipImg from './mip-img';
import mipIframe from './mip-iframe';
import mipVideo from './mip-video';
import mipCarousel from './mip-carousel';
import mipPix from './mip-pix';

function install(MIP) {
    MIP.customElement('mip-img', mipImg);
    MIP.customElement('mip-iframe', mipIframe);
    MIP.customElement('mip-pix', mipPix);
    MIP.customElement('mip-carousel', mipCarousel);
    MIP.customElement('mip-video', mipVideo);
    MIP.customElement('mip-template', {props: ['data']});
}

export default install;
