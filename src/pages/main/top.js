import React, { Component } from 'react';
import { $post } from '~util/index';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from '~less/mainpage.less';
import { Layout, Menu, Icon , Dropdown} from 'antd';

let cx = classNames.bind(styles);
const { Header} = Layout;


const UserMenu = (props)=>{
    return(
        <Menu onClick={props.onClick}>
        <Menu.Item key="1">login out</Menu.Item>
        </Menu>
    )
}
  
UserMenu.propTypes = {
    onClick: PropTypes.func.isRequired
}
  
@inject('store')
@observer
class UserAvatar extends Component {
constructor(props) {
    super(props);
    this.store = this.props.store;
    this.clickMenu = this.clickMenu.bind(this)
}
static propTypes = {
    store: PropTypes.object.isRequired
}
async clickMenu({key}){
    if(key == 1){
    await $post('/admin/loginout')
    window.location.href = '/'
    }
}
render(){
    let {User} = this.props.store;
    return(
    <Dropdown overlay={<UserMenu onClick={this.clickMenu}/>}>
        <div>
            <span>{User.info.username}</span> <Icon type="down" />
        </div>
    </Dropdown>
    )
}
}
  
@inject('store')
@observer
class Top extends Component {
    constructor(props) {
        super(props);
        this.store = this.props.store;
    }
    static propTypes = {
        store: PropTypes.object.isRequired
    }
    render(){
        let { Page } = this.props.store;
        return (
            <Header className={cx('header')}>
                <div className={cx('page-title')}>{ Page.title }</div>
                <div className={cx('user-box')}>
                <UserAvatar/>
                </div>
            </Header>
        )
    }
}

export default Top;