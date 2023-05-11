import Vue from 'vue'
import Vuex from 'vuex'
import users from "@/store/modules/users";
import {plug} from "@/store/plug.js"
import contractsStore from "@/store/modules/contractsStore";
import stages from "@/store/modules/stages";
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    users,
    contractsStore
  },
  plugins: [plug]
})
