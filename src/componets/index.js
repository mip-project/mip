/**
 * @file index.js
 * @author huanghuiquan (huanghuiquan@baidu.com)
 */

import mipImg from './mip-img';
import mipText from './mip-text';
import mipTemplate from './mip-template';

export default function register(MIP) {
    MIP.customElement('mip-img-buildin', mipImg);
    MIP.customElement('mip-text-buildin', mipText);
    MIP.customElement('mip-template', mipTemplate);
}
