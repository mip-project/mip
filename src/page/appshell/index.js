import Header from './header.js';
// import Loading from './loading.js';
import {DEFAULT_SHELL_CONFIG} from '../const';

export default class AppShell {
    constructor(options) {
        this.data = Object.assign(DEFAULT_SHELL_CONFIG, options.data);
        this.$wrapper = null;
        this.header = null;

        this.init();
    }

    init() {
        this.$wrapper = document.createElement('div');

        if (!this.data.header.hidden) {
            this.header = new Header({
                wrapper: this.$wrapper,
                data: {
                    ...this.data.header,
                    showBackIcon: !this.data.view.isIndex
                }
            });
            this.header.init();
        }

        document.body.prepend(this.$wrapper);
    }

    refresh(data) {
        let {header: {hidden}} = data;
            // this.$header.
    }
}
