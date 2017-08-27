import React, { PureComponent } from 'react';
import { Route, Redirect,Switch } from 'react-router-dom';
import {inject, observer} from 'mobx-react';
import LazyComponent from '~util/lazy.js';
import PropTypes from 'prop-types';
import PageList from 'bundle-loader?lazy!./list';
import PageDetail from 'bundle-loader?lazy!./detail';
import Add from 'bundle-loader?lazy!./add';
let AddItem = LazyComponent(Add);
let List = LazyComponent(PageList);
let Detail = LazyComponent(PageDetail);

@inject('store')
@observer
class GoodsPage extends PureComponent{
    constructor(props){
        super(props);
    }
    static propTypes = {
        match: PropTypes.object.isRequired
    }
    render(){
        let {match} = this.props;
        console.log('render-------goods-box')
        return (
            <Switch>
                <Route exact path={`${match.url}/list`} component={List}/>
                <Route exact  path={`${match.url}/add`} component={AddItem}/>
                <Route  path={`${match.url}/:_id`} component={Detail}/>
                <Redirect to={`${match.url}/list`}/>
            </Switch>
        )
    }
}

export default GoodsPage;