/**
 * Created by float.. on 2017/5/22.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from '~less/mainpage.less';

let cx = classNames.bind(styles);

class NavItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.item,
      active: false
    }
  }
  toggleDepartment(){
    let active = !this.state.active;
    this.setState({
      active
    });
  }
  toggleJobItem(job){
    job.checked = !job.checked;
    let item = this.state.item;
    item.checked = true;
    item.jobList.forEach(data=>{
      if(!data.checked){
        item.checked = false;
      }
    });
    this.setState({
      item
    })
  }
  checkDepartment(){
    let item = this.state.item;
    item.checked = !item.checked;
    this.state.item.jobList.map(job=>job.checked = item.checked);
    this.setState({
      item: this.state.item,
      active: item.checked ? true : this.state.active
    });
  }
  render() {
    let { item } = this.state;
    return(
      <div className={cx(['panel'])}>
        <div className={cx(['department',{'active':this.state.active}])} onClick={()=> this.toggleDepartment()}>
          <div onClick={(e)=>{
            e.stopPropagation();
            this.checkDepartment();
          }}>
            <input type="checkbox" checked={!!item.checked}/>
          </div>
          <span className={cx(['name'])}>{ item.department }</span>
          <span className={cx(['total','number'])}>{ item.total }</span>
        </div>
        <div className={cx('job-list')}>
          {
            item.jobList.map((job,index)=>{
              return (
                <div className={cx('job-item')} key={index} onClick={()=>this.toggleJobItem(job)}>
                  <div>
                    <input type="checkbox" checked={!!job.checked}/>
                  </div>
                  <div className={cx('job-name')}>{ job.jobName }</div>
                  <div className={cx('number')}>{ job.number }</div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

// NavItem.propTypes = {
//   item: PropTypes.object.isRequired
// };

class NavList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div className={cx('list')}>
        {
          this.props.list.map((item,index) => <NavItem item={item}  key={index}/>)
        }
      </div>
    );
  }
}
NavList.propTypes = {
  list: PropTypes.array.isRequired
};

export default class NavTable extends Component {
  constructor(props){
    super(props);
    this.state = {
      dataList: this.props.dataList
    }
  }
  clearTable(){
    let list = this.state.dataList;
    list.forEach((item)=>{
      item.checked = false;
      item.jobList.forEach(job=>job.checked=false);
    });
    this.setState({
      dataList:list
    });
  }
  render() {
    return (
      <div>
        <div className={cx('header')}>
          <span className={cx('dfn')}>招聘职位</span>
          <span className={cx('clear')} onClick={()=>this.clearTable()}>清空</span>
        </div>
        <NavList list={this.state.dataList}/>
      </div>
    );
  }
}

NavTable.propTypes = {
  dataList: PropTypes.array.isRequired
};