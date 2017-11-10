import React, { Component } from 'react';
import { Route ,Switch, Redirect} from 'react-router-dom';
import { withRouter } from 'react-router'
import classNames from 'classnames/bind';
import styles from '~less/mainpage.less';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import { Layout} from 'antd';
import LazyComponent from '~util/lazy.js';
import Goods from 'bundle-loader?lazy!../goods/index'
import Orders from 'bundle-loader?lazy!../orders/index'
import Courses from 'bundle-loader?lazy!../courses/index'
import Category from 'bundle-loader?lazy!../category/index'
import Activity from 'bundle-loader?lazy!../activity/index'
import Promotion from 'bundle-loader?lazy!../promotion/index'
import Users from 'bundle-loader?lazy!../users/index'

const {  Content } = Layout;

let cx = classNames.bind(styles);

let pageGoods = LazyComponent(Goods);
let pageOrders = LazyComponent(Orders);
let pageCourses = LazyComponent(Courses);
let pageCategory = LazyComponent(Category);
let pageActivity = LazyComponent(Activity);
let pageUser = LazyComponent(Users);
let pagePromotion = LazyComponent(Promotion);



@withRouter
@inject('store')
@observer
class MainContent extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.store;
  }
  static propTypes = {
    store: PropTypes.object.isRequired
  }
  render() {
    return (
        <Content className={cx('content')}>
           <Switch>
              <Route path = "/goods" component = { pageGoods } />
              <Route path = "/orders" component = { pageOrders } />
              <Route path = "/courses" component = { pageCourses } />
              <Route path = "/categories" component = { pageCategory } />
              <Route path = "/activities" component = { pageActivity } />
              <Route path = "/promotion" component = { pagePromotion } />
              <Route path = "/users" component = { pageUser } />
              <Redirect to="/" /> 
           </Switch>
        </Content>
    )
  }
}

export default MainContent;