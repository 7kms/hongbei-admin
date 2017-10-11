import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
// import {$post} from '~util/index'
import {serverUrl} from '~util/config'
// import classNames from 'classnames/bind';
// import styles from '~less/goodsadd.less';
import {Icon, Button, Upload, Modal,message,Input } from 'antd';
const { TextArea } = Input;

const uploadAction = `${serverUrl}/admin/upload`;

@observer
class Paragraph extends React.PureComponent {
    @observable picture = '';
    @observable text = '';
    static defaultProps = {
        show: true,
        isAdd: true,
        info: {}
    }
    static propTypes = {
        isAdd: PropTypes.bool.isRequired,
        show: PropTypes.bool.isRequired,
        info: PropTypes.object.isRequired,
        onHandel: PropTypes.func.isRequired
    }
    handleOk = ()=>{
        let obj = {
            picture : this.picture,
            text: this.text
        }
        this.props.onHandel(obj)
    }
    handleCancel = ()=>{
        this.props.onHandel()
    }
    onChangeTextArea = (e)=>{
        this.text = e.target.value
    }
    uploadPicture = (info)=>{
        if (info.file.status === 'done') {
            this.picture = info.file.response.path;
            message.success(`${info.file.name} file uploaded successfully`);
        }
    }
    render(){
        let {isAdd,show,info} = this.props
        return (
            <Modal
                title={isAdd ? '添加段落' : '编辑段落'}
                visible={show}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
            <div>
                <Upload name="file" 
                    showUploadList={false}
                    onChange={this.uploadPicture}
                    action={uploadAction}>
                    <Button>
                        <Icon type="upload" /> 上传段落照片
                    </Button>
                </Upload>
                <div>
                    {this.picture ? <img src={ serverUrl + this.picture}/> : null}
                    <div></div>
                    <TextArea 
                        placeholder="请输入段落文字"
                        autosize 
                        defaultValue={info.text} 
                        value = {this.text}
                        onChange={this.onChangeTextArea}
                        />
                </div>
            </div>
          </Modal>
        );
    }
}

// @inject('store')
@observer
export default class CourseAdd extends React.PureComponent{
    constructor(props){
        super(props)
    }
    static propTypes = {
        // store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }
    @observable showParagraph = false;
    @observable isAdd = true;
    @observable sections = [];
    @observable currentInfo = {}
    uploadCover = (info)=>{
        // const { getFieldValue } = this.props.form;
        if (info.file.status === 'done') {
                return info.file.response.path
          }else{
            //   return getFieldValue('cover')
          }
    }
    submit = ()=>{

    }
    addParagraph = ()=>{
        this.showParagraph = true;
        this.currentInfo = {};
        this.isAdd = true;
    }
    handelParagraph = (obj)=>{
        if(obj){
            this.sections.push(obj)
        }
        this.showParagraph = false;
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
    render() {
        return (
            <div>
                <Upload name="file" action={uploadAction} showUploadList={false} listType="picture-card">
                    <div>
                        <Icon type="plus" />
                        <div>上传封面</div>
                    </div>
                </Upload>
                {
                    this.sections.length ? 
                    this.sections.map((info,index)=>(
                        <div key={index}>
                            {info.picture ? <img src={ serverUrl + info.picture}/> : null}
                            <div>{info.text}</div>
                        </div>
                    ))
                    : null
                }
                <Button type="primary" onClick={this.submit} loading={this.isLoading}>
                    提交
                </Button>
                <Button type="primary" onClick={this.addParagraph}>
                    添加段落
                </Button>
                <Paragraph 
                    info={this.currentInfo} 
                    isAdd={this.isAdd} 
                    show={this.showParagraph}
                    onHandel={this.handelParagraph}
                    />
            </div>
        );
      }
}