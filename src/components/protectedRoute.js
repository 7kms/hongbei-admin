import React from "react";
import { inject, observer } from "mobx-react";
import { Redirect } from "react-router-dom";
import PropTypes from 'prop-types';

export default function (Component) {
	@inject("store")
	@observer
	class AuthenticatedComponent extends React.Component {
		constructor(props) {
			super(props);
			this.store = this.props.store.User;
		}
        static propTypes = {
           store: PropTypes.object.isRequired,
           location: PropTypes.object.isRequired
        }
		render() {
			const { authenticated } = this.store;
			return (
				<div>
					{authenticated
						? <Component {...this.props} />
						: <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: this.props.location }
                            }}
						/>}
				</div>
			);
		}
	}
	return AuthenticatedComponent;
}
