/**
 * @file mip-tree.js
 * @author huanghuiquan (huanghuiquan@baidu.com)
 */

let template = `
<li>
    <div :class="{bold: isFolder}" @click="toggle" @dblclick="changeType">
        {{model.name}}
        <span v-if="isFolder">[{{open ? '-' : '+'}}]</span>
    </div>
    <ul v-show="open" v-if="isFolder">
        <mip-img src="https://www.mipengine.org/static/img/mip_logo_3b722d7.png"></mip-img>
        <li class="item" v-for="(model, index) in model.children" :key="index">{{model}}</li>
        <li class="add" @click="addChild">+</li>
    </ul>
</li>
`;

window.MIP.customElement('mip-tree', {
    template,
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
                this.$set(this.model, 'children', []);
                this.addChild();
                this.open = true;
            }

        },
        addChild() {
            this.model.children.push({
                name: 'new stuff'
            });
        }
    }
});
