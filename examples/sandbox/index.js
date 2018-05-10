(function () {
    let {window, document} = mip.sandbox;
    let {
        alert,
        close,
        confirm,
        prompt,
        setTimeout,
        setInterval,
        self,
        top
    } = window;

    // alert('a');
    // confirm('a');
    // document.createElement('a');
    // document.createElementNS('a');
    // document.write('a');
    // document.writeln('a');

    console.log(
        '在沙盒环境中使用一下属性/API的取值如下：', '\n',
        'window: ', window, '\n',
        'self: ', self, '\n',
        'top: ', top, '\n',
        'document: ', document, '\n',
        'window.document: ', window.document, '\n',
        'alert: ', alert, '\n',
        'close: ', close, '\n',
        'confirm: ', confirm, '\n',
        'prompt: ', prompt, '\n',
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

})();

