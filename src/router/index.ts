import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Login from '../components/Login.vue'
import App from "@/App.vue";
Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'App',
    component: App
  }
]

const router = new VueRouter({
  routes,
  mode: 'history',
  base: process.env.BASE_URL
})

export default router
