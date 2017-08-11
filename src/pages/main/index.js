import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom'; 
import classNames from 'classnames/bind';
import styles from '~less/mainpage.less';
// import { $get } from '~util/index';
import {inject, observer} from 'mobx-react';
import protectedRoute from '~components/protectedRoute';
import PropTypes from 'prop-types';

let cx = classNames.bind(styles);

@protectedRoute
@inject('store')
@observer
class Main extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.store;
  }
  static propTypes = {
    store: PropTypes.object.isRequired
  }
  componentDidMount() {
   
  }
  render() {
    return (
      <div className={cx('content')}>
        dashboard
      </div>
    )
  }
}

export default Main;