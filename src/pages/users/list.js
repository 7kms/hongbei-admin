import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { $get, dateFormat} from '~util/index';

import { Table, Button, message, Row ,Col, Select} from 'antd';
const Option = Select.Option;


const { Column } = Table;

@observer
class GoodsList extends React.PureComponent{
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
            this.queryInfo.options[key] = val;
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
            await Promise.all([$get('/category'),$get('/cakes',{...this.queryInfo})])
            .then(res=>{
                this.categoryList = res[0].data;
                this.list = res[1].data;
                this.total = res[1].total;
            })
        }catch(err){
            console.log(err);
            message.error(err.msg, 5000)
        }
        this.loading = false;
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
                <TableFilter onFilterChange={this.onFilterChange} categoryList={this.categoryList}/>
                <Row style={{marginTop:20,marginBottom:20}} className="text-center">商品列表</Row>
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
                        title="名称"
                        dataIndex="name"
                    />
                    <Column
                        title="分类"
                        dataIndex="category.name"
                    />
                    <Column
                        title="单价"
                        dataIndex="price"
                    />
                    <Column
                        title="库存"
                        dataIndex="store"
                    />
                    <Column
                        title="销量"
                        dataIndex="sales"
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
            </div>
        )
    }
}



class TableFilter extends React.PureComponent{
    static propTypes = {
        onFilterChange: PropTypes.func.isRequired,
        categoryList: PropTypes.array.isRequired,
    }
    render(){
        let {onFilterChange,categoryList} = this.props;
        return (
            <Row type="flex" justify="left" align="middle">
                <Col span={2} className="text-right">
                   <span>类别</span> 
                </Col>
                <Col span={4}>
                    <Select className="select-block" defaultValue="-1" onChange={(val)=>onFilterChange('category',val)}>
                        <Option value="-1" key="-1">不限</Option>
                        {categoryList.map(item=><Option value={item._id} key={item._id}>{item.name}</Option>)}
                    </Select>
                </Col>
                <Col span={2} className="text-right">
                   <span>是否上架</span>
                </Col>
                <Col span={2}>
                    <Select className="select-block" defaultValue="-1"  onChange={(val)=>onFilterChange('onSale',val)}>
                        <Option value="-1">不限</Option>
                        <Option value="1">是</Option>
                        <Option value="0">否</Option>
                    </Select>
                </Col>
            </Row>
        )
    }
}
export default GoodsList