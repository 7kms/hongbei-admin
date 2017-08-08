import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'; 
import classNames from 'classnames/bind';
import styles from '~less/mainpage.less';
import NavTable from './NavTable';
// import { $get } from '~util/index';
let cx = classNames.bind(styles);


@withRouter
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: []
    };
  }
  componentDidMount() {
   
  }
  render() {
    return (
      <div className={cx('content')}>
        <div className={cx('left')}>
          { this.state.dataList.length ?  <NavTable dataList={this.state.dataList}/> : null }
        </div>
        <div className={cx('right')}></div>
      </div>
    )
  }
}

export default Main;