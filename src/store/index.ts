import Vue from 'vue'
import Vuex from 'vuex'
import users from "@/store/modules/users";
import {plug} from "@/store/plug"
import {contractsStore} from "@/store/modules/contractsStore";
import {counterContracts} from "@/store/modules/counterContracts";
import {counterparties} from "@/store/modules/counterparties";
import {reports} from "@/store/modules/reports";
import {stages} from "@/store/modules/stages";

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        users,
        contractsStore,
        counterContracts,
        counterparties,
        reports,
        stages
    },
    plugins: [plug]
})
