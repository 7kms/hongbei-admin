import React, { PureComponent } from 'react';
import { Route, Redirect,Switch } from 'react-router-dom';
import LazyComponent from '~util/lazy.js';
import PropTypes from 'prop-types';
import PageList from 'bundle-loader?lazy!./list';
import PageDetail from 'bundle-loader?lazy!./detail';
let List = LazyComponent(PageList);
let Detail = LazyComponent(PageDetail);

class Page extends PureComponent{
    constructor(props){
        super(props);
    }
    static propTypes = {
        match: PropTypes.object.isRequired
    }
    render(){
        let {match} = this.props
        return (
            <Switch>
                <Route exact path={`${match.url}`} component={List}/>
                <Route  path={`${match.url}/:item`} component={Detail}/>
                <Redirect to={`${match.url}`}/>
            </Switch>
        )
    }
}

export default Page;