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
            <li v-for="section in sections" :key="section.name"
                :class="{ active: activeMenuItem == section.name }" class="menu-item"
                @click="scrollTo(section.name)">
                <a>{{ section.label }}</a>
            </li>
        </ul>

        <!-- 滚动区 -->
        <div id="scroller">
            <div v-scrollWatch="{ name: section.name, offset: 0, callback: sectionChanged }"
                v-for="section in sections"
                :key="section.name" :class="`section-${section.name}`" class="section">
                <h1>{{ section.label }}</h1>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            activeMenuItem: 'a',
            sections: [
                { name: 'a', label: 'section 1' },
                { name: 'b', label: 'section 2' },
                { name: 'c', label: 'section 3' },
                { name: 'd', label: 'section 4' },
            ]
        }
    },
    created() {
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
        // margin-top: 200px;
    }
}

.menu {
    padding: 5px;

    .menu-item {
        padding: 5px;
        border-left: 2px solid transparent;

        // 当前菜单的样式
        &.active {
            background: #f3f3f3;
            border-left-color: #178ce6;
            transition-duration: .5s;

            a {
                color: #178ce6;
            }
        }

        a {
            color: #333;
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
