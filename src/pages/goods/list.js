import React from 'react';
// import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { $get, dateFormat} from '~util/index';

import { Table, Button, message} from 'antd';

const { Column } = Table;


@inject('store')
@observer
class GoodsList extends React.PureComponent{
    @observable list = [];
    async getList(){
        try{
            let res = await $get('/cakes');
            this.list = res.data;
        }catch(err){
            message.error(err.msg, 5000)
        }
    }
    componentWillMount(){
        this.getList()
    }
    render(){
        console.log('render-------goods-list')
        let list = this.list
        return(
            <div>
                <div>goods list</div>
                <Table style={{marginTop:50}} dataSource={Array.prototype.slice.call(list,0)} pagination={false} rowKey={record => record._id}>
                    <Column
                        title="名称"
                        key="name"
                        render={(text, record) => (
                            <div>
                                { record.name }
                            </div>
                        )}
                    />
                    <Column
                        title="创建时间"
                        key="createAt"
                        render={(text, record) => (
                            <div>
                                { dateFormat(record.createdAt) }
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
                        render={(text,record,index) => (
                            <div>
                                <Button onClick={()=>this.changeCategory(index,record)}>修改</Button>
                                <Button type="danger" onClick={()=>this.removeCategory(record)}>删除</Button>
                            </div>
                        )}
                    />
                </Table>
            </div>
        )
    }
}

export default GoodsList