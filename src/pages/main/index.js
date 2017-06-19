import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from '~less/mainpage.less';
import NavTable from './NavTable';
import { $get } from '~util/index';
let cx = classNames.bind(styles);

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: []
    };
  }
  componentDidMount() {
    $get().then(data=>{
      this.setState({
        dataList: data.result
      });
    })
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