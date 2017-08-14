import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom'; 
import classNames from 'classnames/bind';
import styles from '~less/mainpage.less';
// import {inject, observer} from 'mobx-react';
import protectedRoute from '~components/protectedRoute';
// import PropTypes from 'prop-types';
import Left from './left';
import Top from './top';
import Content from './content';
import { Layout} from 'antd';
const { Footer } = Layout;

let cx = classNames.bind(styles);

@protectedRoute
class Main extends Component {
  render() {
    return (
      <Layout>
        <Left {...this.props}/>  
        <Layout className={cx('layout')}>
          <Top/> 
          <Content></Content>
          <Footer className={cx('footer')}>
            Ant Design ©2016 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    )
  }
}

export default Main;