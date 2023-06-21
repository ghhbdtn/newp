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

interface State {
    all: Contract[],
    allForAdmin: Contract[],
    totalPages: number,
    totalElements: number,
    last: boolean

}

export const  contractsStore = {
    namespaced: true,
    state: {
        all: [] as Contract[],
        allForAdmin: [] as Contract[],
        totalPages: -1,
        totalElements: -1,
        last: false
    } as State,

    getters: {
    },
    mutations: {
    SET: (state: State, obj: {items: [], numPages: number, numElements: number, last: boolean}) =>{
       // console.log(content, state.all)
        //state.all = [];
        state.all = obj.items;
        state.totalPages = obj.numPages;
        state.totalElements = obj.numElements;
        state.last = obj.last
        console.log(state.totalPages)
    },
    SET_CONTRACT: (state: State, data: any) => {
        state.all.push(data)
    },
        DELETE_CONTRACT(state: State, data: number){
            state.all = state.all.filter(ct => ct.id !== data);
        },
        PUT_CONTRACT(state: State, data: Contract){
            const contract = _.find(state.all, {id: data.id})
            // @ts-ignore
            Vue.set(state.allForAdmin, state.allForAdmin.indexOf(contract), data)
        },
        SET_ADMIN: (state: State, obj: {items: [], numPages: number, numElements: number}) =>{
            // console.log(content, state.all)
            //state.all = [];
            state.allForAdmin = obj.items;
            state.all = obj.items;
            state.totalPages = obj.numPages;
            state.totalElements = obj.numElements;
        },
},

 actions: {
    getAll({commit}: any, data: {}){
        return new Promise((resolve, reject) => {
            //const data1 = {};

            console.log(data);
            axios( {url: 'http://localhost:8080/api/user/contracts/search', data: data,
                withCredentials: true, method: "POST" })
                .then(resp => {
                    const content = resp.data.content;
                    const pages = resp.data.totalPages;
                    const elements = resp.data.totalElements;
                    const isLast = resp.data.last;
                    const obj = {
                        items: content,
                        numPages: pages,
                        numElements: elements,
                        last: isLast
                    }
                    console.log(resp.data);
                    commit('SET', obj);
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
                    commit('PUT_CONTRACT', data);
                    resolve(resp)
                })
                .catch(err => {
                    console.log(err)
                    //commit('ERR')
                    reject(err)
                })
        })
    },
     deleteContract({commit}: any, data: number) {
         return new Promise((resolve, reject) => {
             console.log(data);
             axios( {url: 'http://localhost:8080/api/admin/contracts/' + data, data: {},
                 withCredentials: true, method: "DELETE" })
                 .then(resp => {
                     console.log(resp.data);
                     commit('DELETE_CONTRACT', data);
                     resolve(resp)
                 })
                 .catch(err => {
                     console.log(err)
                     //commit('ERR')
                     reject(err)
                 })
         })
     },
     allAdminContracts ({commit}: any, data: {}){
         return new Promise((resolve, reject) => {
             //const data1 = {};

             console.log(data);
             axios( {url: 'http://localhost:8080/api/admin/contracts/search', data: data,
                 withCredentials: true, method: "POST" })
                 .then(resp => {
                     const content = resp.data.content;
                     const pages = resp.data.totalPages;
                     const elements = resp.data.totalElements;
                     const obj = {
                         items: content,
                         numPages: pages,
                         numElements: elements
                     }
                     console.log(resp.data);
                     commit('SET_ADMIN', obj);
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


    // state,
    // getters,
    // mutations,
    // actions
}
