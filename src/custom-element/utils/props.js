/**
 * @file props.js
 * @author sfe-sy (sfe-sy@baidu.com)
 */

import {camelize, hyphenate} from './helpers';

// Number and Boolean props are treated as strings
// We should convert it so props will behave as intended
// Conversion can be overwritted by prop validation (https://vuejs.org/v2/guide/components-props.html#Prop-Validation)
export function convertAttributeValue(value, overrideType, attr, element) {
    let propsValue = `${value}`;
    let isBoolean = ['true', 'false'].indexOf(value) > -1;
    let valueParsed = parseFloat(propsValue, 10);
    let isNumber = !isNaN(valueParsed)
        && isFinite(propsValue)
        && propsValue.match(/^0+[^.]\d*$/g);

    if (overrideType && overrideType !== Boolean) {
        propsValue = overrideType(value);
    }
    else if (isBoolean || overrideType === Boolean) {
        propsValue = propsValue === 'true';
    }
    else if (isNumber) {
        propsValue = valueParsed;
    }

    // compatible: for let props recive object data
    let temp = propsValue;
    try {
        temp = JSON.parse(propsValue);
    }
    catch (e) {}

    // hide the data attribute
    // element && element.removeAttribute(attr.name);

    return temp;
}

function extractProps(collection, props) {
    if (collection && collection.length) {
        collection.forEach(prop => {
            let camelCaseProp = camelize(prop);
            props.camelCase.indexOf(camelCaseProp) === -1 && props.camelCase.push(camelCaseProp);
        });
    }
    else if (collection && typeof collection === 'object') {
        for (let prop in collection) { // eslint-disable-line no-restricted-syntax, guard-for-in
            let camelCaseProp = camelize(prop);
            props.camelCase.indexOf(camelCaseProp) === -1 && props.camelCase.push(camelCaseProp);

            if (collection[camelCaseProp] && collection[camelCaseProp].type) {
                props.types[prop] = [].concat(collection[camelCaseProp].type)[0];
            }
        }
    }
}

// Extract props from component definition, no matter if it's array or object
export function getProps(componentDefinition = {}) {
    let props = {
        camelCase: [],
        hyphenate: [],
        types: {}
    };

    if (componentDefinition.mixins) {
        componentDefinition.mixins.forEach(mixin => extractProps(mixin.props, props));
    }
    if (componentDefinition.extends && componentDefinition.extends.props) {
        let parentProps = componentDefinition.extends.props;
        extractProps(parentProps, props);
    }

    extractProps(componentDefinition.props, props);
    props.camelCase.forEach(prop => props.hyphenate.push(hyphenate(prop)));

    return props;
}

// If we get DOM node of element we could use it like this:
// document.querySelector('widget-vue1').prop1 < --get prop
// document.querySelector('widget-vue1').prop1 = 'new Value' < --set prop
export function reactiveProps(element, props) {
    // Handle param attributes
    props.camelCase.forEach((name, index) => {
        Object.defineProperty(element, name, {
            get() {
                return this.vm[name];
            },
            set(value) {
                if ((typeof value === 'object' || typeof value === 'function') && this.vm) {
                    let propName = props.camelCase[index];
                    this.vm[propName] = value;
                }
                else {
                    let type = props.types[props.camelCase[index]];
                    this.setAttribute(props.hyphenate[index], convertAttributeValue(value, type));
                }
            }
        });
    });
}

// In root Vue instance we should initialize props as 'propsData'.
export function getPropsData(element, componentDefinition, props) {
    let propsData = componentDefinition.propsData || {};
    let dataElement = element.querySelector('script[type*=json]');

    // if there is a script data in custom element
    if (dataElement) {
        let scriptData;
        try {
            scriptData = JSON.parse(dataElement.innerHTML) || {};
        }
        catch (err) {
            console.warn(dataElement, 'Content should be a valid JSON string!');
            scriptData = {};
        }

        element && element.removeChild(dataElement);
        propsData = Object.assign({}, propsData, scriptData);
    }

    props.hyphenate.forEach((name, index) => {
        let propCamelCase = props.camelCase[index];
        let type = null;
        let propValue = element.attributes[name]
            /**
             * 这里有一个 bug：<mip-link append> 使用的 append 属性，在 DOM Element 是一个 Function
             * 此时 props 初始化就出错了。
             */
            // || element[propCamelCase]
            || propsData[name];

        if (props.types[propCamelCase]) {
            type = props.types[propCamelCase];
        }

        propsData[propCamelCase] = propValue instanceof Attr
            ? convertAttributeValue(propValue.value, type, propValue, element)
            : propValue;
    });

    return propsData;
}
