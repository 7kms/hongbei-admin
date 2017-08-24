import { serverUrl } from './config.js';
import { getAppRouter } from '~util/index'

let baseFetchConfig = {
    credentials: 'include'
};
let generateFn = (method)=>(url, paramObj = {}) => {
    url = serverUrl + url
    let config = getConfig(method,paramObj);
    return fetch(url,config).then(checkStatus)
}
function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response.json())
    } else {
        return response.json().then((err)=>{
            if(err.err_code == '403001'){
                let router = getAppRouter();
                if(router){
                    router.history.push('/login',{from: router.history.location.pathname})
                }else{
                    location.href = '/login?from=' + location.pathname;
                }
            }else{
                return Promise.reject(err)
            }
        })
    }
}

let getConfig = (method, paramObj = {})=>{
    return Object.assign({
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(paramObj)
    },baseFetchConfig)
}

export const $get = (url, paramObj = {})=>{
    url = `${serverUrl}${url}?params=${JSON.stringify(paramObj)}`;
    return fetch(url, baseFetchConfig)
            .then(checkStatus)
}

export const $post = (url, paramObj = {}) => {
    url = serverUrl + url
    let config = getConfig('POST',paramObj);
    return fetch(url,config).then(checkStatus)
}

export const $put = (url, paramObj = {}) => {
    url = serverUrl + url
    let config = getConfig('PUT',paramObj);
    return fetch(url,config).then(checkStatus)
}

export const $delete = generateFn('DELETE')

