import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { $get, $put, dateFormat } from '~util/index';
import {serverUrl} from '~util/config';
import { message, Avatar,Card, Col, Row ,Switch, Modal} from 'antd';
import classNames from 'classnames/bind';

import styles from '~less/order-detail.less';
let cx = classNames.bind(styles);

const confirm = Modal.confirm;

console.log(dateFormat);

@observer
class Detail extends React.PureComponent{
    @observable info = {};
    @observable loading = true;
    static propTypes = {
        history: PropTypes.object.isRequired,
        match:  PropTypes.object.isRequired
    }
    setDeliver = async ()=>{
        let {match:{params:{_id}}} = this.props;
        try{
            await $put(`/orders/${_id}`,{onDeliver: true})
            Modal.success({
                title: '提示',
                content: '更改成功',
              });
        }catch(e){
            Modal.error({
                title: '提示',
                content: '更改失败',
            });
        }
    }
    changeDeliver = (checked)=>{
        if(checked){
            confirm({
                title: '提示',
                content: '确认已经发货?',
                onOk:()=> {
                    this.info.onDeliver = checked;
                    this.setDeliver()
                },
                onCancel:()=> {
                    this.info.onDeliver = false
                },
              });
        }else{
            Modal.warning({
                title: '警告',
                content: '已经发货无法更改状态',
              });
        }
    }
    async getInfo(){
        let {match:{params:{_id}}} = this.props;
        try{
            this.loading = true;
            let res = await $get(`/orders/${_id}`)
            this.info = res.data;
        }catch(err){
            message.error(err.msg, 5000)
        }
        this.loading = false;
    }
    componentWillMount(){
        this.getInfo()
    }
    render(){
        if(this.loading){
            return null
        }
        let { user:{wechatInfo}, address, goods} = this.info;
        return(
            <div>
                <Row className={cx('order-status')}>
                    <Switch 
                        checkedChildren="已发货" 
                        unCheckedChildren="未发货" 
                        checked={this.info.onDeliver}
                        onChange={this.changeDeliver}
                    />
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Card title={`订单详情 ( ${this.info._id} )`} bordered={false}>
                            <div className={cx('order-goods')}>
                                {
                                    goods.map((item,index)=>(
                                        <div className={cx('goods-item')} key={index}>
                                            <div>
                                                <img src={serverUrl + item.cover} width={60} height={60}/>
                                            </div>
                                            <div className={cx('item-info')}>
                                                <div className={cx('info-name')}>{item.name}</div>
                                                <div><span>数量：</span> {item.number}</div>
                                                <div><span>规格：</span> {item.standard}</div>
                                            </div>
                                            <div className={cx('highlight','item-price')}>
                                                ¥{item.price * item.number}
                                            </div>
                                        </div>
                                    ))
                                }
                               <div className={cx('order-footer')}>
                                    <div className={cx('highlight')}>单笔消费满20元，立减5元</div>
                                    <div>共{goods.length}件商品，合计 <span className={cx('highlight','total-price')}>{this.info.totalPrice}</span></div>
                               </div>
                            </div>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="用户地址" bordered={false}>
                            <div>收货人: {address.userName}</div>
                            <div>联系电话: {address.telNumber}</div>
                            <div>收货地址: {address.provinceName + address.cityName + address.countyName + address.detailInfo}</div>
                            <div>邮编: {address.postalCode}</div>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="用户微信" bordered={false}>
                            <Avatar src={wechatInfo.avatarUrl}/>
                            <div>{wechatInfo.nickName}</div>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default Detail