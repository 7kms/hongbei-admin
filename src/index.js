import React from 'react';
import ReactDOM from 'react-dom';
import App from './pages/index';

const render = (Component) => {
    ReactDOM.render(
    <Component />
    ,document.getElementById('root'));
}

render(App);

if(module.hot){
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./pages/index', () => {
        render(App)
    })
}
