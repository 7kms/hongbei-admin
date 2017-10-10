import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { $get, dateFormat } from '~util/index';
import { message, Avatar,Card, Col, Row } from 'antd';

console.log(dateFormat);

@observer
class Detail extends React.PureComponent{
    @observable info = {};
    @observable loading = true;
    static propTypes = {
        history: PropTypes.object.isRequired,
        match:  PropTypes.object.isRequired
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
                <Row gutter={16}>
                    <Col span={8}>
                        <Card title="用户微信" bordered={false}>
                            <Avatar src={wechatInfo.avatarUrl}/>
                            <div>{wechatInfo.nickName}</div>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="用户地址" bordered={false}>
                            <div>{address.userName}</div>
                            <div>{address.telNumber}</div>
                            <div>{address.provinceName + address.cityName + address.countyName + address.detailInfo}</div>
                            <div>{address.postalCode}</div>
                        </Card>
                    </Col>
                </Row>
                <Row type="flex" justify="center" align="middle">
                    <Col span={4}>商品名称</Col>
                </Row>
                {
                    goods.map((item,index)=>(
                        <Row type="flex" justify="center" align="middle" key={index}>
                            <Col span={4}>商品名称</Col>
                            <Col span={4}>{item.name}</Col>
                            <Col span={4}>
                                <img src={item.cover} width={60} height={60}/>
                            </Col>
                            <Col span={4}>规格</Col>
                            <Col span={4}>{item.standard}</Col>
                            <Col span={4}>单价</Col>
                            <Col span={4}>{item.price}</Col>
                            <Col span={4}>数量</Col>
                            <Col span={4}>{item.number}</Col>
                        </Row>
                    ))
                }
            </div>
        )
    }
}
export default Detail