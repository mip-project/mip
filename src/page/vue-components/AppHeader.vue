<template>
    <div class="mip-appshell-header">
        <svg @click="onClick('back')" class="mip-appshell-header-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1076" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs></defs><path d="M263.570286 530.285714l261.376 261.339429a18.285714 18.285714 0 0 1-25.892572 25.892571l-292.571428-292.571428a18.285714 18.285714 0 0 1 0-25.892572l292.571428-292.571428a18.285714 18.285714 0 0 1 25.892572 25.892571L263.570286 493.714286H804.571429a18.285714 18.285714 0 1 1 0 36.571428H263.570286z" p-id="1077"></path></svg>
        <span class="mip-appshell-header-title">{{title}}</span>
        <div class="mip-appshell-header-button-group">
            <div class="mip-appshell-header-button mip-appshell-header-button-chat">发消息</div>
            <div class="mip-appshell-header-button mip-appshell-header-button-subscribe">关注</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'mip-appshell-header',
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    methods: {
        onClick(source) {
            this.$emit(`click-${source}`);
        }
    }
};
</script>

<style lang="less">
@appshell-header-height: 44px;

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
    padding: 0 16px 0 6px;

    &-icon {
        height: 32px;
        width: 32px;
    }

    &-title {
        flex: 1;
    }

    &-button {
        display: inline-block;
        width: 56px;
        height: 25px;
        font-size: 12px;
        box-sizing: border-box;
        text-align: center;
        padding: 3px 0px;
        line-height: 19px;
        border-radius: 2px;

        &-chat {
            color: #3C76FF;
            border: 1px solid #3C76FF;
            background: #fff;
            margin-right: 8px;
        }

        &-subscribe {
            color: #fff;
            border: 1px solid #3897F0;
            background: #3897F0;
        }
    }
}
</style>
