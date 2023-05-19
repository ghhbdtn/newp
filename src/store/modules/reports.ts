import axios from 'axios';
import _ from "lodash";
import users from "@/store/modules/users";

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


export const  reports = {
    namespaced: true,
    state: {
    },

    getters: {
    },
    mutations: {
    },

    actions: {
        downloadReport({commit}: any, data: {}) {
            return new Promise((resolve, reject) => {
                console.log(data);
                axios( {url: 'http://localhost:8080/api/user/downland-contract-report/dates', params: data,  responseType: 'blob',
                    withCredentials: true, method: "GET" })
                    .then(resp => {
                        const href = URL.createObjectURL(resp.data);

                        // create "a" HTML element with href to file & click
                        const link = document.createElement('a');
                        link.href = href;
                        link.setAttribute('download', 'file.xlsx'); //or any other extension
                        document.body.appendChild(link);
                        link.click();

                        // clean up "a" element & remove ObjectURL
                        document.body.removeChild(link);
                        URL.revokeObjectURL(href);
                        // const content = resp.data.content;
                        // console.log(resp.data);
                        // resolve(resp)
                    })
                    .catch(err => {
                        console.log(err)
                        //commit('ERR')
                        reject(err)
                    })
            })
        },
        // addNewOrganization({commit}: any, data: {}){
        //     return new Promise((resolve, reject) => {
        //         //const data1 = {};
        //
        //         console.log(data);
        //         axios( {url: 'http://localhost:8080/api/admin/counterparty-organizations', data: data,
        //             withCredentials: true, method: "POST" })
        //             .then(resp => {
        //                 const content = resp.data.content;
        //                 commit('SET_ORGANIZATION', data);
        //                 resolve(resp)
        //             })
        //             .catch(err => {
        //                 console.log(err)
        //                 //commit('ERR')
        //                 reject(err)
        //             })
        //     })
        // },
    },

}
