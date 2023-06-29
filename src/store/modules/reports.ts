import axios from 'axios';

interface Contract {
    id?: number,
    name: string,
    type: string,
    amount: number,
    plannedStartDate: string,
    plannedEndDate: string,
    actualStartDate: string,
    actualEndDate: string,
    userId?: number
}
interface State {
    err: string
}

export const  reports = {
    namespaced: true,
    state: {
        err: ""
    }as State,

    getters: {
    },
    mutations: {
        ERR(state: State, err: string) {
            state.err = err
        },
    },

    actions: {
        downloadReport({commit}: any, data: {}) {
            return new Promise((resolve, reject) => {
                console.log(data);
                axios( {url: 'http://localhost:8080/api/user/downland-contract-report/dates', params: data,  responseType: 'blob',
                    withCredentials: true, method: "GET" })
                    .then(resp => {
                        const href = URL.createObjectURL(resp.data);
                        const link = document.createElement('a');
                        link.href = href;
                        link.setAttribute('download', 'file.xlsx'); //or any other extension
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(href);
                    })
                    .catch(err => {
                        console.log(err)
                        commit('ERR', err)
                        reject(err)
                    })
            })
        },
        downloadStageReport({commit}: any, data: number) {
            return new Promise((resolve, reject) => {
                console.log(data);
                axios( {url: 'http://localhost:8080/api/user/downland-contract-stage-report/'+ data, params: {},  responseType: 'blob',
                    withCredentials: true, method: "GET" })
                    .then(resp => {
                        const href = URL.createObjectURL(resp.data);
                        const link = document.createElement('a');
                        link.href = href;
                        link.setAttribute('download', 'file.xlsx'); //or any other extension
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(href);
                    })
                    .catch(err => {
                        commit('ERR', err)
                        reject(err)
                    })
            })
        },
    },

}
