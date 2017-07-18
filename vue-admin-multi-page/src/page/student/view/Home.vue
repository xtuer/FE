<template>
    <div class="container">
        <!-- 侧边导航栏 -->
        <div class="sidebar">
            <el-menu :default-active="$route.path" router theme="dark">
                <el-submenu index="1">
                    <template slot="title"><i class="el-icon-message"></i>信息管理</template>
                    <el-menu-item index="/users">用户</el-menu-item>
                    <el-menu-item index="/hello">Hello</el-menu-item>
                    <el-menu-item index="1-3">选项3</el-menu-item>
                    <el-menu-item index="1-4-1">选项1</el-menu-item>
                </el-submenu>
                <el-menu-item index="2"><i class="el-icon-menu"></i>导航二</el-menu-item>
                <el-menu-item index="3"><i class="el-icon-setting"></i>导航三</el-menu-item>
            </el-menu>
        </div>

        <!-- 主体部分 -->
        <div class="main">
            <!-- 头部 -->
            <el-row class="header" type="flex" justify="space-between">
                <el-col :span="10" class="logo"></el-col>
                <el-col :span="4" class="userinfo">
                    <el-dropdown trigger="hover">
                        <span class="el-dropdown-link userinfo-inner"><img class="avatar" :src="avatar">{{username}}</span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>消息</el-dropdown-item>
                            <el-dropdown-item>设置</el-dropdown-item>
                            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-row>

            <!-- 内容区 -->
            <el-row>
                <el-col :span="24" class="content">
                    <transition name="fade" mode="out-in">
                        <router-view></router-view>
                    </transition>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                systemName: '管理系统',
                username: '公孙二狗',
                avatar: '/static/img/avatar.jpg'
            };
        },
        methods: {
            // 退出登录
            logout() {
                this.$confirm('确认退出吗?', '提示', {}).then(() => {}).catch(() => {});
            }
        }
    };
</script>

<style lang="scss">
    $sidebarWidth: 200px; // 侧边栏的宽
    $headerHeight: 30px; // 头部的高

    .container {
        display: flex;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;

        .sidebar {
            width: $sidebarWidth;
            left: 0;
            top: 0;
            bottom: 0;
            background: #334156;
            overflow: auto;
        }

        .main {
            overflow: hidden;
            flex: 1;

            .header {
                display: flex;
                height: $headerHeight;
                line-height: $headerHeight;
                padding: 0 10px;
                margin-bottom: 0;
                background: #334156;

                .userinfo {
                    text-align: right;
                    
                    .userinfo-inner {
                        cursor: pointer;
                        color: #BDC9D6;
                        font-size: 12px;
                        .avatar {
                            width: 20px;
                            height: 20px;
                            border-radius: 20px;
                            margin: 5px 0 0px 5px;
                            float: right;
                            box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
                        }
                    }
                }
            }

            .content {
                padding: 10px;
            }
        }
    }
</style>
