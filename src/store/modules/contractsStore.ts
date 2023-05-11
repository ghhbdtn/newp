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
interface Contract {
    id?: number,
    name: string,
    type: string,
    amount: number,
    plannedStartDate: string,
    plannedEndDate: string,
    actualStartDate: string,
    actualEndDate: string,
    user?: User,
    userId?: number
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

interface CounterContract {
    id?: number,
    name: string,
    type: string,
    amount: number,
    plannedStartDate: string,
    plannedEndDate: string,
    actualStartDate: string,
    actualEndDate: string,
    counterpartyOrganizationId: number
}

interface State {
    all: Contract[],
    allStages: Stage[],
    allCounterContracts: CounterContract[]
}


const state = {
    all: [] as Contract[],
    allStages: [] as Stage[],
    allCounterContracts: [] as CounterContract[]
} as State;

const getters =  {

}

const mutations = {
    SET: (state: State, content: []) =>{
        console.log(content, state.all)
        //state.all = [];
        state.all = content;
    },
    SET_CONTRACT: (state: State, data: any) => {
        state.all.push(data)
    },
    SET_STAGES(state: State,content: []) {
        console.log(content)
        state.allStages = [];
        state.allStages = content;
        console.log(state.all)
    },
    SET_STAGE(  state: State,data: Stage) {
        state.allStages.push(data)
    },
    SET_COUNTER_CONTRACT(state: State,content: []) {
        state.allCounterContracts = content
    }
};

const actions = {
    getAll({commit}: any, data: {}){
        return new Promise((resolve, reject) => {
            //const data1 = {};

            console.log(data);
            axios( {url: 'http://localhost:8080/api/user/contracts/search', data: data,
                withCredentials: true, method: "POST" })
                .then(resp => {
                    const content = resp.data.content;
                    console.log(resp.data);
                    commit('SET', content);
                    resolve(resp)
                })
                .catch(err => {
                    console.log(err)
                    //commit('ERR')
                    reject(err)
                })
        })
    },
    addNew({commit}: any, data: {}){
        return new Promise((resolve, reject) => {
            //const data1 = {};

            console.log(data);
            axios( {url: 'http://localhost:8080/api/admin/contracts', data: data,
                withCredentials: true, method: "POST" })
                .then(resp => {
                    const content = resp.data.content;
                    commit('SET_CONTRACT', data);
                    resolve(resp)
                })
                .catch(err => {
                    console.log(err)
                    //commit('ERR')
                    reject(err)
                })
        })
    },
    putContract({commit}: any, data: {}){
        return new Promise((resolve, reject) => {
            //const data1 = {};
            // @ts-ignore
            const id = data['id']
            console.log(data);
            axios( {url: 'http://localhost:8080/api/admin/contracts/' + id, data: data,
                withCredentials: true, method: "PUT" })
                .then(resp => {
                    const content = resp.data.content;
                    commit('SET_CONTRACT', data);
                    resolve(resp)
                })
                .catch(err => {
                    console.log(err)
                    //commit('ERR')
                    reject(err)
                })
        })
    },
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
    addStage({commit}: any, data: Stage) {
        return new Promise((resolve, reject) => {
            console.log(data);
            // @ts-ignore
            const contractId = data["contractID"];
            axios( {url: 'http://localhost:8080/api/admin/contracts/'+ contractId + '/contract-stages', data: data,
                withCredentials: true, method: "POST" })
                .then(resp => {
                    console.log(resp.data);
                    commit('SET_STAGE', data);
                    resolve(resp)
                })
                .catch(err => {
                    console.log(err)
                    //commit('ERR')
                    reject(err)
                })
        })
    },
    allCounterpartyContracts({commit}: any, data: number){
        return new Promise((resolve, reject) => {
            console.log(data);
            const contractId = data;
            axios( {url: 'http://localhost:8080/api/user/contracts/'+ contractId + '/counterparty-contracts/search', data: {},
                withCredentials: true, method: "POST" })
                .then(resp => {
                    const content = resp.data.content;
                    console.log(resp.data);
                    commit('SET_COUNTER_CONTRACT', content);
                    resolve(resp)
                })
                .catch(err => {
                    console.log(err)
                    //commit('ERR')
                    reject(err)
                })
        })
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
