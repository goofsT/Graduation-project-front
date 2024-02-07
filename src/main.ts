import { createApp, readonly } from "vue";
import {createPinia} from "pinia";
import './style.css'
import 'virtual:svg-icons-register'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from '@/App.vue'
import router from '@/router/index.ts'
import '@/assets/icon/iconfont.css'
import Particles from "particles.vue3"
import $api from '@/api/index.ts'
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(Particles)
app.use(ElementPlus)
app.use(router)
app.provide('$api', readonly($api))
app.mount('#app')
