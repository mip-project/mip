export default class Header {
    constructor(options) {
        this.$wrapper = options.wrapper || document.body;
        this.$el = null;
        this.data = options.data;
    }

    init() {
        let {showBackIcon, title, logo, buttonGroup} = this.data;

        this.$el = document.createElement('div');
        this.$el.classList.add('mip-appshell-header-wrapper');
        this.$el.innerHTML = `
        <div class="mip-appshell-header">
            ${showBackIcon ? `<span class="material-icons"
                @click="onClick('back')">
                keyboard_arrow_left
            </span>` : ''}
            ${logo ? `<img class="mip-appshell-header-logo" src="${logo}">` : ''}
            <span class="mip-appshell-header-title">${title}</span>
            ${this.renderButtonGroup(buttonGroup)}
        </div>
        `;
        this.$wrapper.prepend(this.$el);

        this.bindEvents();
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
                    data-button-name="${button.name}"
                    class="mip-appshell-header-icon">
                    ${button.link ?
                        `<a mip href="${button.link}">
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
                    data-button-name="${button.name}"
                    class="mip-appshell-header-button
                        mip-appshell-header-button-${button.outline ? 'outlined' : 'filled'}">
                    ${button.link ?
                        `<a mip href="${button.link}">
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

    }
}
