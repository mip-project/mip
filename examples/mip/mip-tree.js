/**
 * @file mip-tree
 * @author sfe
 */

/* global MIP */

MIP.customElement('mip-tree', {
    template: `
        <div :class="{bold: isFolder}" @click="toggle" @dblclick="changeType">
            {{model.name}}
            <span v-if="isFolder">[{{open ? '-' : '+'}}]</span>
        </div>
        <ul v-show="open" v-if="isFolder">
            <item class="item" v-for="(model, index) in model.children" :model="model" :key="index">
            </item>
            <li class="add" @click="addChild">+</li>
        </ul>
    `,
    props: {
        model: Object
    },
    data: function () {
        return {
            open: false
        };
    },
    computed: {
        isFolder: function () {
            return this.model.children && this.model.children.length;
        }
    },
    methods: {
        toggle: function () {
            if (this.isFolder) {
                this.open = !this.open;
            }
        },
        changeType: function () {
            if (!this.isFolder) {
                MIP.set(this.model, 'children', []);
                this.addChild();
                this.open = true;
            }
        },
        addChild: function () {
            this.model.children.push({
                name: 'new stuff'
            });
        }
    }
});
