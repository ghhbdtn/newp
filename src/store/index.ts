import Vue from 'vue'
import Vuex from 'vuex'
import users from "@/store/modules/users";
import {plug} from "@/store/plug.js"
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    users
  },

  plugins: [plug]
})
