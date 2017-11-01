import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { $get, $post, $put, $delete ,dateFormat} from '~util/index';

import { Table,Input, Button, Row, Col, Modal} from 'antd';

const { Column } = Table;

@inject('store')
@observer
class Page extends PureComponent{
    constructor(props){
        super(props);
        this.addCategory = this.addCategory.bind(this)
        this.inputCategory = this.inputCategory.bind(this)
        this.updateCategory = this.updateCategory.bind(this)
    }
    static propTypes = {
        match: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired
    }
    @observable changeIndex = 100;
    @observable list = [];
    @observable addLoading = false;
    @observable showModal = false;
    @observable inputCategoryName = '';
    @observable updateCategoryName = '';

    closeModal(isOk){
        if(isOk){
            this.updateRemoteCategory()
        }
        this.showModal = false;
    }
    inputCategory(e){
        this.inputCategoryName = e.target.value;
    }
    updateCategory(e){
        this.updateCategoryName = e.target.value;
    }
    removeCategory(record){
        Modal.confirm({
            title: '提示',
            content:  `确认删除 ${record.name} ?`,
            onOk:()=> {
                this.deleteRemoteCategory(record)
            },
            onCancel() {},
          });
        
    }
    changeCategory(index,record){
        this.editingCategory = record;
        this.updateCategoryName = record.name;
        this.showModal = true;
    }
    async addCategory(){
        let name = this.inputCategoryName;
        if(!name)return false;
        this.addLoading = true;
        try{    
            let res = await $post(`/category/insert`,{name})
            res.data.key = res.data._id;
            this.list.push(res.data)
            this.inputCategoryName = ''
            Modal.success({
                title:'提示',
                content:'添加成功'
            });
        }catch(err){
            Modal.error({
                title:'提示',
                content:err.msg
            });
        }
        this.addLoading = false;
    }
    async deleteRemoteCategory({_id}){
        try{
            await $delete(`/category/${_id}`);
            Modal.success({
                title:'提示',
                content:'删除成功'
            });
            this.list = this.list.filter(item=>item._id !== _id)

        }catch(err){
            Modal.error({
                title:'提示',
                content: err.msg
            });
        }
    }
    async updateRemoteCategory(){
        if(!this.updateCategoryName) return;
        try{
            await $put(`/category/${this.editingCategory._id}`,{name: this.updateCategoryName});
            Modal.success({
                title:'提示',
                content:'修改成功'
            });
            this.list = this.list.map(item=>{
                if(item._id == this.editingCategory._id){
                    item.name = this.updateCategoryName;
                }
                return item;
            })
        }catch(err){
            console.log(err)
        }
    }
    async getCategoryList(){
        try{
            let res =  await $get('/category');
            res.data.forEach(item=>{
                item.key = item._id;
            });
            this.list = res.data;
        }catch(err){
            console.log(err)
        }
    }
    componentWillMount(){
       this.getCategoryList();
    }
    render(){
        let list = this.list;
        return (
            <div>
                <Row>
                    <Col span={6}>
                        <Input placeholder="输入分类名称" value={this.inputCategoryName} onChange={this.inputCategory}/>
                    </Col>
                    <Col span={6} offset={1}>
                        <Button type="primary" onClick={this.addCategory} loading={this.addLoading}>添加分类</Button>
                    </Col>
                </Row>
                <Table style={{marginTop:50}} dataSource={Array.prototype.slice.call(list,0)} pagination={false}>
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

                <Modal
                    title="修改分类名称"
                    visible={this.showModal}
                    onOk={() => this.closeModal(true)}
                    onCancel={() => this.closeModal(false)}
                >
                   <div>
                       <Input value={this.updateCategoryName} onChange={this.updateCategory}/>
                   </div>
                </Modal>
                
            </div>
        )
    }
}

export default Page;