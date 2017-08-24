import '~less/base.less';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import App from './pages/index';
import DevTools from "mobx-react-devtools";
import Store from './stores'

const render = (Component) => {
    ReactDOM.render(
        <Provider store={Store}>
            {process.env.NODE_ENV != 'production' ?
                <div style={{height:'100%'}}>
                    <DevTools/>
                    <Component />
                </div>
              : 
                <Component />
             }
        </Provider>
    ,document.getElementById('root'));
}

render(App);

if(module.hot){
    module.hot.accept(() => {
        const App = require('./pages/index').default
        render(App)
    })
}
