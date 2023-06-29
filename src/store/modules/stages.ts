import axios from 'axios';
import _ from "lodash";
import Vue from "vue";

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
    ID: number,
    all: Stage[],
    totalPages: number,
    totalElements: number
}

export const stages =  {
    namespaced: true,
state: {
    ID: -1,
    all: [] as Stage[],
    totalPages: 0,
    totalElements: 0
} as State,

getters:  {
},

mutations: {
    SET_STAGES(  state: State,data: {content: [], contractId: number, pages: number, elements: number}) {
        console.log(data)
        state.all = [];
        state.all = data.content;
        state.ID = data.contractId;
        state.totalPages = data.pages;
        state.totalElements = data.elements;
    },
    SET_STAGE: (state: State, data: Stage) => {
        state.all.push(data)
    },
    PUT_STAGE(state: State, data: Stage){
         const stage = _.find(state.all, {id: data.id})
         if (stage != null) Vue.set(state.all, state.all.indexOf(stage), data)
    },
    DELETE_STAGE(state: State, data: number){
        state.all = state.all.filter(stg => stg.id !== data);
    },
    CLEAR_AFTER_ADDING(state: State){
        state.all =[] as Stage[]
    },
    DELETE_UNSAVED_CONTRACT_STAGE(state: State, item: Stage){
        state.all = state.all.filter(stg => stg.name !== item.name);
    },
    PUT_STAGE_BEFORE_ADDING(state: State, item: {oldValueIndex: number, newValue: Stage}){
        const stage = state.all[item.oldValueIndex]
        Vue.set(state.all, state.all.indexOf(stage), item.newValue)
    }

},

actions: {

    allStages({commit}: any, data: {contractId: number, page?: number, size?: number}){
        return new Promise((resolve, reject) => {
            console.log(data);
            const contractId = data.contractId;
            const data1 = (data.page==null && data.size==null)? {} : {page: data.page, size: data.size}
            axios( {url: 'http://localhost:8080/api/user/contracts/'+ contractId + '/contract-stages/search', data: data1,
                withCredentials: true, method: "POST" })
                .then(resp => {
                    const content = resp.data.content;
                    const pages = resp.data.totalPages;
                    const elements = resp.data.totalElements;
                    console.log(resp.data);
                    commit('SET_STAGES', {content: content, contractId: contractId, pages: pages, elements: elements});
                    resolve(resp)
                })
                .catch(err => {
                    console.log(err)
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
                    reject(err)
                })
        })
    },
    putStage({commit}: any, data: Stage) {
        return new Promise((resolve, reject) => {
            console.log(data);
            // @ts-ignore
            const id = data["id"];
            axios( {url: 'http://localhost:8080/api/admin/contract-stages/' + id, data: data,
                withCredentials: true, method: "PUT" })
                .then(resp => {
                    console.log(resp.data);
                    commit('PUT_STAGE', data);
                    resolve(resp)
                })
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
        })
    },
    deleteStage({commit}: any, data: number) {
        return new Promise((resolve, reject) => {
            console.log(data);
            axios( {url: 'http://localhost:8080/api/admin/contract-stages/' + data, data: {},
                withCredentials: true, method: "DELETE" })
                .then(resp => {
                    console.log(resp.data);
                    commit('DELETE_STAGE', data);
                    resolve(resp)
                })
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
        })
    },
    allStagesAdmin({commit}: any, data: {contractId: number, page?: number, size?: number}){
        return new Promise((resolve, reject) => {
            console.log(data);
            const contractId = data.contractId;
            const data1 = (data.page==null && data.size==null)? {} : {page: data.page, size: data.size}
            axios( {url: 'http://localhost:8080/api/admin/contracts/'+ contractId + '/contract-stages/search', data: data1,
                withCredentials: true, method: "POST" })
                .then(resp => {
                    const content = resp.data.content;
                    const pages = resp.data.totalPages;
                    const elements = resp.data.totalElements;
                    console.log(resp.data);
                    commit('SET_STAGES', {content: content, contractId: contractId, pages: pages, elements: elements});
                    resolve(resp)
                })
                .catch(err => {
                    console.log(err)
                    reject(err)
                })
        })
    },
}
}
