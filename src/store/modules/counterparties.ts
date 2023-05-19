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
//TODO добавить объект внутри договора
interface Organization{
    id?: number,
    name: string,
    address: string,
    inn: number
}

interface State {
    allOrganizations: Organization[]
}

export const  counterparties = {
    namespaced: true,
    state: {
        allOrganizations: [] as Organization[]
    } as State,

    getters: {
    },
    mutations: {
        SET_ORGANIZATIONS(state: State,content: []) {
            state.allOrganizations = content
        },
        SET_ORGANIZATION(state: State,content: Organization) {
            state.allOrganizations.push(content)
        }
    },

    actions: {
        allCounterpartyOrganizations({commit}: any, data: {}) {
            return new Promise((resolve, reject) => {
                console.log(data);
                axios( {url: 'http://localhost:8080/api/user/counterparty-organizations/search', data: data,
                    withCredentials: true, method: "POST" })
                    .then(resp => {
                        const content = resp.data.content;
                        console.log(resp.data);
                        commit('SET_ORGANIZATIONS', content);
                        resolve(resp)
                    })
                    .catch(err => {
                        console.log(err)
                        //commit('ERR')
                        reject(err)
                    })
            })
        },
        addNewOrganization({commit}: any, data: {}){
            return new Promise((resolve, reject) => {
                //const data1 = {};

                console.log(data);
                axios( {url: 'http://localhost:8080/api/admin/counterparty-organizations', data: data,
                    withCredentials: true, method: "POST" })
                    .then(resp => {
                        const content = resp.data.content;
                        commit('SET_ORGANIZATION', data);
                        resolve(resp)
                    })
                    .catch(err => {
                        console.log(err)
                        //commit('ERR')
                        reject(err)
                    })
            })
        },
        putOrganization({commit}: any, data: {}){
            return new Promise((resolve, reject) => {
                //const data1 = {};
                // @ts-ignore
                const id = data['id']
                console.log(data);
                axios( {url: 'http://localhost:8080/api/admin/counterparty-organizations/' + id, data: data,
                    withCredentials: true, method: "PUT" })
                    .then(resp => {
                        const content = resp.data.content;
                        commit('PUT_ORGANIZATION', data);
                        resolve(resp)
                    })
                    .catch(err => {
                        console.log(err)
                        //commit('ERR')
                        reject(err)
                    })
            })
        },
        deleteOrganization({commit}: any, data: number){
            return new Promise((resolve, reject) => {
                //const data1 = {};
                // @ts-ignore
                console.log(data);
                axios( {url: 'http://localhost:8080/api/admin/counterparty-organizations/' + data, data: {},
                    withCredentials: true, method: "DELETE" })
                    .then(resp => {
                        const content = resp.data.content;
                        commit('DELETE_ORGANIZATION', data);
                        resolve(resp)
                    })
                    .catch(err => {
                        console.log(err)
                        //commit('ERR')
                        reject(err)
                    })
            })
        }
    },

}
