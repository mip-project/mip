/**
 * @file 处理style相关
 * @author qiusiqi@baidu.com (qiusiqi)
 */

import cssParser from 'cssjson';

export function generateScope() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

export function getScopedStyles(classname, rawCss) {
    if (!rawCss || !classname) {
        return '';
    }

    if (!classname.startsWith('.')) {
        classname = '.' + classname;
    }

    let scopedCss = {};
    doScoping(classname, cssParser.toJSON(rawCss), scopedCss);

    return cssParser.toCSS(scopedCss).replace(/[\n\r\t]/g, '');
};

function doScoping(classname, cssJson, scopedCss) {
    Object.keys(cssJson).forEach(key => {
        let css = cssJson[key];

        switch (key.trim()) {
            case 'children':
                scopedCss[key] = {};
                doScoping(classname, css, scopedCss[key]);
                break;

            case 'attributes':
                scopedCss[key] = css;
                break;

            default:
                let newKey = key;

                if (/@.*keyframes/.test(key) || css.children && isEmptyObj(css.children)) {
                    let subKeys = key.split(',');
                    subKeys = subKeys.map(k => /(html|body|(@.*keyframes))/.test(k.trim()) ? k : `${classname} ${k.trim()}`);
                    newKey = subKeys.join(',');

                    scopedCss[newKey] = css;
                }
                else {
                    scopedCss[newKey] = {};
                    doScoping(classname, css, scopedCss[newKey]);
                }
        }
    });
}

function isEmptyObj(obj) {
    return Object.keys(obj).length === 0;
}
