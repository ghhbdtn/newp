//import _ from 'lodash';
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

interface State {
    isAdmin: boolean;
    status: string,
    user : User,
    all: User[],
    totalPages: number,
    totalElements: number
}

const state = {
    isAdmin: false,
    status: '',
    user : {} as User,
    all: [] as User[],
    totalPages: 0,
    totalElements: 0
} as State

const getters =  {
    //isLoggedIn: state => !!state.token
    //isAdmin: state.user.isAdmin
    getUserRole: (state: State) : boolean=> {
        return state.user.isAdmin
    },
    getUser:(state: State): User =>{
        return state.user
    }
}

const mutations = {
    SET_USER:  (state: State, user1: User) => {
        console.log(state, user1)
        state.user.id = user1.id
        state.user.login = user1.fullName
        state.user.login = user1.login
        state.user.isAdmin = user1.isAdmin
        state.user.terminationDate = user1.terminationDate
        state.isAdmin = user1.isAdmin
        console.log(state.user, state.isAdmin)
    },
    AUTH_ERR(state: State){
        state.status = 'error'
    },
    LOG_OUT(state: State){
        state.user = {} as User;
    },
    SET_USERS(state: State, content: {items: User[], numPages: number, numElements: number}) {
        state.all = content.items;
        state.totalPages = content.numPages;
        state.totalElements = content.numElements
    },
    PUT_USER(state: State, data: User){
        const user = _.find(state.all, {id: data.id})
        // @ts-ignore
        Vue.set(state.all, state.all.indexOf(user), data)
    },
    DELETE_USER(state: State, data: number){
        state.all = state.all.filter(user => user.id !== data);
    },
};

const actions = {
    signIn({commit}: any, data: {}){
        return new Promise((resolve, reject) => {
            axios({url: 'http://localhost:8080/api/auth/sign-in ', data: data, method: 'POST', withCredentials: true})
                .then(resp => {
                    const user: User = resp.data;
                    commit('SET_USER', user);
                    resolve(resp)
                })
                .catch(err => {
                    commit('AUTH_ERR')
                    reject(err)
                })
        })
    },
    signUp({commit}: any, data: {}){
        return new Promise((resolve, reject) => {
            axios({url: 'http://localhost:8080/api/auth/sign-up ', data: data, method: 'POST', withCredentials: true })
                .then(resp => {
                    const user: User = resp.data;
                    commit('SET_USER', user);
                    resolve(resp)
                })
                .catch(err => {
                    commit('AUTH_ERR')
                    reject(err)
                })
        })
    },
    logOut({commit}: any) {

        confirm('Вы действительно хотите выйти из системы?')
        document.cookie = 'jwt' +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        commit('LOG_OUT')
    },
    allUsers({commit}: any, data: {}) {
        return new Promise((resolve, reject) => {
            axios({url: 'http://localhost:8080/api/admin/users', data: data, method: 'POST', withCredentials: true })
                .then(resp => {
                    const content: User[] = resp.data.content;
                    const pages = resp.data.totalPages;
                    const elements = resp.data.totalElements;
                    const obj = {
                        items: content,
                        numPages: pages,
                        numElements: elements
                    }
                    commit('SET_USERS', obj);
                    resolve(resp)
                })
                .catch(err => {
                    //commit('AUTH_ERR')
                    reject(err)
                })
        })
    },
    putUser({commit}: any, data: {fullName: string, login: string, terminationDate: string, id: number, newPassword?: string, isAdmin: boolean}){
        return new Promise((resolve, reject) => {
            const id = data.id
            axios( {url: 'http://localhost:8080/api/admin/users/' + id, data: data,
                withCredentials: true, method: "PUT" })
                .then(resp => {
                    const content = resp.data.content;
                    commit('PUT_USER', data);
                    resolve(resp)
                })
                .catch(err => {
                    console.log(err)
                    //commit('ERR')
                    reject(err)
                })
        })
    },
    deleteUser({commit}: any, data: number){
        return new Promise((resolve, reject) => {
            axios( {url: 'http://localhost:8080/api/admin/users/' + data, data: {},
                withCredentials: true, method: "DELETE" })
                .then(resp => {
                    commit('DELETE_USER', data);
                    resolve(resp)
                })
                .catch(err => {
                    console.log(err)
                    //commit('ERR')
                    reject(err)
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
