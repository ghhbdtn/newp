import axios from 'axios';
import _ from "lodash";
import users from "@/store/modules/users";
import Vue from "vue";

interface User {
    id: number,
    login: string,
    fullName: string,
    terminationDate: string,
    isAdmin: boolean
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
    allCounterContracts: CounterContract[]
}

export const  counterContracts = {
    namespaced: true,
    state: {
        allCounterContracts: [] as CounterContract[]
    } as State,

    getters: {
    },
    mutations: {
        SET_COUNTER_CONTRACTS(state: State,content: []) {
            state.allCounterContracts = content
        },
        SET_COUNTER_CONTRACT: (state: State, data: CounterContract) => {
            state.allCounterContracts.push(data)
        },
        PUT_COUNTER_CONTRACT(state: State, data: CounterContract){
            const countercontract = _.find(state.allCounterContracts, {id: data.id})
            // @ts-ignore
            Vue.set(state.allCounterContracts, state.allCounterContracts.indexOf(countercontract), data)
        },
        DELETE_COUNTER_CONTRACT(state: State, data: number){
            state.allCounterContracts = state.allCounterContracts.filter(cct => cct.id !== data);
        },
        CLEAR_AFTER_ADDING(state: State){
            state.allCounterContracts =[] as CounterContract[]
        }

    },

    actions: {
        allCounterpartyContracts({commit}: any, data: number){
            return new Promise((resolve, reject) => {
                console.log(data);
                const contractId = data;
                axios( {url: 'http://localhost:8080/api/user/contracts/'+ contractId + '/counterparty-contracts/search', data: {},
                    withCredentials: true, method: "POST" })
                    .then(resp => {
                        const content = resp.data.content;
                        console.log(resp.data);
                        commit('SET_COUNTER_CONTRACTS', content);
                        resolve(resp)
                    })
                    .catch(err => {
                        console.log(err)
                        //commit('ERR')
                        reject(err)
                    })
            })
        },
        addCounterpartyContract({commit}: any, data: number){
            return new Promise((resolve, reject) => {
                console.log(data);
                // @ts-ignore
                const contractId = data['contractID'];
                axios( {url: 'http://localhost:8080/api/admin/contracts/'+ contractId + '/counterparty-contracts', data: data,
                    withCredentials: true, method: "POST" })
                    .then(resp => {
                        const content = resp.data.content;
                        console.log(resp.data);
                        commit('SET_COUNTER_CONTRACT', data);
                        resolve(resp)
                    })
                    .catch(err => {
                        console.log(err)
                        //commit('ERR')
                        reject(err)
                    })
            })
        },
        putCounterContract({commit}: any, data: CounterContract){
            return new Promise((resolve, reject) => {
                console.log(data);
                // @ts-ignore
                const id = data['id'];
                axios( {url: 'http://localhost:8080/api/admin/counterparty-contracts/'+ id, data: data,
                    withCredentials: true, method: "PUT" })
                    .then(resp => {
                        const content = resp.data.content;
                        console.log(resp.data);
                        commit('PUT_COUNTER_CONTRACT', data);
                        resolve(resp)
                    })
                    .catch(err => {
                        console.log(err)
                        //commit('ERR')
                        reject(err)
                    })
            })
        },
        deleteCounterContract({commit}: any, data: number) {
            return new Promise((resolve, reject) => {
                console.log(data);
                axios( {url: 'http://localhost:8080/api/admin/counterparty-contracts/' + data, data: {},
                    withCredentials: true, method: "DELETE" })
                    .then(resp => {
                        console.log(resp.data);
                        commit('DELETE_COUNTER_CONTRACT', data);
                        resolve(resp)
                    })
                    .catch(err => {
                        console.log(err)
                        //commit('ERR')
                        reject(err)
                    })
            })
        },


},
}
