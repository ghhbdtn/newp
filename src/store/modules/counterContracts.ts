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
    counterpartyOrganization?: {
        id: number,
        name: string,
        address: string,
        inn: number
    },
    counterpartyOrganizationId: number
}

interface State {
    allCounterContracts: CounterContract[],
    totalPages: number,
    totalElements: number
}

export const  counterContracts = {
    namespaced: true,
    state: {
        allCounterContracts: [] as CounterContract[],
        totalPages: 0,
        totalElements: 0
    } as State,

    getters: {
    },
    mutations: {
        SET_COUNTER_CONTRACTS(state: State, data: {content: [], pages: number, elements: number}) {
            state.allCounterContracts = data.content;
            state.totalPages = data.pages;
            state.totalElements = data.elements;
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
        },
        DELETE_UNSAVED_COUNTER_CONTRACT(state: State, data: CounterContract){
            state.allCounterContracts = state.allCounterContracts.filter(cct => cct.name !== data.name);
        },

    },

    actions: {
        allCounterpartyContracts({commit}: any, data: {contractId: number, page?: number, size?: number}){
            return new Promise((resolve, reject) => {
                console.log(data);
                const contractId = data.contractId;
                const data1 = (data.page==null && data.size==null)? {} : {page: data.page, size: data.size}
                axios( {url: 'http://localhost:8080/api/user/contracts/'+ contractId + '/counterparty-contracts/search', data: data1,
                    withCredentials: true, method: "POST" })
                    .then(resp => {
                        const content = resp.data.content;
                        console.log(resp.data);
                        const pages = resp.data.totalPages;
                        const elements = resp.data.totalElements;
                        commit('SET_COUNTER_CONTRACTS', {content: content, pages: pages, elements: elements});
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
