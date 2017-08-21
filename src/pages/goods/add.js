import React from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import { observable } from 'mobx';
import {$post} from '~util/index'
import {serverUrl} from '~util/config'
// import classNames from 'classnames/bind';
// import styles from '~less/goodsadd.less';
import { Row, Col, Form, Icon, Input, Button, Switch, Upload, Modal } from 'antd';
// let cx = classNames.bind(styles);
const FormItem = Form.Item;
const uploadAction = `${serverUrl}/admin/upload`;

@inject('store')
@observer
class GoodsAdd extends React.PureComponent{
    @observable info = {
        onSale: false,
        cover: ''
    }
    constructor(props){
        super(props)
        this.uploadCover = this.uploadCover.bind(this)
    }
    static propTypes = {
        form: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }
    componentWillMount(){

    }
    uploadCover(info){
        if (info.file.status === 'done') {
            console.log(info)
            return info.file.response.path
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
        try {
            this.isLoading = true;
            let res = await $post('/cakes/insert',values) 
            this.props.store.User.setData(res.data.user)
            this.props.history.replace('/')
        }catch(e){
            console.log(e)
            this.isLoading = false
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                values.standards = values.standards.trim().split(/\s+/)
                this.confirm(values);
            }
        });
    }
    render() {
        const { getFieldDecorator,getFieldValue } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row type="flex" justify="space-between">
                    <Col span={7}>
                        <div className="dfn-label">商品名称</div>
                        <FormItem>
                            {getFieldDecorator('name', {
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
                            rules: [{ required: true, message: '请填写商品描述!' }],
                        })(
                            <Input type="textarea" placeholder="商品描述" /> 
                        )}
                    </FormItem>
               </Row>
               <Row>
                <div className="dfn-label">商品封面(建议300*300的jpg)</div>
                <div className="goods-cover">
                    {getFieldValue('cover') ? <img src={serverUrl + getFieldValue('cover') }/>: null}
                </div>
                <FormItem>
                    {getFieldDecorator('cover', {
                        getValueFromEvent: this.uploadCover,
                        rules: [{ required: true, message: '请上传商品封面!' }]
                    })(
                        <Upload name="file" action={uploadAction} showUploadList={false}>
                            <Button>
                                <Icon type="upload" /> 上传封面
                            </Button>
                        </Upload>
                    )}
                 </FormItem>
               </Row>
               <Row>
                     <div className="dfn-label">商品规格(多种规格用空格隔开;如: 半径3cm  半径5cm)</div>
                     <FormItem>
                        {getFieldDecorator('standards', {
                            rules: [{ required: true, message: '请填写商品规格!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="text" placeholder="商品规格(多种规格用空格隔开;如: 半径3cm  半径5cm)" />
                        )}
                    </FormItem>
               </Row>
               <Row type="flex" justify="space-between">
                    <Col span={7}>
                        <div className="dfn-label">是否上架</div>
                        <FormItem>
                        {getFieldDecorator('onSale', { valuePropName: 'checked' })(
                            <Switch 
                            checkedChildren={<Icon type="check" />} 
                            unCheckedChildren={<Icon type="cross" />}
                            defaultChecked={this.info.onSale}/>
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
        );
      }
}

const Add = Form.create()(GoodsAdd);
export default Add;