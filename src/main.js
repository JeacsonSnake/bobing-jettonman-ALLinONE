import {
    createApp,
    h
} from 'vue'

import App from './App.vue'

import {
    router
} from './router'

import {
    store
} from './store'

import {
    ElButton as Button,
    ElDialog as Dialog,
    ElTable as Table,
    ElTableColumn as TableColumn,
    ElSelect as Select,
    ElOption as Option,
    ElMessage as Message,
    ElMessageBox as MessageBox,
    ElLoading as Loading,
    ElTooltip as Tooltip,
    ElLink as Link
} from 'element-plus'

import 'element-plus/theme-chalk/index.css'

// import fonts
import './assets/fonts/index.css'

const app = createApp({
    render: () => h(App)
})

// Register Element Plus components
app.use(Button)
app.use(Dialog)
app.use(Table)
app.use(TableColumn)
app.use(Select)
app.use(Option)
app.use(Tooltip)
app.use(Link)
app.use(Loading)

// Global properties
app.config.globalProperties.$message = Message
app.config.globalProperties.$alert = MessageBox.alert
app.config.globalProperties.$confirm = MessageBox.confirm
app.config.globalProperties.$prompt = MessageBox.prompt

app.config.globalProperties.$httpRequestList = [] // 管理所有请求中断方法的集合.

// Use store, and router
app.use(store)
app.use(router)

// Mount the app
app.mount('#app')