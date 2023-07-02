import axios from 'axios';
import _ from "lodash";
import Vue from "vue";
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
        },
        PUT_ORGANIZATION(state: State, data: Organization){
            const organization = _.find(state.allOrganizations, {id: data.id})
            if (organization != null) Vue.set(state.allOrganizations, state.allOrganizations.indexOf(organization), data)
        },
        DELETE_ORGANIZATION(state: State, data: number){
            state.allOrganizations = state.allOrganizations.filter(org => org.id !== data);
        }
    },

    actions: {
        allCounterpartyOrganizations({commit}: any, data: {}) {
            return new Promise((resolve, reject) => {
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
                axios( {url: 'http://localhost:8080/api/admin/counterparty-organizations', data: data,
                    withCredentials: true, method: "POST" })
                    .then(resp => {
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
        putOrganization({commit}: any, data: {id: number, name: "", address: "", inn: number}){
            return new Promise((resolve, reject) => {
                const id = data.id
                console.log(data);
                axios( {url: 'http://localhost:8080/api/admin/counterparty-organizations/' + id, data: data,
                    withCredentials: true, method: "PUT" })
                    .then(resp => {
                        commit('PUT_ORGANIZATION', data);
                        resolve(resp)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        deleteOrganization({commit}: any, data: number){
            return new Promise((resolve, reject) => {
                axios( {url: 'http://localhost:8080/api/admin/counterparty-organizations/' + data, data: {},
                    withCredentials: true, method: "DELETE" })
                    .then(resp => {
                        commit('DELETE_ORGANIZATION', data);
                        resolve(resp)
                    })
                    .catch(err => {
                        //commit('ERR')
                        reject(err)
                    })
            })
        }
    },
}
