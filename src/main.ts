import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
// @ts-ignore
import { VueMaskDirective } from 'v-mask'
Vue.directive('mask', VueMaskDirective);

Vue.config.productionTip = false

import VueSimpleAlert from "vue-simple-alert";
import {Store} from "vuex";


Vue.use(VueSimpleAlert);

  new Vue({
    vuetify,
    router,
    store,
    render: (h) => h(App)
  }).$mount('#app');

