/**
 * @file entry-runtime-with-compiler.js
 * @author sfe-sy(sfe-sy@baidu.com)
 */

import config from 'core/config';
import {warn, cached} from 'core/util/index';
import {mark, measure} from 'core/util/perf';

import MIP from './runtime/index';
import {query} from './util/index';
import {shouldDecodeNewlines} from './util/compat';
import {compileToFunctions} from './compiler/index';

const idToTemplate = cached(id => {
    const el = query(id);
    return el && el.innerHTML;
});

const mount = MIP.prototype.$mount;
MIP.prototype.$mount = function (el, hydrating) {
    el = el && query(el);

    /* istanbul ignore if */
    if (el === document.body || el === document.documentElement) {
        process.env.NODE_ENV !== 'production' && warn(
            'Do not mount MIP to <html> or <body> - mount to normal elements instead.'
        );
        return this;
    }

    const options = this.$options;
    // resolve template/el and convert to render function
    if (!options.render) {
        let template = options.template;
        if (template) {
            if (typeof template === 'string') {
                if (template.charAt(0) === '#') {
                    template = idToTemplate(template);

                    /* istanbul ignore if */
                    if (process.env.NODE_ENV !== 'production' && !template) {
                        warn(
                            `Template element not found or is empty: ${options.template}`,
                            this
                        );
                    }
                }
            }
            else if (template.nodeType) {
                template = template.innerHTML;
            }
            else {
                if (process.env.NODE_ENV !== 'production') {
                    warn('invalid template option:' + template, this);
                }

                return this;
            }
        }
        else if (el) {
            template = getOuterHTML(el);
        }

        if (template) {

            /* istanbul ignore if */
            if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
                mark('compile');
            }

            const {render, staticRenderFns} = compileToFunctions(template, {
                shouldDecodeNewlines,
                delimiters: options.delimiters,
                comments: options.comments
            }, this);
            options.render = render;
            options.staticRenderFns = staticRenderFns;

            /* istanbul ignore if */
            if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
                mark('compile end');
                measure(`mip ${this._name} compile`, 'compile', 'compile end');
            }
        }
    }

    return mount.call(this, el, hydrating);
};

// 获取元素的 html 字符串
function getOuterHTML(el) {
    if (el.outerHTML) {
        return el.outerHTML;
    }

    const container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML;
}

MIP.compile = compileToFunctions;

export default MIP;
