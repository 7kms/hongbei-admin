import React, { PureComponent } from 'react';
import { Route, Redirect,Switch } from 'react-router-dom';
import {observer} from 'mobx-react';
import LazyComponent from '~util/lazy.js';
import PropTypes from 'prop-types';
import PageList from 'bundle-loader?lazy!./list';
import PageFeedback from 'bundle-loader?lazy!./feedback';

let List = LazyComponent(PageList);
let Feedback = LazyComponent(PageFeedback);

@observer
class UsersPage extends PureComponent{
    constructor(props){
        super(props);
    }
    static propTypes = {
        match: PropTypes.object.isRequired
    }
    render(){
        let { match } = this.props;
        return (
            <Switch>
                <Route exact path={`${match.url}/list`} component={List}/>
                <Route exact path={`${match.url}/feedback`} component={Feedback}/>
                <Redirect to={`${match.url}/list`}/>
            </Switch>
        )
    }
}

export default UsersPage;