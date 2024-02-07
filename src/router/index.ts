import { Router,createRouter, createWebHistory } from 'vue-router'
import type {RouteRecordRaw}  from "vue-router";
const routes:readonly RouteRecordRaw[] = [
  {
    path: '/',
    redirect: "/login",
    component: import('@/views/IndexPage.vue'),
    children:[
      {
        path:'home',
        name:'home',
        component:import('@/views/HomePage.vue'),
      },
      {
        path:'manage',
        name:'manage',
        component:import('@/views/DataManager.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: import('@/views/LoginPage.vue'),
  },

]
const router:Router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to,from,next)=>{
  const isTokenExist=localStorage.getItem("token");
  const isToLogin=(to.path==='/login')
  if(!isTokenExist && isToLogin){
    next()
  }else if(!isTokenExist && !isToLogin){
    router.replace("/login")
  }else{
    next();
  }
})
export default router
