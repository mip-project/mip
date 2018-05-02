/**
 * @file index.js
 * @author huanghuiquan (huanghuiquan@baidu.com)
 */

import mipImg from './mip-img';
import mipText from './mip-text';

export default function (MIP) {
    MIP.customElement('mip-img-buildin', mipImg);
    MIP.customElement('mip-text-buildin', mipText);
}
