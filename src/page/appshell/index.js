import Header from './header.js';
import Loading from './loading.js';
import {DEFAULT_SHELL_CONFIG} from '../const';

export default class AppShell {
    constructor(options) {
        this.data = Object.assign(DEFAULT_SHELL_CONFIG, options.data);
        this.$wrapper = null;
        this.header = null;
        this.loading = null;

        this.init();
    }

    init() {
        this.$wrapper = document.createElement('div');
        this.$wrapper.classList.add('mip-appshell-header-wrapper');

        if (!this.data.header.hidden) {
            this.header = new Header({
                wrapper: this.$wrapper,
                data: {
                    ...this.data.header,
                    showBackIcon: !this.data.view.isIndex
                },
                clickButtonCallback: this.handleClickHeaderButton.bind(this)
            });
            this.header.init();
        }

        this.loading = new Loading({
            wrapper: this.$wrapper
        });
        this.loading.init();

        document.body.prepend(this.$wrapper);
    }

    refresh(data) {
        let {header, view} = data;
        if (header.title) {
            document.title = header.title;
        }
        if (this.header) {
            this.header.update({
                ...header,
                showBackIcon: !view.isIndex
            });
            this.header.isDropdownShow = false;
        }
    }

    handleClickHeaderButton(buttonName) {
        // TODO: should emit relative CustomEvent so that other CustomElement can receive
        if (buttonName === 'back') {
            window.MIP_ROUTER.go(-1);
        }
        else if (buttonName === 'dropdown') {
            if (this.header) {
                this.header.toggleDropdown();
            }
        }
    }

    showLoading() {
        this.loading.show();
    }

    hideLoading() {
        this.loading.hide();
    }
}
