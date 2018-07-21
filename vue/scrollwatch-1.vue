<!--
Home: https://github.com/Desdesdesgo/vue-scrollwatch
Usage:
    1. import vueScrollwatch from "vue-scrollwatch";
    2. Vue.use(vueScrollwatch);
    3. Vue.prototype.$scrollWatch = vueScrollwatch;
    4. 必须在 created() 中执行初始化语句: this.$scrollWatch.setContainer("#scroller")
-->
<template>
    <div class="main">
        <!-- 菜单栏 -->
        <ul class="menu">
            <li class="menu-item">
                <a :class="{ active: activeMenuItem == 'a' }" @click="scrollTo('a')">Section 1</a>
            </li>
            <li class="menu-item">
                <a :class="{ active: activeMenuItem == 'b' }" @click="scrollTo('b')">Section 2</a>
            </li>
            <li class="menu-item">
                <a :class="{ active: activeMenuItem == 'c' }" @click="scrollTo('c')">Section 3</a>
            </li>
            <li class="menu-item">
                <a :class="{ active: activeMenuItem == 'd' }" @click="scrollTo('d')">Section 4</a>
            </li>
        </ul>

        <!-- 滚动区 -->
        <div id="scroller">
            <div v-scrollWatch="{ name: 'a', offset: 0, callback: sectionChanged }" class="section section-a"><h1>section 1</h1></div>
            <div v-scrollWatch="{ name: 'b', offset: 0, callback: sectionChanged }" class="section section-b"><h1>section 2</h1></div>
            <div v-scrollWatch="{ name: 'c', offset: 0, callback: sectionChanged }" class="section section-c"><h1>section 3</h1></div>
            <div v-scrollWatch="{ name: 'd', offset: 0, callback: sectionChanged }" class="section section-d"><h1>section 4</h1></div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            activeMenuItem: 'a'
        }
    },
    created(){
        this.$scrollWatch.setContainer("#scroller");
    },
    methods: {
        sectionChanged(node) {
            if (this.activeMenuItem != node.name) {
                this.activeMenuItem = node.name;
            }
        },
        scrollTo(name) {
            this.$scrollWatch.scrollTo(name);
        }
    }
}
</script>

<style lang="scss" scoped>
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
        margin-top: 200px;
    }
}

.menu {
    .menu-item {
        a {
            text-decoration: none;
            color: black;

            &.active {
                color: white;
                background: gray;
            }
        }
    }
}

#scroller {
    position: relative;
    overflow: auto;
    height: 300px;
    border: 1px solid gray;

    .section {
        height: 1000px;
        text-align: center;

        &.section-a {
            background: #67C23A
        }

        &.section-b {
            background: #E6A23C
        }

        &.section-c {
            background: #909399
        }

        &.section-d {
            background: #F56C6C
        }
    }
}
</style>
