/**
 * @file demo mip-contacts component
 * @author wangyisheng@baidu.com (wangyisheng)
 */

/* global mip */
mip.customElement('mip-contacts', {
    template: `
        <div>
            <div>hello {{group.info.name}}! wait to show contacts</div>
            <ul v-if="contacts && contacts.length">
                <li v-for="c in contacts">
                    <p>username:{{c.username}}</p>
                    <p>gender:{{c.gender}}</p>
                </li>
            </ul>
            <ul v-if="tabs && tabs.length">
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
