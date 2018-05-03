/**
 * @file index.js
 * @author huanghuiquan (huanghuiquan@baidu.com)
 */

import mipImg from './mip-img';
import mipText from './mip-text';
import mipTemplate from './mip-template';

function install(MIP) {
    MIP.customElement('mip-img', mipImg);
    MIP.customElement('mip-text', mipText);
    MIP.customElement('mip-template', mipTemplate);
}

export default install;
