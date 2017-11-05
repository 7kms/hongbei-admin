import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { $get, dateFormat} from '~util/index';

import { Table, Button, message, Row ,Col, Select} from 'antd';
const Option = Select.Option;


const { Column } = Table;

@observer
class OrderList extends React.PureComponent{
    constructor(props){
        super(props);
        this.onShowSizeChange = this.onShowSizeChange.bind(this)
        this.onFilterChange = this.onFilterChange.bind(this)
    }

    static propTypes = {
        history: PropTypes.object.isRequired
    }
    
    @observable list = [];
    @observable categoryList = [];
    @observable total = 0;
    @observable loading = true;


    queryInfo = {
        limit: 10,
        skip: 0,
        options:{}
    }

    onFilterChange(key,val){
        if(val == -1){
            delete this.queryInfo.options[key]
        }else{
            this.queryInfo.options[key] = val == 1 ? true : false;
        }
        this.getList()
    }
    onShowSizeChange(current, pageSize){
        console.log(current, pageSize)
        this.queryInfo.limit = pageSize;
        this.queryInfo.skip = (current-1) * pageSize;
        this.getList();
    }

    async getList(){
        try{
            this.loading = true;
            let res = await $get('/orders',{...this.queryInfo})
            this.list = res.data;
            this.total = res.total;
        }catch(err){
            console.log(err);
            message.error(err.msg, 5000)
        }
        this.loading = false;
    }
    goDetail({_id}){
        this.props.history.push(`/orders/${_id}`)
    }
    componentWillMount(){
        this.getList()
    }
    render(){
        console.log('render-------order-list')
        let list = this.list;
        let {skip} = this.queryInfo
        return(
            <div>
                <TableFilter onFilterChange={this.onFilterChange} categoryList={this.categoryList}/>
                <Row style={{marginTop:20,marginBottom:20}} className="text-center">订单列表</Row>
                <Table 
                    loading = {this.loading}
                    dataSource={Array.prototype.slice.call(list,0)}  
                    rowKey={record => record._id}
                    pagination={{
                        showSizeChanger:true,
                        onChange:this.onShowSizeChange ,
                        onShowSizeChange:this.onShowSizeChange,
                        defaultCurrent:1, 
                        total:this.total
                    }}
                    >
                    <Column
                        title="序号"
                        render={(text, record, index) => (
                            <div>
                                { index + 1 + skip}
                            </div>
                        )}
                    />
                    <Column
                        title="用户"
                        key="user"
                        render={(text, record) => (
                            <div>
                               <img src={record.user.wechatInfo.avatarUrl} width="50" height="50"/>
                               <div>{record.user.wechatInfo.nickName}</div>
                            </div>
                        )}
                    />
                    <Column
                        title="总价(元)"
                        dataIndex="totalPrice"
                    />
                    <Column
                        title="商品数量(个)"
                        render={(text, record) => {
                            let num = 0;
                            record.goods.forEach(good=>{
                                num += good.number;
                            })
                            return <div>{ num }</div>
                        }}
                    />
                    <Column
                        title="是否发货"
                        render={(text, record) => (
                            <div>
                                { record.onDeliver ? '是' : '否'}
                            </div>
                        )}
                    />
                    <Column
                        title="下单时间"
                        key="createdAt"
                        render={(text, record) => (
                            <div>
                                { dateFormat(record.createdAt) }
                            </div>
                        )}
                    />
                    <Column
                        title="Action"
                        key="action"
                        render={(text,record) => (
                            <div>
                                <Button onClick={()=>this.goDetail(record)}>详情</Button>
                            </div>
                        )}
                    />
                </Table>
            </div>
        )
    }
}



class TableFilter extends React.PureComponent{
    static propTypes = {
        onFilterChange: PropTypes.func.isRequired
    }
    render(){
        let {onFilterChange} = this.props;
        return (
            <Row type="flex" justify="left" align="middle">
                <Col span={3} className="text-right">
                   <span>是否已发货</span>
                </Col>
                <Col span={2}>
                    <Select className="select-block" defaultValue="-1"  onChange={(val)=>onFilterChange('onDeliver',val)}>
                        <Option value="-1">不限</Option>
                        <Option value='1'>是</Option>
                        <Option value='0'>否</Option>
                    </Select>
                </Col>
            </Row>
        )
    }
}
export default OrderList