/**
 * @file 处理style相关
 * @author qiusiqi@baidu.com (qiusiqi)
 */

import cssParser from 'css-json-converter';

export function generateScope() {
    return '_' + Math.random().toString(36).substr(2, 9);
};

export function getScopedStyles(classname, rawCss) {
    if (!rawCss || !classname) {
        return '';
    }

    // if (!classname.startsWith('.')) {
    //     classname = '.' + classname;
    // }

    classname = `[${classname}]`;

    let scopedCss = {};
    rawCss = normalize(rawCss);
    let replacementPair = doScoping(classname, cssParser.toJSON(rawCss), scopedCss);

    scopedCss = cssParser.toCSS(scopedCss);
    for (let rep of replacementPair) {
        let reg = new RegExp(`${rep.type}:(.*)${rep.before}`, 'g');
        let match = scopedCss.match(reg);
        if (match) {
            scopedCss = scopedCss.replace(new RegExp(`(${rep.type}):(.*)${rep.before}`, 'g'), '$1: $2' + rep.after);
        }
    }
    return scopedCss.replace(/[\n\t\r]/g, '');
};

function doScoping(classname, cssJson, scopedCss) {
    let replacementPair = [];
    let fontFaces = [];

    Object.keys(cssJson).forEach(key => {
        let css = cssJson[key];

        switch (key.trim()) {
            case 'children':
                scopedCss[key] = {};
                replacementPair = [
                    ...replacementPair,
                    ...doScoping(classname, css, scopedCss[key])
                ];
                break;

            case 'attributes':
                scopedCss[key] = css;
                break;

            default:
                let newKey = key;

                if (/@.*keyframes/.test(key)) {
                    let nameMatch = key.match(/@.*keyframes\s+(.*)/);
                    let name = nameMatch && nameMatch[1] || '';
                    if (name) {
                        newKey = key.replace(name, `${name}-${classname}`);
                        replacementPair.push({
                            type: `(animation|animation-name)`,
                            before: name,
                            after: `${name}-${classname}`
                        });
                    }

                    scopedCss[newKey] = css;
                }
                else if (/@.*font-face/.test(key)) {
                    let name = css.attributes['font-family'];
                    replacementPair.push({
                        type: 'font-family',
                        before: name,
                        after: `${name}-${classname}`
                    });

                    scopedCss[newKey] = css;
                }
                else if (css.children && isEmptyObj(css.children)) {
                    let subKeys = key.split(',');
                    subKeys = subKeys.map(k => {
                        if (/(html|body)/g.test(k)) {
                            k = k.trim().replace(/(\s{2,})/g, ' ').split(' ');
                            let last = Math.max(k.lastIndexOf('html'), k.lastIndexOf('body'));
                            if (last || k.length > 1) {
                                k.splice(last + 1, 0, classname);
                            }
                            k = k.join(' ');
                        }
                        else {
                            k = `${classname} ${k.trim()}`;
                        }
                        return k;
                    });
                    newKey = subKeys.join(',');

                    scopedCss[newKey] = css;
                }
                else {
                    scopedCss[newKey] = {};
                    replacementPair = [
                        ...replacementPair,
                        ...doScoping(classname, css, scopedCss[newKey])
                    ];
                }
        }
    });

    return replacementPair;
}

function normalize(rawCss) {
    return rawCss.replace(/([^\{\}\n\t\s])[\n\t\s]*(\})/g, (...args) => {
        if (args[1] !== ';' && args[1] !== '}') {
            return `${args[1]};}`;
        }
        return `${args[1]}}`;
    });
}

function isEmptyObj(obj) {
    return Object.keys(obj).length === 0;
}
