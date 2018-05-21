<template>
    <div class="mip-appshell-header">
        <span
            v-if="showBackIcon"
            class="material-icons"
            @click="onClick('back')">
            keyboard_arrow_left
        </span>
        <img v-if="logo" class="mip-appshell-header-logo" :src="logo">
        <span class="mip-appshell-header-title">{{title}}</span>
        <div v-if="buttonGroup.length" class="mip-appshell-header-button-group">
            <template v-for="button in buttonGroup">
                <div
                    v-if="button.type === 'icon'"
                    class="mip-appshell-header-icon"
                    @click="onClick(`${button.name}`)">
                    <a mip v-if="button.link" :href="button.link">
                        <span class="material-icons">{{button.text}}</span>
                    </a>
                    <span v-if="!button.link" class="material-icons">{{button.text}}</span>
                </div>
                <button
                    v-if="button.type === 'button'"
                    :class="{
                        'mip-appshell-header-button': true,
                        [`mip-appshell-header-button-${button.outline ? 'outlined' : 'filled'}`]: true
                    }"
                    @click="onClick(`${button.name}`)">
                    <a mip v-if="button.link" :href="button.link">
                        {{button.text}}
                    </a>
                    <span v-if="!button.link">{{button.text}}</span>
                </button>

                <div v-if="button.type === 'dropdown'"
                    class="mip-appshell-header-icon"
                    v-click-outside="clickOutsideArgs">
                    <span class="material-icons" @click="showDropdown = !showDropdown">
                        menu
                    </span>
                    <transition name="slide">
                        <div ref="appshellHeaderDropdown"
                            class="mip-appshell-header-dropdown"
                            v-show="showDropdown">
                            <div v-for="item in button.items"
                                class="mip-appshell-header-dropdown-item"
                                :class="{'mip-link-active': isActive(item.link)}"
                                @click="onClick(`${item.name}`)">
                                <a mip
                                    v-if="item.link"
                                    :href="item.link">
                                    {{item.text}}
                                </a>
                                <span v-if="!item.link">{{item.text}}</span>
                            </div>
                        </div>
                    </transition>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import ClickOutside from '../directives/click-outside';
import {isSameRoute, createRoute} from '../../router/util/route';
import {customEmit} from '../../custom-element/utils/custom-event';

export default {
    name: 'mip-appshell-header',
    props: {
        title: {
            type: String,
            default: ''
        },
        logo: {
            type: [String, Boolean],
            default: false
        },
        showBackIcon: {
            type: Boolean,
            default: false
        },
        buttonGroup: {
            type: Array,
            default: () => { return []; }
        }
    },
    directives: {
        ClickOutside
    },
    data() {
        return {
            showDropdown: false,
            clickOutsideArgs: {
                include: this.getDropDownParent,
                onClose: this.onCloseDropdown,
                // closeConditional: this.closeConditional
            }
        };
    },
    methods: {
        isActive(to) {
            if (!to) {
                return false;
            }
            let location = this.$router.resolve(to, this.$route, false).location;
            let compareTarget = location.path
                ? createRoute(null, location, null, this.$router)
                : route;

            return isSameRoute(this.$route, compareTarget);
        },
        getDropDownParent() {
            return [this.$refs.appshellHeaderDropdown && this.$refs.appshellHeaderDropdown[0]];
        },
        onClick(source) {
            this.showDropdown = false;
            let eventName = `appheader::click-${source}`;
            this.$emit(eventName);
            // trigger CustomEvent like vue-custom-element
            customEmit(window, eventName);
        },
        onCloseDropdown() {
            this.showDropdown = false;
        }
    }
};
</script>

<style lang="less">
@import '../../styles/variable.less';

@appshell-header-dropdown-height: 30px;

.mip-appshell-header {
    position: fixed;
    right: 0;
    left: 0;
    display: flex;
    align-items: center;
    z-index: 140;
    height: @appshell-header-height;
    line-height: @appshell-header-height;
    font-size: 16px;
    border-bottom: 1px solid #eee;
    background: white;
    padding: 0 6px 0 6px;

    &-logo {
        height: 32px;
        width: 32px;
        margin: 0 8px 0 0;
    }

    &-title {
        flex: 1;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    &-button-group {
        display: flex;
        align-items: center;
        position: relative;

        .mip-appshell-header-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            margin: 0 4px;
            a {
                display: flex;
            }
        }

        .mip-appshell-header-button {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 4px;
            width: 56px;
            height: 25px;
            font-size: 12px;
            box-sizing: border-box;
            text-align: center;
            padding: 3px 0px;
            line-height: 19px;
            border-radius: 2px;

            &:active {
                opacity: 0.2;
            }

            &-outlined {
                color: #3C76FF;
                border: 1px solid #3C76FF;
                background: #fff;

                a {
                    color: #3C76FF;
                    display: flex;
                }
            }

            &-filled {
                color: #fff;
                border: 1px solid #3897F0;
                background: #3897F0;

                a {
                    color: #fff;
                    display: flex;
                }
            }
        }

        .mip-appshell-header-dropdown {
            position: absolute;
            z-index: 999999;
            top: 20px;
            right: 0;
            width: 100px;
            background: white;
            transition: all 0.3s ease;
            opacity: 1;
            transform: translate(0, 0);
            will-change: transform;
            box-shadow: 0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12);

            &.slide-enter {
                transform: translate(0, -10px);
                opacity: 0;
            }
            &.slide-leave-active {
                transform: translate(0, -10px);
                opacity: 0;
            }

            &-item {
                height: @appshell-header-dropdown-height;
                display: flex;
                align-items: center;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                padding: 4px 8px;
                font-size: 14px;

                &.mip-link-active {
                    background: rgba(0,0,0,.12);
                }

                a {
                    width: 100%;
                    line-height: @appshell-header-dropdown-height;
                }
            }
        }
    }
}
</style>
