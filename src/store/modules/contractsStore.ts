import axios from 'axios';
import _ from "lodash";
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

export const contractsStore = {
    namespaced: true,
    state: {
        all: [] as Contract[],
        allForAdmin: [] as Contract[],
        totalPages: -1,
        totalElements: -1,
        last: false
    } as State,

    getters: {},

    mutations: {
        SET: (state: State, userContractsData: { items: [], numPages: number, numElements: number, last: boolean }) => {
            state.all = userContractsData.items;
            state.totalPages = userContractsData.numPages;
            state.totalElements = userContractsData.numElements;
            state.last = userContractsData.last;
        },
        SET_CONTRACT: (state: State, data: any) => {
            state.all.push(data);
        },
        DELETE_CONTRACT(state: State, data: number) {
            state.all = state.all.filter(ct => ct.id !== data);
        },
        PUT_CONTRACT(state: State, data: Contract) {
            const contract = _.find(state.all, {id: data.id});
            if (contract != null) {
                Vue.set(state.allForAdmin, state.allForAdmin.indexOf(contract), data);
            }
        },
        SET_ADMIN: (state: State, adminContractsData: { items: [], numPages: number, numElements: number }) => {
            state.allForAdmin = adminContractsData.items;
            state.totalPages = adminContractsData.numPages;
            state.totalElements = adminContractsData.numElements;
        },
    },

    actions: {
        getAll({commit}: any, data: {}) {
            return new Promise((resolve, reject) => {
                axios({
                    url: '/api/user/contracts/search', data: data,
                    withCredentials: true, method: "POST"
                })
                    .then(resp => {
                        const userContractsData = {
                            items: resp.data.content,
                            numPages: resp.data.totalPages,
                            numElements: resp.data.totalElements,
                            last: resp.data.last
                        };
                        commit('SET', userContractsData);
                        resolve(resp);
                    })
                    .catch(err => {
                        reject(err);
                    })
            })
        },
        addNew({commit}: any, data: {}) {
            return new Promise((resolve, reject) => {
                axios({
                    url: '/api/admin/contracts', data: data,
                    withCredentials: true, method: "POST"
                })
                    .then(resp => {
                        commit('SET_CONTRACT', data);
                        resolve(resp);
                    })
                    .catch(err => {
                        reject(err);
                    })
            })
        },
        putContract({commit}: any, data: {
            name: string,
            type: string,
            amount: string,
            plannedStartDate: string,
            plannedEndDate: string,
            actualStartDate: string,
            actualEndDate: string,
            userId?: number,
            id: number
        }) {
            return new Promise((resolve, reject) => {
                const id = data.id
                axios({
                    url: '/api/admin/contracts/' + id, data: data,
                    withCredentials: true, method: "PUT"
                })
                    .then(resp => {
                        commit('PUT_CONTRACT', data);
                        resolve(resp);
                    })
                    .catch(err => {
                        reject(err);
                    })
            })
        },
        deleteContract({commit}: any, data: number) {
            return new Promise((resolve, reject) => {
                axios({
                    url: '/api/admin/contracts/' + data, data: {},
                    withCredentials: true, method: "DELETE"
                })
                    .then(resp => {
                        commit('DELETE_CONTRACT', data);
                        resolve(resp);
                    })
                    .catch(err => {
                        reject(err);
                    })
            })
        },
        allAdminContracts({commit}: any, data: {}) {
            return new Promise((resolve, reject) => {
                axios({
                    url: '/api/admin/contracts/search', data: data,
                    withCredentials: true, method: "POST"
                })
                    .then(resp => {
                        const adminContractsData = {
                            items: resp.data.content,
                            numPages: resp.data.totalPages,
                            numElements: resp.data.totalElements
                        };
                        commit('SET_ADMIN', adminContractsData);
                        resolve(resp);
                    })
                    .catch(err => {
                        reject(err);
                    })
            })
        },
    },
}
