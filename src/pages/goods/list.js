import React from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { $get, dateFormat} from '~util/index';

import { Table, Button, message, Row, Pagination } from 'antd';

const { Column } = Table;


@inject('store')
@observer
class GoodsList extends React.PureComponent{
    constructor(props){
        super(props);
        this.onShowSizeChange = this.onShowSizeChange.bind(this)
    }

    static propTypes = {
        history: PropTypes.object.isRequired
    }
    
    @observable list = [];
    @observable total = 0;

    queryInfo = {
        limit: 10,
        skip: 0
    }

    onShowSizeChange(current, pageSize){
        console.log(current, pageSize)
        this.queryInfo.limit = pageSize;
        this.queryInfo.skip = (current-1) * pageSize;
        this.getList();
    }

    async getList(){
        try{
            let res = await $get('/cakes',{...this.queryInfo});
            this.list = res.data;
            this.total = res.total;
        }catch(err){
            message.error(err.msg, 5000)
        }
    }
    updateCategory({_id}){
        this.props.history.push(`/goods/${_id}`)
    }
    componentWillMount(){
        this.getList()
    }
    render(){
        console.log('render-------goods-list')
        let list = this.list;
        let {skip} = this.queryInfo
        return(
            <div>
                <Row>商品列表</Row>
                <Table style={{marginTop:50}} dataSource={Array.prototype.slice.call(list,0)} pagination={false} rowKey={record => record._id}>
                    <Column
                        title="序号"
                        render={(text, record, index) => (
                            <div>
                                { index + 1 + skip}
                            </div>
                        )}
                    />
                    <Column
                        title="名称"
                        dataIndex="name"
                    />
                    <Column
                        title="分类"
                        dataIndex="category.name"
                    />
                    <Column
                        title="库存"
                        dataIndex="store"
                    />
                    <Column
                        title="单价"
                        dataIndex="price"
                    />
                    <Column
                        title="是否上架"
                        render={(text, record) => (
                            <div>
                                { record.onSale ? '是' : '否'}
                            </div>
                        )}
                    />
                    <Column
                        title="修改时间"
                        key="updatedAt"
                        render={(text, record) => (
                            <div>
                                { dateFormat(record.updatedAt) }
                            </div>
                        )}
                    />
                    <Column
                        title="Action"
                        key="action"
                        render={(text,record) => (
                            <div>
                                <Button onClick={()=>this.updateCategory(record)}>修改</Button>
                            </div>
                        )}
                    />
                </Table>
                <Pagination showSizeChanger onChange={this.onShowSizeChange} onShowSizeChange={this.onShowSizeChange} defaultCurrent={1} total={this.total} />
            </div>
        )
    }
}

export default GoodsList