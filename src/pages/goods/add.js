import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable,action } from 'mobx';
import {$post,$get} from '~util/index'
import {serverUrl} from '~util/config'
// import classNames from 'classnames/bind';
// import styles from '~less/goodsadd.less';
import { Row, Col, Form, Icon, Input, Button, Switch, Upload, Modal,Radio } from 'antd';
// let cx = classNames.bind(styles);
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const uploadAction = `${serverUrl}/admin/upload`;

// @inject('store')
@observer
class GoodsAdd extends React.PureComponent{
    constructor(props){
        super(props)
        this.uploadCover = this.uploadCover.bind(this)
        this.uploadPictures = this.uploadPictures.bind(this)
        this.uploadMainPageCover = this.uploadMainPageCover.bind(this)
    }
    static propTypes = {
        form: PropTypes.object.isRequired,
        // store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }
    @observable showStandard = false;
    @observable standardError = false;
    @observable priceInfoError = false;
    @observable standardList = [];
    
    @observable categoryList = [];
    @observable currentStandard = {
        text:'',
        price:''
    };
    async initialData(){
       let res =  await $get('/category');
       this.categoryList = res.data;
    }
    componentWillMount(){
        this.initialData()
    }
    uploadMainPageCover(info){
        const { getFieldValue } = this.props.form;
        if (info.file.status === 'done') {
                return info.file.response.path
          }else{
              return getFieldValue('mainPageCover')
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
        if (info.file.status === 'done') {
            return info.fileList.map(file=>{
                return file.response.path
            })
        }else{
            getFieldValue('pictures')
        }
    }
    confirm(values){
        console.log(values)
        Modal.confirm({
            title: '提示',
            content: '确认提交?',
            onOk:() =>{
              this.postData(values)
            }
        });
    }
    async postData(values){
        this.isLoading = true;
        try {
            await $post('/cakes/insert',values) 
            this.props.form.resetFields();
            Modal.success({
                title:'提示',
                content: '添加成功',
                onOk:()=>{
                    this.props.history.replace('/goods/list')
                }
            })
        }catch(err){
            Modal.error({
                title:'提示',
                content: err.msg
            })
        }
        this.isLoading = false;
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                // values.standards = values.standards.trim().split(/\s+/)
                // this.confirm(values);
                if(this.standardList.length < 1){
                    this.priceInfoError = true;
                }else{
                    values.priceInfo = this.standardList;
                    this.confirm(values);
                }
            }
        });
    }
    addStandard = ()=>{
        this.currentStandard = {
            text:'',
            price:''
        }
        this.showStandard = true;
    }
    removeStandard = (index)=>{
        this.standardList.splice(index,1);
    }

    @action setStandard = ()=>{
        let obj = this.currentStandard;
        let reg = /^\d+(\.?\d+)?$/;
        if(!obj.text || !reg.test(obj.price)){
            this.standardError = true;
        }else{
            this.standardError = false;
            this.showStandard = false;
            this.priceInfoError = false;
            this.standardList.push(obj)
        }
    }

    calcelStandard = ()=>{
        this.showStandard = false;
    }
    changeStandard = (type,e)=>{
        let value = e.target.value;
        this.currentStandard[type] = value
    }
    render() {
        const { getFieldDecorator,getFieldValue } = this.props.form;
        return (
            <div>
                <Modal
                        title="设置规格"
                        visible={this.showStandard}
                        onOk={this.setStandard}
                        onCancel={this.calcelStandard}
                    >
                    <Input placeholder="规格" value={this.currentStandard.text} onChange={(e)=>this.changeStandard('text',e)}/>
                    <br/>
                    <Input placeholder="价格(元)" value={this.currentStandard.price} onChange={(e)=>this.changeStandard('price',e)}/>
                    {
                        this.standardError ? <div className="error" style={{color:'red'}}>格式不正确</div> : null
                    }
                </Modal>
                <div>
                    图片尽量小(jpg格式)，否则加载时间会比较长<br/>
                    产品封面： 建议 350*350（正方形）， 最小175*175<br/>
                    产品详情： 建议 750*750（正方形）， 最小375*375<br/>
                    首页封面： 建议 750*400（长方形）， 最小375*200<br/>
                </div>
                <Form onSubmit={this.handleSubmit}>
                <Row type="flex" justify="space-between">
                    <Col span={12}>
                        <div className="dfn-label">商品名称</div>
                        <FormItem>
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请填写商品名称!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="商品名称" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <div className="dfn-label">商品库存(个)</div>
                        <FormItem>
                            {getFieldDecorator('store', {
                                rules: [
                                    { required: true, message: '请填写商品库存!' },
                                    { pattern: /^\d+$/, message: '库存只能填写整数!'}],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="text" placeholder="商品库存" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
               <Row>
                     <div className="dfn-label">商品描述</div>
                     <FormItem>
                        {getFieldDecorator('description', {
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
                        <Upload name="file" action={uploadAction} showUploadList={false} listType="picture-card">
                            <div>
                                <Icon type="plus" />
                                <div>上传封面</div>
                            </div>
                        </Upload>
                    )}
                 </FormItem>
               </Row>
               <Row>
                <div className="dfn-label">首页封面</div>
                <div className="goods-cover">
                    {getFieldValue('mainPageCover') ? <div className="goods-pic"><img src={serverUrl + getFieldValue('mainPageCover') }/></div>: null}
                </div>
                <FormItem>
                    {getFieldDecorator('mainPageCover', {
                        getValueFromEvent: this.uploadMainPageCover,
                        // rules: [{ required: true, message: '请上传商品封面!' }]
                    })(
                        <Upload name="file" action={uploadAction} showUploadList={false} listType="picture-card">
                            <div>
                                <Icon type="plus" />
                                <div>上传首页封面</div>
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
                        <Upload name="file" action={uploadAction} listType="picture-card" showUploadList={{showPreviewIcon: false, showRemoveIcon: true}} ref={(node)=>this.uploadPicNode = node}>
                            <div>
                                <Icon type="plus" />
                                <div>上传照片</div>
                            </div>
                        </Upload>
                    )}
                 </FormItem>
               </Row>
               <Row>
                     <div className="dfn-label">商品规格</div>
                     {this.priceInfoError ? <div className="error">请添加规格和价格</div> : null}
                     <FormItem>
                        <div>
                            <Button type="primary" onClick={this.addStandard}>添加规格</Button>
                        </div>
                        <div>
                            {this.standardList.map((item,index)=>{
                                return <div key={index}>
                                    <span>{item.text}</span>&emsp;&emsp;<span>{'Ｙ' + item.price}</span>&emsp;&emsp;<Button type="danger" onClick={()=>this.removeStandard(index)}>删除</Button>
                                </div>
                            })}
                        </div>
                    </FormItem>
               </Row>
               <Row>
                     <div className="dfn-label">商品分类</div>
                     <FormItem>
                        {getFieldDecorator('category',{
                            
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
               <Row>
                     <div className="dfn-label">订购帮助</div>
                     <FormItem>
                        {getFieldDecorator('helpInfo')(
                            <Input type="textarea" placeholder="订购帮助" /> 
                        )}
                    </FormItem>
               </Row>
               <Row type="flex" justify="space-between">
                    <Col span={7}>
                        <div className="dfn-label">是否展示在首页</div>
                        <FormItem>
                        {getFieldDecorator('onMainPage', { valuePropName: 'checked' ,initialValue: false})(
                            <Switch 
                                checkedChildren={<Icon type="check" />} 
                                unCheckedChildren={<Icon type="cross" />}/>
                        )}
                        </FormItem>
                    </Col>
                </Row>
               <Row type="flex" justify="space-between">
                    <Col span={7}>
                        <div className="dfn-label">是否上架</div>
                        <FormItem>
                        {getFieldDecorator('onSale', { valuePropName: 'checked' ,initialValue: false})(
                            <Switch 
                                checkedChildren={<Icon type="check" />} 
                                unCheckedChildren={<Icon type="cross" />}/>
                        )}
                        </FormItem>
                    </Col>
                </Row>
                <FormItem>
                    <Button type="primary" htmlType="submit" loading={this.isLoading}>
                       提交
                    </Button>
                </FormItem>
            </Form>
            </div>
            
        );
      }
}

const Add = Form.create()(GoodsAdd);
export default Add;