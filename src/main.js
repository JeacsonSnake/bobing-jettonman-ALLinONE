import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import fonts
import './assets/fonts/index.css'

// import axios & vue-axios
import axios from 'axios'
import VueAxios from 'vue-axios'
// use axois & vue-axios
Vue.use(VueAxios, axios)

Vue.prototype.$httpRequestList = [];    //管理所有请求中断方法的集合

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
