/**
 * @file demo mip-contacts component
 * @author wangyisheng@baidu.com (wangyisheng)
 */

/* global MIP */
mip.customElement('mip-contacts', {
    template: `
        <div>
            <div>hello {{group.info.name}}!</div>
            <ul v-if="contacts && contacts.length">
                <h3>Async contacts Data below:</h3>
                <li v-for="c in contacts">
                    <p>username:{{c.username}}</p>
                    <p>gender:{{c.gender}}</p>
                </li>
            </ul>
            <ul v-if="tabs && tabs.length">
                <h3>Initial tab data below:</h3>
                <li v-for="t in tabs">
                    <p>tab:{{t}}</p>
                </li>
            </ul>
        </div>
    `,
    computed: {
        ...mip.Store.mapState('global', [
            'tabs',
            'group',
            'contacts',
            'users'
        ])
    }
});
