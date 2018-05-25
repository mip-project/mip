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
        let $a = e.target;
        if ($a.hasAttribute('mip') || ($a.dataset && $a.dataset.type === 'mip')) {
            let to = $a.getAttribute('href');
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
                data: {location}
            })
        }
    });
}
