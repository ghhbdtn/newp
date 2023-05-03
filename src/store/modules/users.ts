//import _ from 'lodash';
import axios from 'axios';
import _ from "lodash";

interface State {
    isAdmin: boolean;
    status: string,
    user : User,
    all: User[]
}
interface User {
    id: number,
    login: string,
    fullName: string,
    terminationDate: string,
    isAdmin: boolean
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
        return state.user.isAdmin == true
    },
    getUser: state => state.user
}

const mutations = {
    SET_USER:  (state: State, user: User) => {
        console.log(state, user)
        state.user.id = user.id;
        state.user.login = user.login;
        state.user.fullName = user.fullName;
        state.user.terminationDate = user.terminationDate;
        state.user.isAdmin = user.isAdmin;
        state.isAdmin = user.isAdmin
        console.log(state.user, state.isAdmin)
    },
    AUTH_ERR(state: State){
        state.status = 'error'
    },
    LOG_OUT(state: State){
        state.user.isAdmin = false;
    }
};

const actions = {
    signIn({commit}: any, data){
        return new Promise((resolve, reject) => {
            axios({url: 'http://localhost:8080/auth-api/sign-in', data: data, method: 'POST' })
                .then(resp => {
                    const user: User = resp.data;
                    console.log(user)
                    commit('SET_USER', user);
                    resolve(resp)
                })
                .catch(err => {
                    commit('AUTH_ERR')
                    reject(err)
                })
        })
    },
    signUp({commit}: any, data){
        return new Promise((resolve, reject) => {
            axios({url: 'http://localhost:8080/auth-api/sign-up', data: data, method: 'POST' })
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
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
