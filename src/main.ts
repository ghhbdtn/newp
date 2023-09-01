import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import VueSimpleAlert from "vue-simple-alert";
// @ts-ignore
import {VueMaskDirective} from 'v-mask'
import axios from "axios";

axios.defaults.baseURL = 'http://' + location.hostname + ':8080'

Vue.directive('mask', VueMaskDirective);

Vue.config.productionTip = false

Vue.use(VueSimpleAlert);

new Vue({
    vuetify,
    router,
    store,
    render: (h) => h(App)
}).$mount('#app');
