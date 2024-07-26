import * as Vue from 'vue'
import * as VueRouter from 'vue-router'
import HomePage from '../views/HomePage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  //   {
  //     path: '/about',
  //     name: 'about',
  //     // route level code-splitting
  //     // this generates a separate chunk (about.[hash].js) for this route
  //     // which is lazy-loaded when the route is visited.
  //     component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  //   }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: routes,
})

router.beforeEach((to, from, next) => {
  if (window.$vueApp.config.globalProperties.$httpRequestList.length > 0) {
    // 检查是否有需要中断的请求
    window.$vueApp.config.globalProperties.$httpRequestList.forEach((item) => {
      // 遍历,执行中断方法并传入中断信息
      item('interrupt')
    })
  }

  next()
})

export default router
