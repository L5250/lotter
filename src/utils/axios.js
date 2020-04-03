import axios from "axios"
import { Cookie } from './Cookie'
// Cookie.addCookie(1,2,3)
var Axios = axios.create();

Axios.interceptors.request.use(
    config => {
        // console.log(localStorage.getItem("userInfo"),"localStorage.getItem()")
        // if(localStorage.getItem("userInfo")){
        //     config.headers['token'] = JSON.parse(localStorage.getItem("userInfo")).token
        // }
        // return config


        // console.log(Cookie.getCookie("user"))
        if (Cookie.getCookie("user")) {
            config.headers['token'] = Cookie.getCookie("user")
        }
        return config
    },
    error => {
        Promise.reject(error)
    }
)

Axios.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        return Promise.reject(error)
    }
)

export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        Axios({
            url,
            method: "get",
            params
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export function post(url, params = {}, data = {}) {
    // params(参数)resolve（决定）
    return new Promise((resolve, reject) => {
        Axios({
            url,
            method: "post",
            params,
            data
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}