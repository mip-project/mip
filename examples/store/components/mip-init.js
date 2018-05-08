/**
 * @file mip-init
 * @author sfe
 */

/* global mip */

mip.customElement('mip-init', {
    template: `
        <div>
            <h2>moduleName: {{moduleName}}</h2>
            <ul v-if="tabNames && tabNames.length">
                <li v-for="name in tabNames">{{name}}</li>
            </ul>
            <p @click="changeName('test')">click me to change moduleNam to: test</p>
        </div>
    `,
    props: {
        src: String,
        model: {
            default() {
                return {};
            },
            type: Object
        }
    },
    initStore() {
        return {
            namespace: 'mip/init',
            module: {
                state: () => ({
                    moduleName: 'mipInit',
                    tabs: [{
                        name: 'tab1'
                    },
                    {
                        name: tabs2
                    }]
                }),
                mutations: {
                    changeName(state, name) {
                        state.moduleName = name;
                    }
                },
                getters: {
                    tabNames(state) {
                        return state.tabs.map(t => t.name);
                    }
                }
            }
        }
    },
    computed: {
        ...mip.Store.mapState('mip/init', ['moduleName']),
        ...mip.Store.mapGetters('mip/init', ['tabNames'])
    }
});
