/**
 * @file demo data
 * @author sfe
 */

/* global MIP */

var data = {
    name: 'My Tree',
    children: [
        {
            name: 'hello'
        },
        {
            name: 'wat'
        },
        {
            name: 'child folder',
            children: [
                {
                    name: 'child folder',
                    children: [
                        {
                            name: 'hello'
                        },
                        {
                            name: 'wat'
                        }
                    ]
                },
                {
                    name: 'hello'
                },
                {
                    name: 'wat'
                },
                {
                    name: 'child folder',
                    children: [
                        {
                            name: 'hello'
                        },
                        {
                            name: 'wat'
                        }
                    ]
                }
            ]
        }
    ]
};

// define the item component
MIP.component('item', {
    template: '#item-template',
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

// boot up the demo
new MIP({
    el: '#demo',
    data: {
        treeData: data
    }
});
