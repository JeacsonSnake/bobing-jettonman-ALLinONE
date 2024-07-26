import * as Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {
  Button,
  Dialog,
  Table,
  TableColumn,
  Select,
  Option,
  Message,
  MessageBox,
  Loading,
  Tooltip,
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// import fonts
import './assets/fonts/index.css'

// import axios & vue-axios
import axios from 'axios'
import VueAxios from 'vue-axios'
// use axois & vue-axios
window.$vueApp.use(VueAxios, axios)

window.$vueApp.use(Button)
window.$vueApp.use(Dialog)
window.$vueApp.use(Table)
window.$vueApp.use(TableColumn)
window.$vueApp.use(Select)
window.$vueApp.use(Option)
window.$vueApp.use(Tooltip)
window.$vueApp.config.globalProperties.$elLoading = Loading
window.$vueApp.config.globalProperties.$message = Message
window.$vueApp.config.globalProperties.$alert = MessageBox.alert
window.$vueApp.config.globalProperties.$confirm = MessageBox.confirm
window.$vueApp.config.globalProperties.$prompt = MessageBox.prompt

window.$vueApp.config.globalProperties.$httpRequestList = [] //管理所有请求中断方法的集合

window.$vueApp = Vue.createApp(App)
window.$vueApp.mount('#app')
window.$vueApp.config.globalProperties.routerAppend = (path, pathToAppend) => {
  return path + (path.endsWith('/') ? '' : '/') + pathToAppend
}
window.$vueApp.use(store)
window.$vueApp.use(router)
