import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { $get, dateFormat} from '~util/index';

import { Table, message, Row} from 'antd';


const { Column } = Table;

@observer
class FeedList extends React.PureComponent{
    constructor(props){
        super(props);
        this.onShowSizeChange = this.onShowSizeChange.bind(this)
        this.onFilterChange = this.onFilterChange.bind(this)
    }

    static propTypes = {
        history: PropTypes.object.isRequired
    }
    
    @observable list = [];
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
            let res = await $get('/feed',{...this.queryInfo})
            this.list = res.data.filter(item=>!!item.user);
            this.total = res.total;
        }catch(err){
            console.log(err);
            message.error(err.msg, 5000)
        }
        this.loading = false;
    }
    componentWillMount(){
        this.getList()
    }
    render(){
        console.log('render-------反馈列表-list')
        let list = this.list;
        let {skip} = this.queryInfo
        return(
            <div>
                <Row style={{marginTop:20,marginBottom:20}} className="text-center">反馈列表</Row>
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
                        title="内容"
                        dataIndex="message"
                    />
                    <Column
                        title="时间"
                        key="createdAt"
                        render={(text, record) => (
                            <div>
                                { dateFormat(record.createdAt) }
                            </div>
                        )}
                    />
                </Table>
            </div>
        )
    }
}

export default FeedList