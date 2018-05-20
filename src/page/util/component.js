/**
 * @file 处理组件相关
 * @author wangyisheng@baidu.com (wangyisheng)
 */

// Store name of loaded component scripts
// e.g. {'tree', 'hello'}
let loadedComponents = new Set();

// Store map from components name to src
// e.g. {'tree': 'some.cdn.com/mip-components/mip-tree.js'}
let componentsSrcMap = Object.create(null);

export function getMIPComponents(rawContent) {
    // Eliminate duplicate scripts
    let componentsSet = new Set();

    if (!rawContent) {
        document.querySelectorAll('script').forEach(script => {
            let src = script.getAttribute('src') || '';
            let match = src.match(/\/mip-([^\/]+)\.js/);

            if (match) {
                componentsSet.add(match[1]);
                componentsSrcMap[match[1]] = src;
            }
        });
    }
    else {
        let match = rawContent.match(/<script[\s\S]*?>/g);

        if (match) {
            match.forEach(scriptAttrStr => {
                let innerMatch = scriptAttrStr.match(/src=['"]?(.+\/mip-([^\/]+)\.js)/);

                if (innerMatch) {
                    componentsSet.add(innerMatch[2]);
                    componentsSrcMap[innerMatch[2]] = innerMatch[1];
                }
            });
        }
    }

    let components = [];
    componentsSet.forEach(com => components.push(com));
    return components;
}

// Store names of components which has already been loaded
export function addLoadedComponents() {
    getMIPComponents().forEach(com => loadedComponents.add(com));
}

// Get names of components which need to be loaded
export function getNewComponents(targetHTML) {
    let targetComponents = getMIPComponents(targetHTML);
    let newComponents = [];

    targetComponents.forEach(targetCom => {
        if (!loadedComponents.has(targetCom)) {
            newComponents.push(targetCom);
        }
    });

    return newComponents;
}

// Load components by names
// Some components need additional template. Find them and append it. See https://github.com/mip-project/mip/issues/14
export async function loadScripts(components) {
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.onload = resolve;
            script.onerror = reject;
            script.src = src;
            document.body.appendChild(script);
        });
    }

    await Promise.all(components.map(com => loadScript(componentsSrcMap[com])));

    addLoadedComponents(components);
}
