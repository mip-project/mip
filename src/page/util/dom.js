/**
 * @file define getter functions
 * @author wangyisheng@baidu.com (wangyisheng)
 */

import {generateScope, getScopedStyles} from './style';
import {
    MIP_CONTAINER_ID,
    MIP_VIEW_ID,
    MIP_CONTENT_IGNORE_TAG_LIST
} from '../const';

export function isMIP(rawContent) {
    // In fact this 'if' will not be executed
    // Once a page references 'mip.js' as script, it must be (or will be treated as) a MIP page.
    if (!rawContent) {
        return document.querySelector('html').getAttribute('mip') !== null;
    }

    return /<html[^>]+?\bmip\b/.test(rawContent);
}

export function createContainer (containerId) {
    let oldContainer = document.querySelector(`#${containerId}`);
    if (!oldContainer) {
        let container = document.createElement('div');
        container.id = containerId;
        document.body.appendChild(container);
    }
    else {
        oldContainer.innerHTML = '';
    }
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
        let match = rawContent.match(/<title>([\s\S]+)<\/title>/);
        if (match) {
            title = match[1];
        }
    }

    return title || '百度一下，你就知道';
}

export function getMIPContent(rawContent) {
    let rawResult;
    let scope = generateScope();

    rawContent = addVPre(rawContent);

    if (!rawContent) {
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
        let match = rawContent.match(/<body>([\s\S]+)<\/body>/);

        if (match) {
            rawResult = match[1].replace(/<mip-shell[\s\S]+?<\/mip-shell>/g, '')
                .replace(/<script[\s\S]+?<\/script>/g, function (scriptTag) {
                    if (scriptTag.indexOf('application/json') !== -1) {
                        return scriptTag;
                    }

                    return '';
                });
        }
    }

    // Process styles
    processMIPStyle(scope, rawContent);

    // Create a root node
    return `<div id="${MIP_VIEW_ID}" class="mip-appshell-router-view ${scope}">${rawResult}</div>`;
}

// Add v-pre for each <mip-*>
// These tags should be rendered by Custom Element, rather than Vue.
function addVPre(rawContent) {
    if (!rawContent) {
        let addVPreInner = function (node) {
            let tagName = node.tagName.toLowerCase();
            if (/^mip-/.test(tagName)) {
                if (tagName !== 'mip-link' && tagName !== 'mip-view') {
                    node.setAttribute('v-pre', '');
                }
                return;
            }

            for (let i = 0; i < node.children.length; i++) {
                addVPreInner(node.children[i]);
            }
        }

        addVPreInner(document.body);
    }
    else {
        return rawContent.replace(/<mip-[^>]+/g, function (match) {
            if (match.indexOf('mip-link') !== -1
                || match.indexOf('mip-view') !== -1) {
                return match;
            }

            return match + ' v-pre';
        });
    }
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
        document.querySelector('head').appendChild(customStyle);

        // in case of style tree shaking
        removeNodes.forEach(node => node.remove());
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

                rawContent = rawContent.replace(styleStr, '');
            });

            let scopedStyles = `<style mip-custom>${getScopedStyles(scope, rawStyle)}</style></head>`;
            rawContent = rawContent.replace('</head>', scopedStyles);
        }
    }

    return rawContent;
}
