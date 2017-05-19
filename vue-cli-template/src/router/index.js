import Vue from 'vue';
import Router from 'vue-router';

import Hello from '@/components/Hello';
import Foo from '@/components/Foo';

Vue.use(Router);

export default new Router({
    routes: [{
        path: '/hello',
        component: Hello,
    }, {
        path: '/foo',
        component: Foo,
    }],
});
