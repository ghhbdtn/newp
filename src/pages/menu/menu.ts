import Vue from 'vue'

import Menu from "@/pages/menu/Menu.vue";
import vuetify from "@/plugins/vuetify";
import router from "@/pages/router";
// @ts-ignore
import store from '@/store'
// @ts-ignore
import { VueMaskDirective } from 'v-mask'
import {contractsStore} from "@/store/modules/contractsStore";
import {stages} from "@/store/modules/stages";
import {counterContracts} from "@/store/modules/counterContracts";
import {counterparties} from "@/store/modules/counterparties";
import {reports} from "@/store/modules/reports";
Vue.directive('mask', VueMaskDirective);

Vue.config.productionTip = false
// @ts-ignore
import VueSimpleAlert from "vue-simple-alert";

// @ts-ignore
Vue.use(VueSimpleAlert);


 new Vue({
  el: '#menu',
  vuetify,
  router,
  store,
  created() {
   this.$store.registerModule('contractsStore', contractsStore)
   this.$store.registerModule('stages', stages)
   this.$store.registerModule('counterContracts', counterContracts)
   this.$store.registerModule('counterparties', counterparties)
   this.$store.registerModule('reports', reports)
  },
  render: h => h(Menu)
}).$mount('#menu')
