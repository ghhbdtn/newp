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
interface Organization{
    id?: number,
    name: string,
    address: string,
    inn: number
}

interface State {
    allOrganizations: Organization[],
    totalPages: number,
    totalElements: number
}

export const  counterparties = {
    namespaced: true,
    state: {
        allOrganizations: [] as Organization[],
        totalPages: 0,
        totalElements: 0
    } as State,

    getters: {
    },
    mutations: {
        SET_ORGANIZATIONS(state: State,obj: {items: [], numPages: number, numElements: number}) {
            state.allOrganizations = obj.items
            state.totalPages = obj.numPages;
            state.totalElements = obj.numElements;
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
                        const pages = resp.data.totalPages;
                        const elements = resp.data.totalElements;
                        const obj = {
                            items: content,
                            numPages: pages,
                            numElements: elements
                        }
                        commit('SET_ORGANIZATIONS', obj);
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
