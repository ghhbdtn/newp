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
    all: Contract[]
}

export const  contractsStore = {
    namespaced: true,
        state: {
    all: [] as Contract[]
} as State,

    getters: {
    },
    mutations: {
    SET: (state: State, content: []) =>{
       // console.log(content, state.all)
        //state.all = [];
        state.all = content;
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
            Vue.set(state.allCounterContracts, state.allCounterContracts.indexOf(contract), data)
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
},


    // state,
    // getters,
    // mutations,
    // actions
}
