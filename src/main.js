import Vue from 'vue'
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
    Loading
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// import fonts
import './assets/fonts/index.css'

// import axios & vue-axios
import axios from 'axios'
import VueAxios from 'vue-axios'
// use axois & vue-axios
Vue.use(VueAxios, axios)

Vue.use(Button)
Vue.use(Dialog)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Select)
Vue.use(Option)
Vue.prototype.$loading = Loading
Vue.prototype.$message = Message
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt

Vue.prototype.$httpRequestList = [];    //管理所有请求中断方法的集合

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
