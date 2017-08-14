import React, { PureComponent } from 'react';
// import { withRouter } from 'react-router-dom'; 
import classNames from 'classnames/bind';
import styles from '~less/mainpage.less';
import {inject, observer} from 'mobx-react';
import menuArr from '~data/menu';
import PropTypes from 'prop-types';

import { Layout, Menu, Icon } from 'antd';
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

let cx = classNames.bind(styles);

// @withRouter
@inject('store')
@observer
class Left extends PureComponent {
    constructor(props){
        super(props)
        this.handleClick = this.handleClick.bind(this)
        console.log(props)
    }
    static propTypes = {
        store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired
    }
    handleClick(e){
        console.log(e);
        let path = e.key;
        let { pageTitle } = e.item.props;
        let {store:{Page},history} = this.props;
        if(pageTitle !== Page.pageTitle){
            Page.changeTitle(pageTitle);
            history.push(path)
        }else{
            history.replace(path)
        }
    }
    generateMenuItem(arr){
        return arr.map((menu)=>{
            let item = '';
            if(menu.sub){
                item = (
                    <SubMenu  title={<span><Icon type={menu.icon} /><span>{menu.title}</span></span>} pageTitle={menu.title} key={menu.key}>
                        {this.generateMenuItem(menu.sub)}
                    </SubMenu>
                )
            }else{
                item = (
                    <Menu.Item key={menu.key} pageTitle={menu.title}>
                        <Icon type={menu.icon} />
                        <span>{menu.title}</span>
                    </Menu.Item>
                )
            }
            return item;
        })
    }
    componentWillMount(){
        console.log(this.props.location.pathname)
        let {pathname} = this.props.location;
        let tmpArr = pathname.split('/');
        this.defaultSelectedKeys = [pathname]
        this.defaultOpenKeys = tmpArr[1] ? [tmpArr[1]] : [];
        console.log(this.defaultSelectedKeys)
        console.log(this.defaultOpenKeys)
    }
    render(){
        return (
            <Sider className={cx('silder')}>
                <div className={cx('logo')} />
                <Menu
                    defaultSelectedKeys={this.defaultSelectedKeys}
                    defaultOpenKeys={this.defaultOpenKeys}
                    mode="inline"
                    className={cx('silder-menu')}
                    onClick={this.handleClick}
                >
                  {this.generateMenuItem(menuArr)}
              </Menu>
          </Sider>
        )
    }
}

export default Left;