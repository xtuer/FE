import Vue from 'vue';
import Router from 'vue-router';

// import NotFound from '@/view/404';
// import Home  from '@/view/Home';
// import Users from '@/view/information/Users';
// import Hello from '@/view/information/Hello';

const NotFound  = resolve => require(['@/view/404'], resolve);
const Home   = resolve => require(['@/view/Home'], resolve);
const Users  = resolve => require(['@/view/information/Users'], resolve);
const Hello  = resolve => require(['@/view/information/Hello'], resolve);

Vue.use(Router);

export default new Router({
    routes: [{
        path: '/',
        component: Home,
        children: [
            // children 下的 component 会在 Home 中的 <router-view> 生成
            { path: '/users', component: Users, name: 'users' },
            { path: '/hello', component: Hello, name: 'hello' }
        ]
    }, {
        path: '/404',
        component: NotFound,
        hidden: true
    }, {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }]
});
