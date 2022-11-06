//API接口统一管理点
import requests from "./request";
import Vue from 'vue'
import axios from "axios";

export const createPlayer = (params) => {
    // send request
    return requests({
        url: '#',
        method: 'get',
        params,
        cancelToken: new axios.CancelToken(c => {          
        Vue.prototype.$httpRequestList.push(c);    // When request is interrupted, the corresponding interrupt method will stored in this array
      })
    })
}

export const fooo = () => {
    // send request
    return requests({
        url: 'http://192.168.0.104:8080/game/result',
        method: 'get',
    })
}

// request sending example:
// __________________________________________________________________________
// export const foo = (params) => {
//     // send request
//     return requests({
//         url: '#',
//         method: 'get',
//         params,
//         cancelToken: new axios.CancelToken(c => {
//         Vue.prototype.$httpRequestList.push(c);    // When request is interrupted, the corresponding interrupt method will stored in this array
//       })
//     })
// }
// __________________________________________________________________________
