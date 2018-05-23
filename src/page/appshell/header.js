import event from '../../util/dom/event';

export default class Header {
    constructor(options = {}) {
        this.$wrapper = options.wrapper || document.body;
        this.$el = null;
        this.data = options.data;
        this.clickButtonCallback = options.clickButtonCallback;
    }

    init() {
        this.$el = document.createElement('div');
        this.$el.classList.add('mip-appshell-header');
        this.$el.innerHTML = this.render(this.data);
        this.$wrapper.prepend(this.$el);

        this.bindEvents();
    }

    render(data) {
        let {showBackIcon, title, logo, buttonGroup} = data;
        return `
            ${showBackIcon ? `<span class="material-icons" mip-header-btn
                data-button-name="back">
                keyboard_arrow_left
            </span>` : ''}
            ${logo ? `<img class="mip-appshell-header-logo" src="${logo}">` : ''}
            <span class="mip-appshell-header-title">${title}</span>
            ${this.renderButtonGroup(buttonGroup)}
        `;
    }

    renderButtonGroup(buttonGroup) {
        return `${buttonGroup.length ? `
            <div class="mip-appshell-header-button-group">
                ${buttonGroup.map(this.renderButton).join('')}
            </div>
        ` : ''}`;
    }

    renderButton(button) {
        if (button.type === 'icon') {
            return `
                <div
                    mip-header-btn
                    data-button-name="${button.name}"
                    class="mip-appshell-header-icon">
                    ${button.link ?
                        `<a mip-link href="${button.link}">
                            <span class="material-icons">${button.text}</span>
                        </a>` :
                        `<span class="material-icons">${button.text}</span>`
                    }
                </div>
            `;
        }
        else if (button.type === 'button') {
            return `
                <button
                    mip-header-btn
                    data-button-name="${button.name}"
                    class="mip-appshell-header-button
                        mip-appshell-header-button-${button.outline ? 'outlined' : 'filled'}">
                    ${button.link ?
                        `<a mip-link href="${button.link}">
                            ${button.text}
                        </a>` :
                        `<span>${button.text}</span>`
                    }
                </button>
            `;
        }
        else if (button.type === 'dropdown') {
            return `
                <div class="mip-appshell-header-icon">
                    <span class="material-icons" @click="showDropdown = !showDropdown">
                        menu
                    </span>
                </div>
            `;
        }
        return '';
    }

    bindEvents() {
        let clickButtonCallback = this.clickButtonCallback;
        this.eventHandler = event.delegate(this.$el, '[mip-header-btn]', 'click', function(e) {
            let buttonName = this.dataset.buttonName;
            clickButtonCallback(buttonName);
        });
    }

    unbindEvents() {
        this.eventHandler && this.eventHandler();
    }

    update(data) {
        this.$el.innerHTML = this.render(data);
    }
}
