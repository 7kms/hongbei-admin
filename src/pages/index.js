import React from 'react';
import MainPage from 'bundle-loader?lazy!./main/index';
import { connect } from 'react-redux'
import LazyComponent from '~util/lazy.js';
// import { DatePicker, message } from 'antd';
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch
} from 'react-router-dom';


const App = () => (
    <Router>
        <Switch>
            <Route exact path = "/" component = { LazyComponent(MainPage) } />
            <Redirect to={{pathname: '/'}} />
        </Switch>
    </Router>
);

export default connect()(App);