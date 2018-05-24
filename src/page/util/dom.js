/**
 * @file define dom functions
 * @author wangyisheng@baidu.com (wangyisheng)
 */

import {generateScope, getScopedStyles} from './style';
import {getPath} from './url';
import css from '../../util/dom/css';

import {
    MIP_CONTAINER_ID,
    MIP_VIEW_ID,
    MIP_CONTENT_IGNORE_TAG_LIST,
    DEFAULT_SHELL_CONFIG,
    MIP_IFRAME_CONTAINER
} from '../const';

let activeZIndex = 10000;

export function createIFrame(path) {
    let container = document.querySelector(`.${MIP_IFRAME_CONTAINER}[data-page-id="${path}"]`);

    if (!container) {
        container = document.createElement('iframe');
        container.setAttribute('src', path);
        container.setAttribute('class', MIP_IFRAME_CONTAINER);
        container.setAttribute('data-page-id', path);
        container.setAttribute('sandbox', 'allow-top-navigation allow-popups allow-scripts allow-forms allow-pointer-lock allow-popups-to-escape-sandbox allow-same-origin allow-modals')
        document.body.appendChild(container);
    }
    else {
        // client hydrating
        container.setAttribute('data-server-rendered', '');
        // oldContainer.innerHTML = '';
    }

    return container;
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

export function frameMoveIn(iframe, options = {}) {
    iframe = getIFrame(iframe);
    let width = window.innerWidth;

    let exec = () => {
        css(iframe, {
            'z-index': activeZIndex++,
            transform: `translateX(${width}px)`,
            display: 'block',
            transition: 'all 0.35s ease'
        });

        setTimeout(() => {
            css(iframe, {
                transform: 'translateX(0)'
            })
        }, 100);
    };

    if (options.newPage) {
        iframe.onload = exec;
    }
    else {
        exec();
    }
}

export function frameMoveOut(iframe) {
    iframe = getIFrame(iframe);
    let width = window.innerWidth;

    css(iframe, {
        transform: `translateX(-${width}px)`
    });
    setTimeout(() => {
        css(iframe, {
            display: 'none',
            'z-index': 10000,
            transform: 'translateX(0)',
            transition: 'none'
        })
    }, 350);
}

function getIFrame(iframe) {
    if (typeof iframe === 'string') {
        return document.querySelector(`.${MIP_IFRAME_CONTAINER}[data-page-id="${iframe}"]`);
    }

    return iframe;
}

export const inBrowser = typeof window !== 'undefined';
