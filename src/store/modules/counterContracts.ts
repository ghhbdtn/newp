import axios from 'axios';
import _ from "lodash";
import Vue from "vue";
import {serverUrl} from "@/store/hostNameVar";

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
            if (countercontract != null)
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
        PUT_COUNTER_CONTRACT_BEFORE_ADDING(state: State, data: {oldValueIndex: number, newValue: CounterContract}){
            const countercontract = state.allCounterContracts[data.oldValueIndex]
            Vue.set(state.allCounterContracts, state.allCounterContracts.indexOf(countercontract), data.newValue)
        },

    },

    actions: {
        allCounterpartyContracts({commit}: any, data: {contractId: number, page?: number, size?: number}){
            return new Promise((resolve, reject) => {
                console.log(data);
                const contractId = data.contractId;
                const data1 = (data.page==null && data.size==null)? {} : {page: data.page, size: data.size}
                axios( {url: serverUrl + '/api/user/contracts/'+ contractId + '/counterparty-contracts/search', data: data1,
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
                        reject(err)
                    })
            })
        },
        addCounterpartyContract({commit}: any, data: CounterContract){
            return new Promise((resolve, reject) => {
                console.log(data);
                // @ts-ignore
                const contractId = data['contractID'];
                axios( {url: serverUrl + '/api/admin/contracts/'+ contractId + '/counterparty-contracts', data: data,
                    withCredentials: true, method: "POST" })
                    .then(resp => {
                        console.log(resp.data);
                        commit('SET_COUNTER_CONTRACT', data);
                        resolve(resp)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        putCounterContract({commit}: any, data: CounterContract){
            return new Promise((resolve, reject) => {
                console.log(data);
                // @ts-ignore
                const id = data['id'];
                axios( {url: serverUrl + '/api/admin/counterparty-contracts/'+ id, data: data,
                    withCredentials: true, method: "PUT" })
                    .then(resp => {
                        console.log(resp.data);
                        commit('PUT_COUNTER_CONTRACT', data);
                        resolve(resp)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        deleteCounterContract({commit}: any, data: number) {
            return new Promise((resolve, reject) => {
                console.log(data);
                axios( {url: serverUrl + '/api/admin/counterparty-contracts/' + data, data: {},
                    withCredentials: true, method: "DELETE" })
                    .then(resp => {
                        console.log(resp.data);
                        commit('DELETE_COUNTER_CONTRACT', data);
                        resolve(resp)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        allAdminCounterpartyContracts({commit}: any, data: {contractId: number, page?: number, size?: number}){
            return new Promise((resolve, reject) => {
                console.log(data);
                const contractId = data.contractId;
                const data1 = (data.page==null && data.size==null)? {} : {page: data.page, size: data.size}
                axios( {url:  serverUrl + '/api/admin/contracts/'+ contractId + '/counterparty-contracts/search', data: data1,
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
                        reject(err)
                    })
            })
        },
    },
}
