import '@/styles/index.scss'
import 'element-plus/dist/index.css';
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
import router from './router' // 导入路由

import pinia from '@/store'

app.use(router).use(pinia).mount('#app')
