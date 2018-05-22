import event from '../../util/dom/event';

import {CURRENT_PAGE_ID} from '../index';

function guardEvent(e, $a) {
    // don't redirect with control keys
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) {
        return;
    }
    // don't redirect when preventDefault called
    // if (e.defaultPrevented) {
    //     return;
    // }
    // don't redirect if `target="_blank"`
    if ($a.getAttribute) {
        const target = $a.getAttribute('target');
        if (/\b_blank\b/i.test(target)) {
            return;
        }
    }
    e.preventDefault();
    return true;
}

export function installMipLink(router) {
    event.delegate(document, 'a', 'click', function (e) {
        let $a = e.target;
        if ($a.hasAttribute('mip-link')) {
            let to = $a.getAttribute('href');
            if (guardEvent(e, $a)) {
                const location = router.resolve(to, router.currentRoute, false).location;
                if ($a.hasAttribute('replace')) {
                    if (router.ROOT_PAGE_ID === CURRENT_PAGE_ID) {
                        router.replace(location);
                    }
                    else {
                        parent.postMessage({
                            type: 'router-replace',
                            data: {
                                location
                            }
                        }, window.location.origin);
                    }
                }
                else {
                    if (router.ROOT_PAGE_ID === CURRENT_PAGE_ID) {
                        router.push(location);
                    }
                    else {
                        parent.postMessage({
                            type: 'router-push',
                            data: {
                                location
                            }
                        }, window.location.origin);
                    }
                }
            }
        }
    });
}
