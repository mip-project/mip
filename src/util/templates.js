/**
 * @file templates
 * @author sekiyika(pengxing@baidu.com)
 */

const CACHED_ATTR = '_mip_template_cached';

class Template {
    cache() {}
    render() {}
}

class Templates {

    /**
     * Templates
     *
     * @constructor
     */
    constructor() {
        this._templates = {};
        this._solverList = {};
        this.Template = Template;
    }

    _create(type) {
        if (!this._templates[type]) {
            let solve;
            this._templates[type] = new Promise(s => solve = s);
            this._solverList[type] = solve;
        }
        return this._templates[type];
    }

    _getTemplate(type) {
        return this._create(type);
    }

    register(type, Template) {
        this._create(type);
        let solve = this._solverList[type];
        solve(new Template());
    }

    isTemplateClass(obj) {
        if (!obj || !obj.prototype) {
            return false;
        }
        return Template.prototype.isPrototypeOf(obj.prototype);
    }

    render(element, data, obj) {
        let self = this;
        let template = self.find(element);

        if (!template) {
            return;
        }

        let type = template.getAttribute('type');
        let templateHTML = template.innerHTML;

        return self._getTemplate(type).then(impl => {
            if (!template[CACHED_ATTR]) {
                template[CACHED_ATTR] = true;
                impl.cache(templateHTML);
            }

            data = self.extendFun(data);

            // array
            if (Array.isArray(data)) {
                if (data.length === 0) {
                    return Promise.resolve([]);
                }
                return data.map(item => impl.render(templateHTML, item));
            }

            // cb
            if (obj) {
                return {element: element, html: impl.render(templateHTML, data)};
            }

            // html
            return impl.render(templateHTML, data);
        });
    }

    find(element) {
        if (!element || element.nodeType !== 1) {
            return console.error('Template parent element must be a node element');
        }
        let templateId = element.getAttribute('template');
        let template;

        template = templateId ? document.getElementById(templateId) : element.querySelector('template');

        if (!template) {
            return console.error('Can not find template element');
        }

        return template;
    }

    extendFun(data) {
        try {
            data.escape2Html = () => (text, render) => render(text)
                .replace(/&lt;/ig, '<')
                .replace(/&gt;/ig, '>')
                .replace(/&#x2F;/ig, '/');

            data.isSF = () => this.urltype === 'sf';
        }
        catch (e) {}
        return data;
    }

    inheritTemplate() {
        function inheritor() {
            Template.apply(this, arguments);
        }
        inheritor.prototype = Object.create(Template.prototype);
        inheritor.constructor = inheritor;
        return inheritor;
    }
}

export default new Templates();
