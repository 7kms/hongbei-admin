import React from 'react';
import { 
    Route,
    Redirect
} from 'react-router-dom';
import PropTypes from 'prop-types';

let authorization = (userInfo)=> {
    if(!userInfo.get('_id')){
        return false;
    }
    return true;
}

const PrivateRoute = ({ component: Component, userInfo, ...rest }) => (
  <Route {...rest} render={props => (
    authorization(userInfo) ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

PrivateRoute.propTypes = {
    userInfo: PropTypes.object.isRequired,
    component: PropTypes.any,
    location: PropTypes.object
}

export default PrivateRoute;