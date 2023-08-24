import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import App from "@/App.vue";
import Menu from "@/pages/menu/Menu.vue";
import Contracts from "@/pages/components/Contracts.vue";
import CounterpartyOrganizations from "@/pages/components/CounterpartyOrganizations.vue";
import Reports from "@/pages/components/Reports.vue";
import UsersPage from "@/pages/components/UsersPage.vue";
import Administration from "@/pages/components/Administration.vue";
import store from '@/store'
import {Store} from "vuex";
Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'App',
    component: App
  },
  {
    path: '/menu',
    name: 'menu',
    component: Menu,
    children: [
      {
        path: '/menu/contracts',
        name: 'contracts',
        component: Contracts,
      },
      {
        path: '/menu/counterparty-organizations',
        name: 'organizations',
        component: CounterpartyOrganizations,
      },
      {
        path: '/menu/reports',
        name: 'reports',
        component: Reports,
      },
      {
        path: "/menu/admin-root/users",
        name: "allUsers",
        component: UsersPage,
      },
      {
        path: "/menu/admin-root/all-contracts",
        name: "all-contracts",
        component: Administration,
      }
    ]
  },
]

const router = new VueRouter({
  routes,
  mode: 'history',
  base: process.env.BASE_URL
})



export default router
