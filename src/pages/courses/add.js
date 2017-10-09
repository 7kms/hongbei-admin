import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import {$post,$get} from '~util/index'
import {serverUrl} from '~util/config'
// import classNames from 'classnames/bind';
// import styles from '~less/goodsadd.less';
import {Icon, Button, Upload, Modal } from 'antd';

const uploadAction = `${serverUrl}/admin/upload`;

// @inject('store')
@observer
class GoodsAdd extends React.PureComponent{
    constructor(props){
        super(props)
        this.uploadCover = this.uploadCover.bind(this)
        this.uploadPictures = this.uploadPictures.bind(this)
    }
    static propTypes = {
        form: PropTypes.object.isRequired,
        // store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }
    @observable categoryList = [];
    async initialData(){
       let res =  await $get('/category');
       this.categoryList = res.data;
    }
    componentWillMount(){
        this.initialData()
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
                values.standards = values.standards.trim().split(/\s+/)
                this.confirm(values);
            }
        });
    }
    render() {
        return (
            <div>
                <Upload name="file" action={uploadAction} showUploadList={false} listType="picture-card">
                    <div>
                        <Icon type="plus" />
                        <div>上传封面</div>
                    </div>
                </Upload>
                <div>
                        <Upload name="file" action={uploadAction} listType="picture-card" showUploadList={{showPreviewIcon: false, showRemoveIcon: true}} ref={(node)=>this.uploadPicNode = node}>
                            <div>
                                <Icon type="plus" />
                                <div>上传照片</div>
                            </div>
                        </Upload>
                        <div>
                            <textarea></textarea>
                        </div>
                </div>
                <Button type="primary" htmlType="submit" loading={this.isLoading}>
                       提交
                    </Button>
            </div>
        );
      }
}

export default GoodsAdd;