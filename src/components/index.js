/**
 * @file index.js
 * @author huanghuiquan (huanghuiquan@baidu.com)
 */

import mipImg from './mip-img';

export default function register(MIP) {
    MIP.customElement('mip-img', mipImg);
}
