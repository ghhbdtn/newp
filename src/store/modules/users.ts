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

export interface State {
    isAuthenticated: boolean,
    isAdmin: boolean,
    user: User,
    all: User[],
    totalPages: number,
    totalElements: number,
    status: number
}

const state = {
    isAdmin: false,
    isAuthenticated: false,
    user: {} as User,
    all: [] as User[],
    totalPages: 0,
    totalElements: 0,
    status: 0
} as State

const getters = {
    getUserRole: (state: State): boolean => {
        return state.user.isAdmin;
    }
}

const mutations = {
    SET_USER: (state: State, user: User) => {
        state.user.id = user.id;
        state.user.login = user.fullName;
        state.user.login = user.login;
        state.user.isAdmin = user.isAdmin;
        state.user.terminationDate = user.terminationDate;
        state.isAdmin = user.isAdmin;
        state.isAuthenticated = true;
    },
    LOG_OUT(state: State) {
        state.user = {} as User;
        state.isAuthenticated = false;
    },
    SET_USERS(state: State, usersData: { items: User[], numPages: number, numElements: number }) {
        state.all = usersData.items;
        state.totalPages = usersData.numPages;
        state.totalElements = usersData.numElements;
    },
    PUT_USER(state: State, data: User) {
        const user = _.find(state.all, {id: data.id});
        if (user != null) Vue.set(state.all, state.all.indexOf(user), data);
    },
    DELETE_USER(state: State, data: number) {
        state.all = state.all.filter(user => user.id !== data);
    },
    ERR(state: State, data: number) {
        state.status = data;
    }
};

const actions = {
    signIn({commit}: any, data: {}) {
        return new Promise((resolve, reject) => {
            axios({url: '/api/auth/sign-in ', data: data, method: 'POST', withCredentials: true})
                .then(resp => {
                    const user: User = resp.data;
                    commit('SET_USER', user);
                    resolve(resp);
                })
                .catch(err => {
                    commit('ERR', err.response != null ? err.response.status : err);
                    reject(err);
                })
        })
    },
    signUp({commit}: any, data: {}) {
        return new Promise((resolve, reject) => {
            axios({url: '/api/auth/sign-up ', data: data, method: 'POST', withCredentials: true})
                .then(resp => {
                    resolve(resp);
                })
                .catch(err => {
                    commit('ERR', err.response != null ? err.response.status : err);
                    reject(err);
                })
        })
    },
    logOut({commit}: any) {
        document.cookie = 'jwt' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        commit('LOG_OUT');
    },
    allUsers({commit}: any, data: {}) {
        return new Promise((resolve, reject) => {
            axios({url: '/api/admin/users', data: data, method: 'POST', withCredentials: true})
                .then(resp => {
                    const usersData = {
                        items: resp.data.content,
                        numPages: resp.data.totalPages,
                        numElements: resp.data.totalElements
                    };
                    commit('SET_USERS', usersData);
                    resolve(resp);
                })
                .catch(err => {
                    reject(err);
                })
        })
    },
    putUser({commit}: any, data: {
        fullName: string,
        login: string,
        terminationDate: string,
        id: number,
        newPassword?: string,
        isAdmin: boolean
    }) {
        return new Promise((resolve, reject) => {
            const id = data.id;
            axios({
                url: '/api/admin/users/' + id, data: data,
                withCredentials: true, method: "PUT"
            })
                .then(resp => {
                    commit('PUT_USER', data);
                    resolve(resp);
                })
                .catch(err => {
                    reject(err);
                })
        })
    },
    deleteUser({commit}: any, data: number) {
        return new Promise((resolve, reject) => {
            axios({
                url: '/api/admin/users/' + data, data: {},
                withCredentials: true, method: "DELETE"
            })
                .then(resp => {
                    commit('DELETE_USER', data);
                    resolve(resp);
                })
                .catch(err => {
                    reject(err);
                })
        })
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
