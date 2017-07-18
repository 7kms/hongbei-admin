import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware} from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import App from './pages/index';
let middleWareArr = [thunk];

const store = createStore(
    rootReducer,
    applyMiddleware(...middleWareArr)
);

const render = (Component) => {
    ReactDOM.render(
    <Provider store={store}>
        <Component />
    </Provider>
    ,document.getElementById('root'));
}

render(App);

if(module.hot){
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default
      store.replaceReducer(nextRootReducer)
    })
}
