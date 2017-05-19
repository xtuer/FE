<template>
    <div id="app">
        <img src="./assets/logo.png">

        <div>
            <ul class="menus">
                <li class="menu-item"><router-link to="/">Home</router-link></li>
                <li class="menu-item"><router-link to="/hello">Hello</router-link></li>
                <li class="menu-item"><router-link to="/foo">Foo</router-link></li>
            </ul>
        </div>

        <div class="main">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'app',
    };
</script>

<style lang="scss">
    #app {
        font-family: '微软雅黑', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    .menus {
        height: 20px;
        list-style: none;
        
        .menu-item {
            float: left;

            :not(first) {
                margin-left: 10px;
            }

            :hover {
                color: black;
            }
        }
    }
</style>
