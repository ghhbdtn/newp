import axios from 'axios';
import _ from "lodash";
import users from "@/store/modules/users";

interface User {
    id: number,
    login: string,
    fullName: string,
    terminationDate: string,
    isAdmin: boolean
}
interface Stage {
    id?: number,
    name: string,
    amount: number,
    plannedStartDate: string,
    plannedEndDate: string,
    actualStartDate: string,
    actualEndDate: string,
    actualMaterialCosts: number,
    plannedMaterialCosts: number,
    actualSalaryExpenses: number,
    plannedSalaryExpenses: number
}

interface State {
    //contractID: number,
    all: Stage[]
}


export default {
    namespaced: true,
state: {
    //contractID: 0,
    all: [] as Stage[]
} as State,

getters:  {

},

mutations: {
    SET_STAGES(  state: State,content: Stage[]) {
        console.log(content)
        state.all = [];
        state.all = content;
        console.log(state.all)
    },
    SET_STAGE: (state: State, data: any) => {
        state.all.push(data)
    }
},

actions: {
    allStages({commit}: any, data: number){
        return new Promise((resolve, reject) => {
            console.log(data);
            const contractId = data;
            axios( {url: 'http://localhost:8080/api/user/contracts/'+ contractId + '/contract-stages/search', data: {},
                withCredentials: true, method: "POST" })
                .then(resp => {
                    const content = resp.data.content;
                    console.log(resp.data);
                    commit('SET_STAGES', content);
                    resolve(resp)
                })
                .catch(err => {
                    console.log(err)
                    //commit('ERR')
                    reject(err)
                })
        })
    },
    addNewStage({commit}: any, data: {}){
        return new Promise((resolve, reject) => {
            //const data1 = {};

            console.log(data);
            axios( {url: 'http://localhost:8080/api/admin/contracts', data: data,
                withCredentials: true, method: "POST" })
                .then(resp => {
                    const content = resp.data.content;
                    commit('SET_STAGE', data);
                    resolve(resp)
                })
                .catch(err => {
                    console.log(err)
                    //commit('ERR')
                    reject(err)
                })
        })
    }
}

// export default {
//     namespaced: true,
//     state,
//     getters,
//     mutations,
//     actions
}
