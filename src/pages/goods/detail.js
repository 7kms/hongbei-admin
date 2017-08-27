import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import {$put,$get,$delete} from '~util/index'
import {serverUrl} from '~util/config'
// import classNames from 'classnames/bind';
// import styles from '~less/goodsadd.less';
import { Row, Col, Form, Icon, Input, Button, Switch, Upload, Modal,Radio,message} from 'antd';
// let cx = classNames.bind(styles);
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const uploadAction = `${serverUrl}/admin/upload`;

// @inject('store')
@observer
class GoodsDetail extends React.PureComponent{
    constructor(props){
        super(props)
        this.uploadCover = this.uploadCover.bind(this)
        this.uploadPictures = this.uploadPictures.bind(this)
        this.deleteRemoteGoods = this.deleteRemoteGoods.bind(this)
    }
    static propTypes = {
        form: PropTypes.object.isRequired,
        // store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        match:  PropTypes.object.isRequired
    }
    @observable categoryList = [];
    @observable info={};
    @observable loading= true;
    @observable disabled= false;
    // @observable initialPicture= false

    generatePictureList(arr){
       return arr.map((item)=>{
           return {
                uid: Math.random(),
                status: 'done',
                url: item,
                thumbUrl: serverUrl + item,
                response:{
                    path: item
                }
           }
       })
    }

    async initialData(){
        let {_id} = this.props.match.params;
        Promise.all([$get(`/cakes/${_id}`), $get('/category')])
        .then(res=>{
            this.categoryList = res[1].data;
            this.info = {...res[0].data}
            this.info.coverLList = this.generatePictureList([res[0].data.cover])
            this.info.picLList = this.generatePictureList(res[0].data.pictures)
            this.initialPicture = true;
            this.loading = false;
            console.log(this,this.initialPicture)
        }).catch(data=>{
            Modal.error({
                title: 'error',
                content: data.err
            })
        })
    }
    componentWillMount(){
        this.initialData()
    }
    componentDidUpdate=()=>{
        console.log(this.loading,this.initialPicture)
        if(this.initialPicture){
            this.initialPicture = false;
            this.props.form.setFieldsValue({
                standards: this.info.standards.join(' '),
                cover: this.info.cover,
                pictures: this.info.pictures
            })
        }
    }
    uploadCover(info){
        const { getFieldValue } = this.props.form;
        if (info.file.status === 'done') {
                return info.file.response.path
          }else{
              return getFieldValue('cover')
          }
    }
    uploadPictures(info){
        const { getFieldValue } = this.props.form;
        if (info.file.status === 'done' || info.file.status === 'removed') {
            return info.fileList.map(file=>{
                return file.response.path
            });
            
        }else{
            console.log(getFieldValue('pictures'))
           return getFieldValue('pictures')
        }
    }
    confirm(onOk, content='确认提交?'){
        Modal.confirm({
            title: '提示',
            content,
            onOk
        });
    }
    async deleteRemoteGoods(){
        this.confirm(async ()=>{
            try{
                let {_id} = this.props.match.params;
                await $delete(`/cakes/${_id}`);
                message.warning('删除成功',3);
                this.props.history.replace('/goods/list')
            }catch(err){
                Modal.error({
                    title:'提示',
                    content: err.msg
                })
            }
            
        }, '确认删除?');
    }
    async postData(values){
        try {
            let {_id} = this.props.match.params;
            await $put(`/cakes/${_id}`,values);
            Modal.success({
                title:'提示',
                content: '修改成功',
                onOk:()=>{
                    // window.location.reload()
                }
            })
        }catch(err){
            Modal.error({
                title:'提示',
                content: err.msg
            })
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                values.standards = values.standards.trim().split(/\s+/)
                this.confirm(()=>this.postData(values));
            }
        });
    }
    render() {
        const { getFieldDecorator,getFieldValue } = this.props.form;
        let info = this.info;
        let loading = this.loading;
        return (
            loading 
             ? 
            null
             :
            <Form onSubmit={this.handleSubmit}>
                <Row type="flex" justify="space-between">
                    <Col span={7}>
                        <div className="dfn-label">商品名称</div>
                        <FormItem>
                            {getFieldDecorator('name', {
                                initialValue: info.name,
                                rules: [{ required: true, message: '请填写商品名称!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="商品名称" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={7}>
                        <div className="dfn-label">商品库存(个)</div>
                        <FormItem>
                            {getFieldDecorator('store', {
                                initialValue: info.store,
                                rules: [
                                    { required: true, message: '请填写商品库存!' },
                                    { pattern: /^\d+$/, message: '库存只能填写整数!'}],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="text" placeholder="商品库存" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={7}>
                        <div  className="dfn-label">商品单价(元)</div>
                        <FormItem>
                            {getFieldDecorator('price', {
                                initialValue: info.price,
                                rules: [
                                    { required: true, message: '请填写商品单价!' },
                                    { pattern: /^\d+\.\d{2}$/, message: '单价请保留2位小数!'}
                                ],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="text" placeholder="商品单价" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
               <Row>
                     <div className="dfn-label">商品描述</div>
                     <FormItem>
                        {getFieldDecorator('description', {
                            initialValue: info.description,
                            rules: [{ required: true, message: '请填写商品描述!' }],
                        })(
                            <Input type="textarea" placeholder="商品描述" /> 
                        )}
                    </FormItem>
               </Row>
               <Row>
                <div className="dfn-label">商品封面(建议300*300的jpg)</div>
                <div className="goods-cover">
                    {getFieldValue('cover') ? <div className="goods-pic"><img src={serverUrl + getFieldValue('cover') }/></div>: null}
                </div>
                <FormItem>
                    {getFieldDecorator('cover', {
                        getValueFromEvent: this.uploadCover,
                        rules: [{ required: true, message: '请上传商品封面!' }]
                    })(
                        <Upload  name="file" action={uploadAction} showUploadList={false} defaultFileList={Array.prototype.slice.call(info.coverLList,0)} listType="picture-card">
                            <div>
                                <Icon type="plus" />
                                <div>上传封面</div>
                            </div>
                        </Upload>
                    )}
                 </FormItem>
               </Row>
               <Row>
                <div className="dfn-label">详情照片</div>
                <div className="goods-cover">
                    {getFieldValue('pictures') ? getFieldValue('pictures').map((url,index)=> <div key={index} className="goods-pic"><img src={serverUrl + url}/></div>) : null}
                </div>
                <FormItem>
                    {getFieldDecorator('pictures', {
                        getValueFromEvent: this.uploadPictures,
                        rules: [{ required: true, message: '请上传详情照片!' }]
                    })(
                        <Upload name="file" action={uploadAction} listType="picture-card" defaultFileList={Array.prototype.slice.call(info.picLList,0)} showUploadList={{showPreviewIcon: false, showRemoveIcon: true}} ref={(node)=>this.uploadPicNode = node}>
                            <div>
                                <Icon type="plus" />
                                <div>上传照片</div>
                            </div>
                        </Upload>
                    )}
                 </FormItem>
               </Row>
               <Row>
                     <div className="dfn-label">商品规格(多种规格用空格隔开;如: 半径3cm  半径5cm)</div>
                     <FormItem>
                        {getFieldDecorator('standards', {
                            initialValue: info.standards,
                            rules: [{ required: true, message: '请填写商品规格!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="text" placeholder="商品规格(多种规格用空格隔开;如: 半径3cm  半径5cm)" />
                        )}
                    </FormItem>
               </Row>
               <Row>
                     <div className="dfn-label">商品分类</div>
                     <FormItem>
                        {getFieldDecorator('category',{
                            initialValue: info.category,
                            rules: [{ required: true, message: '请选择商品分类!' }]
                        })(
                            <RadioGroup>
                                {
                                    this.categoryList.map(item=><Radio value={item._id} key={item._id}>{item.name}</Radio>)
                                }
                            </RadioGroup>
                        )}
                    </FormItem>
               </Row>
               <Row type="flex" justify="space-between">
                    <Col span={7}>
                        <div className="dfn-label">是否上架</div>
                        <FormItem>
                        {getFieldDecorator('onSale', { valuePropName: 'checked' ,initialValue: info.onSale})(
                            <Switch 
                                checkedChildren={<Icon type="check" />} 
                                unCheckedChildren={<Icon type="cross" />}/>
                        )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                <Col span={3}>
                    <Button type="primary" htmlType="submit" loading={this.isLoading} disabled={this.disabled}>
                       提交修改
                    </Button>
                </Col>
                <Col span={3} offset={3}>
                    <Button type="danger" onClick={this.deleteRemoteGoods}>
                        删除商品
                    </Button>
                </Col>
               </Row>
            </Form>
        );
      }
}

const Add = Form.create()(GoodsDetail);
export default Add;