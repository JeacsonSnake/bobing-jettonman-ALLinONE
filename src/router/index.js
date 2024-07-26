import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../views/HomePage.vue'

Vue.use(VueRouter)

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

const router = new VueRouter({
  routes,
})

router.beforeEach((to, from, next) => {
  if (Vue.prototype.$httpRequestList.length > 0) {
    // 检查是否有需要中断的请求
    Vue.prototype.$httpRequestList.forEach((item) => {
      // 遍历,执行中断方法并传入中断信息
      item('interrupt')
    })
  }

  next()
})

export default router
