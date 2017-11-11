import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import {$get,$post,$put} from '~util/index';
import { Button, Input, Row , Modal, Switch,Col,Icon} from 'antd';

// @inject('store')
@observer
class Page extends PureComponent{
    @observable promotion = {
        point: 20,
        reward: 5,
        enable: false
    };
    @observable strategy = '';
    @observable loading = true;
    constructor(props){
        super(props);
    }
    static propTypes = {
        match: PropTypes.object.isRequired
    }
    onChangeStrategy = (e)=>{
        this.strategy = e.target.value
    }
    onChangeSwitch = (checked)=>{
        this.promotion.enable = checked
    }
    async changeRemote({_id,point,reward,enable}){
        let url = '/promotion';
        let $api = $post;
        if(_id){
            $api = $put;
            url = url + '/' + _id;
        }
        try{
            await $api(url,{point,reward,enable});
            Modal.success({
                title:'提示',
                content: '提交成功'
            })
        }catch(e){
            console.log(e);
        }
       
    }
    submit = ()=>{
        let arr =  this.strategy.split('-');
        let point = parseInt(arr[0]);
        let reward = parseInt(arr[1]);
        if(typeof point != 'number' || typeof reward != 'number'){
            Modal.warn({
                title:'格式不正确'
            });
            return false;
        }
        if(point <= reward){
            Modal.warn({
                title:'金额设置不对'
            });
            return false;
        }
        Object.assign(this.promotion,{point,reward})
        Modal.confirm({
            title: '提示',
            content:`满${point}减${reward}?`,
            onOk:()=>{
                this.changeRemote(this.promotion);
            }

        });
        
    }
    async getData(){
        try{
            let res = await $get('/promotion');
            let obj = res.data || {};
            this.promotion = Object.assign(this.promotion,obj);
            this.strategy = this.promotion.point + '-' + this.promotion.reward;
            this.loading = false;
        }catch(e){
            console.log(e);
        }
    }
    componentWillMount(){
        this.getData()
    }
    render(){
        if(this.loading){
            return null;
        }
        return (
            <div>
                <Row>
                    设置满减规则:输入文字(如:100-20代表满100减20)
                </Row>
                <Row>
                    <Input placeholder="20-5" value={this.strategy} onChange={this.onChangeStrategy}/>
                </Row>
                <Row>
                    <Col>是否生效</Col>
                    <Switch 
                        onChange={this.onChangeSwitch}
                        checked={this.promotion.enable}
                        checkedChildren={<Icon type="check" />} 
                        unCheckedChildren={<Icon type="cross" />}/>
                </Row>
                <Row>
                    <Button type="primary" loading={this.isLoading} onClick={this.submit}>
                       提交
                    </Button>
                </Row>
            </div>
        )
    }
}

export default Page;