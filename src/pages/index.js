import React from 'react';
import { observer,inject } from 'mobx-react';
import MainPage from 'bundle-loader?lazy!./main/index';
import Login from 'bundle-loader?lazy!./entrance/index';
import LazyComponent from '~util/lazy.js';
import PropTypes from 'prop-types';
import { Spin } from 'antd';

import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch
} from 'react-router-dom';


const App = () => (
    <Router>
        <Switch>
            <Route exact path = "/login" component = { LazyComponent(Login) } />
            <Route path = "/" component = { LazyComponent(MainPage) }/>
            <Redirect to={{pathname: '/'}} />
        </Switch>
    </Router>
);


@inject('store')
@observer
class AuthorApp extends React.Component{
    constructor(props){
        super(props);
        this.store = this.props.store.User;
    }
    static propTypes = {
        store: PropTypes.object.isRequired
    }
    componentWillMount(){
        this.store.author()
    }
    
    render(){
        const { hasChecked } = this.store;
        let dom =  hasChecked ? <App/> : <Spin className="page-loading" size="large"/>
        return dom;
    }
}

export default AuthorApp;