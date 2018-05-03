/**
 * @file demo data
 * @author sfe
 */

/* global MIP */

// define the item component
MIP.customElement('mip-item', {
    template: '#item-template',
    props: {
        model: {
            default() {
                return {};
            },
            type: Object
        }
    },
    data() {
        return {
            open: false
        };
    },
    computed: {
        isFolder() {
            return this.model.children && this.model.children.length;
        }
    },
    methods: {
        toggle() {
            if (this.isFolder) {
                this.open = !this.open;
            }
        },
        changeType() {
            if (!this.isFolder) {
                MIP.set(this.model, 'children', []);
                this.addChild();
                this.open = true;
            }
        },
        addChild() {
            this.model.children.push({
                name: 'new stuff'
            });
        },

        stringify(data) {
            return JSON.stringify(data);
        }
    }
});
