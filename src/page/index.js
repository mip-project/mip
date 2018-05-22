/**
 * @file main entry
 * @author wangyisheng@baidu.com (wangyisheng)
 */

import * as util from './util';
import '../styles/mip.less';
// import * as constants from './const';
// import AppShell from './vue-components/AppShell.vue';

// const CONTAINER_ID = constants.MIP_CONTAINER_ID;

function start() {
    // Don't let browser restore scroll position.
    if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
    }

    // let {MIPContent, scope} = util.getMIPContent();
    // Create mip container
    // let $container = util.createIFrame('https://lavas.baidu.com');

    // let doc;
    // if ($container.contentDocument) {
    //     doc = $container.contentDocument;
    // } else {
    //     doc = $container.contentWindow.document;
    // }
    // console.log(doc)
    // // doc.body.innerHTML = MIPContent;
    // doc.body.innerHTML = 'Hello everyone!';

    // TODO <a mip>
    // util.installMipLink(router);

    document.body.setAttribute('mip-ready', '');
};

export default {start};
