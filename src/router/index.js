import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../pages/Login.vue'
import VueBus from 'vue-bus'
import { api_token } from "../apis/apis";

// 全局注册
Vue.use(VueRouter)
Vue.use(VueBus)
// 配置路由
var router = new VueRouter({
    routes: [
        // 配置一级路由
        // 登录
        {
            path: '/',
            name: 'login',
            component: Login
        },

        // 导航页 动态懒加载
        {
            path: '/nav',
            name: 'nav',
            // 动态懒加载
            component: () => import('../pages/Nav'),
            // 导航的二级路由
            children: [
                // 导航--首页
                {
                    path: '/nav/index',
                    name: 'index',
                    component: () => import('../pages/nav/Index')
                },
                // 导航--订单管理
                {
                    path: '/nav/order',
                    name: '/nav/order',
                    component: () => import('../pages/nav/Order')
                },
                // 导航--商品列表
                {
                    path: '/nav/itemlist',
                    name: '/nav/itemlist',
                    component: () => import('../pages/nav/ItemList')
                },
                // 导航--商品添加
                {
                    path: '/nav/itemadd',
                    name: '/nav/itemadd',
                    component: () => import('../pages/nav/ItemAdd')
                },
                // 导航--商品分类
                {
                    path: '/nav/itemsort',
                    name: '/nav/itemsort',
                    component: () => import('../pages/nav/ItemSort')
                },
                // 导航--店铺管理
                {
                    path: '/nav/store',
                    name: '/nav/store',
                    component: () => import('../pages/nav/Store')
                },
                // 导航--账号列表
                {
                    path: '/nav/accountlist',
                    name: '/nav/accountlist',
                    component: () => import('../pages/nav/AccountList')
                },
                // 导航--添加账号
                {
                    path: '/nav/accountadd',
                    name: '/nav/accountadd',
                    component: () => import('../pages/nav/AccountAdd')
                },
                // 导航--修改密码
                {
                    path: '/nav/revisepassword',
                    name: '/nav/revisepassword',
                    component: () => import('../pages/nav/RevisePassword')
                },

                // 导航--商品统计
                {
                    path: '/nav/statistics',
                    name: '/nav/statistics',
                    component: () => import('../pages/nav/Statistics')
                },
                // 导航--订单统计
                {
                    path: '/nav/orderSta',
                    name: '/nav/orderSta',
                    component: () => import('../pages/nav/OrderSta')
                },

                // 修改头像
                {
                    path: '/nav/personinfo',
                    name: '/nav/personinfo',
                    component: () => import('../pages/nav/PersonInfo')
                },
            ]
        },

    ]
})

// 设置全局路由拦截
router.beforeEach((to, from, next) => {
    from
    if (to.path != '/') {
        api_token({params:{token: localStorage.token}}).then(res=>{
        // 已经登录过了，并在登录状态，放行
        if(res.data.code ==0){
            next()
        }else{
           next('/')
        }
           
        })

    }else
        next()
})

export default router

