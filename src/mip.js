/**
 * @file mip.js
 * @author mj(zoumiaojiang@gmail.com)
 */

import MIP from './platforms/web/entry-runtime-with-compiler';
import customElement from './custom-element/index';
import customElementBuildInComponents from './componets/index';

MIP.use(customElement);
MIP.use(customElementBuildInComponents);

export default MIP;
