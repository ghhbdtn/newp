import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Login from '../components/Login.vue'
import Contracts from "@/pages/components/Contracts.vue";
import CounterpartyOrganizations from "@/pages/components/CounterpartyOrganizations.vue";
import Reports from "@/pages/components/Reports.vue";
import Administration from "@/pages/components/Administration.vue";
import AdminRoot from "@/pages/components/AdminRoot.vue";
import UsersPage from "@/pages/components/UsersPage.vue";
import App from "@/App.vue"
import Register from '../components/Register.vue'
import Menu from '../pages/menu/Menu.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'login',
    component: Login
  }
  ,
  {
    path: '/menu',
    name: 'menu',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Menu
  },
  {
    path: '/menu/contracts',
    name: 'contracts',
    component: Contracts,
    meta: {
      breadcrumb: 'Договоры'
    }
  },
  {
    path: '/menu/counterparty-organizations',
    name: 'organizations',
    component: CounterpartyOrganizations,
    meta: {
      breadcrumb: 'Организации-контрагенты'
    }
  },
  {
    path: '/menu/reports',
    name: 'reports',
    component: Reports,
    meta: {
      breadcrumb: 'Отчеты'
    }
  },
  {
    path: '/menu/admin-root',
    name: 'admin-root',
    component: AdminRoot,
  },
  {
    path: "/menu/admin-root/users",
    name: "allUsers",
    component: UsersPage,
    meta: {
      breadcrumb: 'Пользователи'
    }
  },
  {
    path: "/menu/admin-root/all-contracts",
    name: "all-contracts",
    component: Administration,
    meta: {
      breadcrumb: 'Список всех договоров'
    }
  }
]

const router = new VueRouter({
  routes,
  mode: 'history',
  base: process.env.BASE_URL
})

export default router
