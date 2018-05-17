/**
 * @file define dom functions
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

    return {};
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
    if (!rawResult) {
        // Process scoped styles
        processMIPStyle(scope);

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
        // Process scoped styles
        processMIPStyle(scope, rawResult);

        let match = rawResult.match(/<\bbody\b.*>([\s\S]+)<\/body>/i);

        if (match) {
            rawResult = match[1].replace(/<mip-shell[\s\S]+?<\/mip-shell>/ig, '')
                .replace(/<script[\s\S]+?<\/script>/ig, function (scriptTag) {
                    if (scriptTag.indexOf('application/json') !== -1) {
                        return scriptTag;
                    }

                    return '';
                });
        }
    }

    // Create a root node
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
            });

            document.querySelector('style[mip-custom]').innerHTML += getScopedStyles(scope, rawStyle);
        }
    }
}
