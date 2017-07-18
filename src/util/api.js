import appConfig from './config.js';

let baseFeachConfig = {
    credentials: 'include'
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.json()
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

export const $get = (url, paramObj)=>{
    url = `${appConfig.serverUrl}/${url}?params=${encodeURIComponent(JSON.stringify(paramObj))}`;
    return fetch(url, baseFeachConfig)
            .then(checkStatus)
}

export const $post = (url, paramObj) => {
    url = `${appConfig.serverUrl}/${url}`;
    paramObj = {params:paramObj};
    let config = Object.assign({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: encodeURIComponent(JSON.stringify(paramObj))
        },baseFeachConfig);
    return fetch(url,config).then(checkStatus)
}