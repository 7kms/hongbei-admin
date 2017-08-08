import React from 'react';
import MainPage from 'bundle-loader?lazy!./main/index';
import Upload from 'bundle-loader?lazy!./upload/index';
import LazyComponent from '~util/lazy.js';
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
            <Route exact path = "/upload" component = { LazyComponent(Upload) } />
            <Redirect to={{pathname: '/'}} />
        </Switch>
    </Router>
);

export default App;