<template>
    <div class="mip-appshell-error">
        <p>{{ message }}</p>
    </div>
</template>

<script>

export default {
    name: 'mip-appshell-error',
    data() {
        return {
            message: 404
        }
    }
};
</script>

<style lang="less">
.mip-appshell-error {
    p {
        text-align: center;
        margin-top: 20px;
        font-size: 40px;
    }
}
</style>
