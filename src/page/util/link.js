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

export function installMipLink(router) {
    event.delegate(document, 'a', 'click', function (e) {
        let $a = e.target;
        if ($a.hasAttribute('mip')) {
            let to = $a.getAttribute('href');
            if (guardEvent(e, $a)) {
                const location = router.resolve(to, router.currentRoute, false).location;
                if ($a.hasAttribute('replace')) {
                    router.replace(location);
                }
                else {
                    router.push(location);
                }
            }
        }
    });
}
