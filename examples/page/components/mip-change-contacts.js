/**
 * @file demo mip-contacts component
 * @author wangyisheng@baidu.com (wangyisheng)
 */

/* global MIP */
mip.customElement('mip-change-contacts', {
    template: '<h2 @click="getData">click me to get contacts data</h2>',
    methods: {
        ...mip.Store.mapMutations('global', ['setData']),

        getData() {
            fetch("/examples/page/data/contacts.json", {
                credentials: 'include'
            }).then(res => {
                if (res.ok) {
                    res.json().then(data => {
                        this.setData(data);
                    });
                }
                else {
                    console.error('Fetch request failed!');
                }
            }).catch(function (e) {
                console.error(e);
            });
        }
    }
});
