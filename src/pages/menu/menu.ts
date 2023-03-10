import Vue from 'vue'

import Menu from "@/pages/menu/Menu.vue";
import vuetify from "@/plugins/vuetify";
import router from "@/pages/router";
import store from "@/store";
import VueTableDynamic from 'vue-table-dynamic'

Vue.config.productionTip = false
//Vue.use(VueTableDynamic)
 new Vue({
  el: '#menu',
  vuetify,
  router,
  store,
  render: h => h(Menu)
}).$mount('#menu')
