/**
 * @file define dom functions
 * @author wangyisheng@baidu.com (wangyisheng)
 */

import {generateScope, getScopedStyles} from './style';
import {
    MIP_CONTAINER_ID,
    MIP_VIEW_ID,
    MIP_CONTENT_IGNORE_TAG_LIST,
    DEFAULT_SHELL_CONFIG
} from '../const';

export function createContainer (containerId) {
    let oldContainer = document.querySelector(`#${containerId}`);
    if (!oldContainer) {
        let container = document.createElement('div');
        container.id = containerId;
        document.body.appendChild(container);
    }
    else {
        // client hydrating
        oldContainer.setAttribute('data-server-rendered', '');
        // oldContainer.innerHTML = '';
    }
}

export function getMIPShellConfig(rawHTML) {
    let rawJSON;
    if (rawHTML) {
        let match = rawHTML.match(/<\bmip-shell\b.*>\s*<script.*>([\s\S]+)<\/script>\s*<\/mip-shell>/i);
        if (match) {
            rawJSON = match[1];
        }
    }
    else {
        let $shell = document.body.querySelector('mip-shell');
        if ($shell) {
            rawJSON = $shell.children[0].innerHTML;
        }
    }
    try {
        return JSON.parse(rawJSON);
    }
    catch (e) {}

    return DEFAULT_SHELL_CONFIG;
}

export function getMIPTitle(rawContent) {
    let title;

    if (!rawContent) {
        let titleDom = document.querySelector('title');
        if (titleDom) {
            title = titleDom.innerHTML.trim();
        }
    }
    else {
        let match = rawContent.match(/<title>([\s\S]+)<\/title>/i);
        if (match) {
            title = match[1];
        }
    }

    return title || '百度一下，你就知道';
}

export function getMIPContent(rawContent) {
    let rawResult = rawContent;
    let scope = generateScope();

    // Process scoped styles
    processMIPStyle(scope, rawResult);

    if (!rawResult) {
        let tmpArr = [];
        let removeNode = [];
        for (let i = 0; i < document.body.children.length; i++) {
            let node = document.body.children[i];

            if (MIP_CONTENT_IGNORE_TAG_LIST.indexOf(node.tagName.toLowerCase()) === -1
                    && node.getAttribute('id') !== MIP_CONTAINER_ID) {
                tmpArr.push(node.outerHTML);
                removeNode.push(node);
            }
        }

        removeNode.forEach(node => node.remove());
        rawResult = tmpArr.join('');
    }
    else {
        let match = rawResult.match(/<\bbody\b.*>([\s\S]+)<\/body>/i);

        if (match) {
            rawResult = match[1];
        }

        // Delete <mip-shell> & <script>
        rawResult = rawResult.replace(/<mip-shell[\s\S]+?<\/mip-shell>/ig, '')
            .replace(/<script[\s\S]+?<\/script>/ig, function (scriptTag) {
                if (scriptTag.indexOf('application/json') !== -1) {
                    return scriptTag;
                }

                return '';
            });

        // Add <mip-data> for global data
        if (!/<\/mip-data>/.test(rawResult) && typeof window.m === 'object') {
            let dataStr = JSON.stringify(window.m, (key, value) => {
                if (key === '__ob__') {
                    return;
                }

                return value;
            });

            rawResult += `<mip-data><script type="application/json">${dataStr}</script></mip-data>`;
        }
    }

    return {
        MIPContent: rawResult,
        scope
    };
}

export function processMIPStyle(scope, rawContent) {
    let rawStyle = '';

    if (!rawContent) {
        let tmpNodeArr = document.querySelectorAll('style');
        let removeNodes = [];

        tmpNodeArr.forEach(style => {
            if (style.getAttribute('mip-custom') !== null) {
                removeNodes.push(style);
                rawStyle += style.innerHTML.trim();
            }
        });

        let customStyle = document.createElement('style');
        customStyle.setAttribute('mip-custom', '');
        customStyle.innerHTML = getScopedStyles(scope, rawStyle);
        // document.querySelector('head').appendChild(customStyle);

        // in case of style tree shaking
        // removeNodes.forEach(node => node.remove());
    }
    else {
        let reg = /<style[^>]*mip-custom[^>]*>([^<]*.*)<\/style>/i;
        let match = rawContent.match(new RegExp(reg, 'g'));

        if (match) {
            match.forEach(styleStr => {
                let innerMatch = styleStr.match(reg);

                if (innerMatch && innerMatch[1]) {
                    rawStyle += innerMatch[1];
                }
            });

            // document.querySelector('style[mip-custom]').innerHTML += getScopedStyles(scope, rawStyle);
            document.querySelector('style[mip-custom]').innerHTML += rawStyle;
        }
    }
}

export function getMIPCustomScript(rawContent) {
    if (!rawContent) {
        let script = document.querySelector('script[type="application/mip-script"]');
        if (!script) {
            return;
        }

        let scriptContent = getSandboxFunction(script.innerHTML);
        script.remove();
        return scriptContent;
    }

    let match = rawContent.match(/<script[\s\S]+?type=['"]?application\/mip-script['"]?>([\s\S]+?)<\/script>/i);
    if (match) {
        let scriptContent = match[1];
        return getSandboxFunction(scriptContent);
    }
}

function getSandboxFunction(script) {
    return new Function('window', 'document', `
        let {alert, close, confirm, prompt, setTimeout, setInterval, self, top} = window;

        ${script}
    `);
}

function guardEvent(e, $a) {
    // don't redirect with control keys
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) {
        return;
    }
    // don't redirect when preventDefault called
    if (e.defaultPrevented) {
        return;
    }
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
    $(document).on('click', 'a', (e) => {
        let $a = e.currentTarget;
        if ($a.hasAttribute('mip')) {
            let to = $a.getAttribute('href');
            if (guardEvent(e, $a)) {
                const {location} = router.resolve(to, router.currentRoute, false);
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
