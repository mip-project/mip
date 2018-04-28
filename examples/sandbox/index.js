import sandbox from '../../src/core/util/sandbox';

let {window, document} = sandbox;
let {
    alert,
    close,
    confirm,
    prompt,
    // eval // eval打包不给通过
} = window;

console.log(
    'window: ', window, '\n',
    'document: ', document, '\n',
    'window.document: ', window.document, '\n',
    'alert: ', alert, '\n',
    'close: ', close, '\n',
    'confirm: ', confirm, '\n',
    'prompt: ', prompt, '\n',
    'eval: ', window.eval, '\n',
    'document.createElement: ', document.createElement, '\n',
    'document.createElementNS: ', document.createElementNS, '\n',
    'document.write: ', document.write, '\n',
    'document.writeln: ', document.writeln
);

