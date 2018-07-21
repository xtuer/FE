<!--
Home: https://rigor789.github.io/vue-scrollto/#/docs?id=onstart
Usage:
    1. npm install --save vue-scrollto
    2. import VueScrollTo from "vue-scrollto";
    3. Vue.use(VueScrollTo);
-->
<template>
    <div class="main">
        <!-- <ul class="menu">
            <li v-scroll-to="{ el: '#a', container: '#scroller' }" class="menu-item"><a>Scroll to #a</a></li>
            <li v-scroll-to="{ el: '#b', container: '#scroller' }" class="menu-item"><a>Scroll to #b</a></li>
            <li v-scroll-to="{ el: '#c', container: '#scroller' }" class="menu-item"><a>Scroll to #c</a></li>
            <li v-scroll-to="{ el: '#d', container: '#scroller' }" class="menu-item"><a>Scroll to #d</a></li>
        </ul>
        <div id="scroller" style="margin-top: 110px;">
            <div id="a" class="section">scetcion a</div>
            <div id="b" class="section">scetcion b</div>
            <div id="c" class="section">scetcion c</div>
            <div id="d" class="section">scetcion d</div>
        </div> -->

        <ul class="menu">
            <li v-scroll-to="{ el: `#${section.id}`, container: '#scroller' }" v-for="section in sections" :key="section.id" class="menu-item" @click="activateMenuItem">
                <a>Scroll to #{{ section.label }}</a>
            </li>
        </ul>
        <div id="scroller" style="margin-top: 110px;">
            <div v-for="section in sections" :id="section.id" :key="section.id" class="section">
                scetcion {{ section.label }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            sections: [
                { id: 'a', label: 'a' },
                { id: 'b', label: 'b' },
                { id: 'c', label: 'c' },
                { id: 'd', label: 'd' },
            ]
        };
    },
    methods: {
        activateMenuItem(event) {
            // 去掉所有 class active，然后当前点击的菜单项加上 class active
            $(event.target).closest('.menu').find('.menu-item').removeClass('active');
            $(event.target).closest('.menu-item').addClass('active');
        }
    }
}
</script>

<style lang="scss">
// 全局样式
body, html {
    padding: 0;
    margin: 0;
    width: 100vw;
    height: 100vh;
}

// 布局
.main {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: stretch;

    .menu {
        width: 200px;
    }

    #scroller {
        flex: 1;
    }
}

.menu {
    .menu-item {
        &.active {
            background: gray;
            a {
                color: white;
            }
        }
        a {
            text-decoration: none;
            color: black;
        }
    }
}

#scroller {
    position: relative;
    overflow: auto;
    height: 300px;
    border: 1px solid gray;

    .section {
        height: 400px;
        border: 1px dashed red;
    }
}
</style>
