<template>
    <div id="app">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    export default {};
</script>

<style lang="scss">
    html, body {
        font-family: '微软雅黑', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        margin: 0px;
        padding: 0px;
        font-size: 14px;
    }

    #app {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }

    /* transition fade 的样式 */
    .fade-enter-active,
    .fade-leave-active {
    	transition: all .2s ease;
    }
    .fade-enter,
    .fade-leave-active {
    	opacity: 0;
    }
</style>
