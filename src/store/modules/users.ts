//import _ from 'lodash';
import axios from 'axios';
import _ from "lodash";

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
    all: User[]
}

const state = {
    isAdmin: false,
    status: '',
    user : {} as User,
    all: [] as User[]
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
        state.user.isAdmin = false;
    },
    SET_USERS(state: State, content: User[]) {
        state.all = content
    }
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
        commit('LOG_OUT')
    },
    allUsers({commit}: any, data: {}) {
        return new Promise((resolve, reject) => {
            axios({url: 'http://localhost:8080/api/admin/users', data: data, method: 'POST', withCredentials: true })
                .then(resp => {
                    const content: User[] = resp.data.content;
                    commit('SET_USERS', content);
                    resolve(resp)
                })
                .catch(err => {
                    //commit('AUTH_ERR')
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
