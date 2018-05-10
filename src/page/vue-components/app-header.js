export default {
    name: 'mip-appshell-header',
    template: `
        <div class="mip-appshell-header">
            <svg @click="onClick('back')" class="mip-appshell-header-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1076" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs></defs><path d="M263.570286 530.285714l261.376 261.339429a18.285714 18.285714 0 0 1-25.892572 25.892571l-292.571428-292.571428a18.285714 18.285714 0 0 1 0-25.892572l292.571428-292.571428a18.285714 18.285714 0 0 1 25.892572 25.892571L263.570286 493.714286H804.571429a18.285714 18.285714 0 1 1 0 36.571428H263.570286z" p-id="1077"></path></svg>
            <span class="mip-appshell-header-title">{{title}}</span>
            <div class="mip-appshell-header-button-group">
                <div class="mip-appshell-header-button mip-appshell-header-button-chat">发消息</div>
                <div class="mip-appshell-header-button mip-appshell-header-button-subscribe">关注</div>
            </div>
        </div>
    `,
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
