import event from '../../util/dom/event';

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

export function installMipLink(router, {isRootPage, postMessage}) {
    event.delegate(document, 'a', 'click', function (e) {
        let $a = this;
        if ($a.hasAttribute('mip-link') || $a.getAttribute('data-type') === 'mip') {
            let to = $a.getAttribute('href');
            const location = router.resolve(to, router.currentRoute, false).location;
            if (guardEvent(e, $a)) {
                if ($a.hasAttribute('replace')) {
                    if (isRootPage) {
                        router.replace(location);
                    }
                    else {
                        postMessage({
                            type: 'router-replace',
                            data: {location}
                        });
                    }
                }
                else {
                    if (isRootPage) {
                        router.push(location);
                    }
                    else {
                        postMessage({
                            type: 'router-push',
                            data: {location}
                        });
                    }
                }
            }
        }
        else {
            postMessage({
                type: 'router-force',
                data: {location: to}
            })
        }
    });
}
