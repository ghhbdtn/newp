import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Menu from "@/pages/menu/Menu.vue";
import Contracts from "@/pages/components/Contracts.vue";
import CounterpartyOrganizations from "@/pages/components/CounterpartyOrganizations.vue";
import Reports from "@/pages/components/Reports.vue";
import Administration from "@/pages/components/Administration.vue"


Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/menu',
    name: 'menu',
    component: Menu
  },
  {
    path: '/menu/contracts',
    name: 'contracts',
    component: Contracts
  },
  {
    path: '/menu/counterparty_organizations',
    name: 'organizations',
    component: CounterpartyOrganizations
  },
  {
    path: '/menu/reports',
    name: 'reports',
    component: Reports
  },
  {
    path: '/menu/admin',
    name: 'admin',
    component: Administration
  }

]

const router = new VueRouter({
  routes,
  mode: 'history',
  base: process.env.BASE_URL
})

export default router
