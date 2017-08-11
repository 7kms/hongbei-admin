import '~less/base.less';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'mobx-react';
import App from './pages/index';
import DevTools from "mobx-react-devtools";
import Store from './stores'

const render = (Component) => {
    ReactDOM.render(
        <Provider store={Store}>
            <div>
                {process.env.NODE_ENV != 'production' ? <DevTools/> : null}
                <Component />
            </div>
        </Provider>
    ,document.getElementById('root'));
}

render(App);

if(module.hot){
    // Enable Webpack hot module replacement for reducers
    module.hot.accept(() => {
        const App = require('./pages/index').default
        render(App)
    })
}
