import sandbox from '../../src/core/util/sandbox';

let {window, document} = sandbox;
let {
    alert,
    close,
    confirm,
    prompt,
    setTimeout,
    setInterval
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

setTimeout(function () {
    console.log('我是setTimeout中使用的this：', this);
});

let interval = setInterval(function () {
    console.log('我是setInterval中使用的this：', this);
}, 1000);

setTimeout(function () {
    console.log('清除interval任务');
    clearInterval(interval);
}, 2000);

