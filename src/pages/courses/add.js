import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import {$get,$put, $post,$delete} from '~util/index';
import {serverUrl} from '~util/config'
import classNames from 'classnames/bind';

import styles from '~less/course-detail.less';
let cx = classNames.bind(styles);
import {Icon, Button, Upload, Modal,message,Input,Switch } from 'antd';
const { TextArea } = Input;

const uploadAction = `${serverUrl}/admin/upload`;

@observer
class Paragraph extends React.PureComponent {
    @observable picture = '';
    @observable desc = '';
    static propTypes = {
        isAdd: PropTypes.bool.isRequired,
        show: PropTypes.bool.isRequired,
        info: PropTypes.object.isRequired,
        onHandel: PropTypes.func.isRequired
    }
    handleOk = ()=>{
        let obj = {
            picture : this.picture,
            desc: this.desc
        }
        this.props.onHandel(obj)
    }
    handleCancel = ()=>{
        this.props.onHandel()
    }
    onChangeTextArea = (e)=>{
        this.desc = e.target.value
    }
    uploadPicture = (info)=>{
        if (info.file.status === 'done') {
            this.picture = info.file.response.path;
            message.success(`${info.file.name} file uploaded successfully`);
        }
    }
    componentWillReceiveProps({info:{picture,desc}}){
        console.log(picture,desc)
        this.picture = picture
        this.desc = desc
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
                    {this.picture ? <img src={ serverUrl + this.picture} style={{maxWidth: 350}}/> : null}
                    <div></div>
                    <TextArea 
                        placeholder="请输入段落文字"
                        autosize 
                        defaultValue={info.desc} 
                        value = {this.desc}
                        onChange={this.onChangeTextArea}
                        />
                </div>
            </div>
          </Modal>
        );
    }
}
@observer
export default class CourseAdd extends React.PureComponent{
    constructor(props){
        super(props)
    }
    static propTypes = {
        // store: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }
    @observable loading = true;
    @observable showParagraph = false;
    @observable isAdd = true;
    @observable info = {
        title:'',
        cover: '',
        isOnline: false,
        sections: []
    };
    @observable currentSection = {};
    uploadCover = (info)=>{
        if (info.file.status === 'done') {
            this.info.cover = info.file.response.path;
            message.success(`${info.file.name} file uploaded successfully`);
        }
    }
    updateRemote =  async (_id)=>{
        try{
            let {cover,isOnline,sections,title} = this.info;
            await $put(`/course/${_id}`,{cover,isOnline,sections,title})
            Modal.success({
                title: '提示',
                content: '修改成功',
                onOk:()=>{
                    this.props.history.replace('/courses/list')
                }
            })
        }catch(data){
            Modal.error({
                title: 'error',
                content: data.err
            })
        }
    }
    addRemote =  async ()=>{
        try{
            let {cover,isOnline,sections,title} = this.info;
            await $post(`/course`,{cover,isOnline,sections,title})
            Modal.success({
                title: '提示',
                content: '添加成功',
                onOk:()=>{
                    this.props.history.replace('/courses/list')
                }
            })
            
        }catch(data){
            Modal.error({
                title: 'error',
                content: data.err
            })
        }
    }
    verify(){
        let {title,cover,sections} = this.info;
        let errorText = '';
        if(!title){
            errorText = '请填写标题';
        }else if(!cover){
            errorText = '请上传封面';
        }else if(!sections.length){
            errorText = '至少填写一个段落';
           
        }
        if(!errorText){
            return true
        }
        Modal.warning({
            title: '警告',
            content: errorText
        })
    }
    submit = ()=>{
        if(!this.verify())return false;
        let {_id} = this.props.match.params;
        if(_id){
            this.updateRemote(_id)
        }else{
            this.addRemote()
        }
    }
    addParagraph = ()=>{
        this.showParagraph = true;
        this.currentSection = {};
        this.isAdd = true;
    }
    handelParagraph = (obj)=>{
        if(obj){
            if(this.isAdd){
                this.info.sections.push(obj)
            }else{
                Object.assign(this.currentSection,obj)
            }
        }
        this.showParagraph = false;
    }
    paragraphEdit = (index)=>{
        this.currentSection = this.info.sections[index];
        this.showParagraph = true;
        this.isAdd = false;
        console.log(index,this.currentSection)
    }
    paragraphRemove = (index)=>{
        this.info.sections = this.info.sections.filter((item,i)=>i!==index)
    }
    changeTitle = (e)=>{
        this.info.title = e.target.value;
    }
    onSwitchChange = (checked)=>{
        this.info.isOnline = checked
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
    removeRemote = ()=>{
        Modal.confirm({
            title: '提示',
            content: '删除后无法恢复?',
            onOk: async () =>{
              let {_id} = this.props.match.params;
              let res = await $delete(`/course/${_id}`);
               Modal.success({
                    title: '提示',
                    content: res.msg
               })
            }
        });
    }
    async initialData(){
        let {_id} = this.props.match.params;
        if(!_id)return false;
        try{
            let res = await $get(`/course/${_id}`)
            this.info = {...res.data}
            this.loading = false;
        }catch(data){
            Modal.error({
                title: 'error',
                content: data.err
            })
        }
    }
    componentWillMount(){
        this.initialData()
    }
    render() {
        let {info} = this;
        let {_id} = this.props.match.params;
        console.log(info.isOnline,'render')
        return (
            <div className={cx('content')}>
                <div className={cx('control')}>
                    <Switch checkedChildren="已发布" unCheckedChildren="未发布" checked={info.isOnline} onChange={this.onSwitchChange}/>
                    <br/>
                    <br/>
                    <Upload name="file" 
                        showUploadList={false}
                        onChange={this.uploadCover}
                        action={uploadAction}>
                        <Button>
                            <Icon type="upload" /> 上传封面
                        </Button>
                    </Upload>
                    <br/>
                    <br/>
                    <Button type="primary" onClick={this.addParagraph}>
                        添加段落
                    </Button>
                    <br/>
                    <br/>
                    <Button type="primary" onClick={this.submit} loading={this.isLoading}>
                        提交
                    </Button>
                    <br/>
                    <br/>
                    {
                        _id ? <Button type="danger" onClick={this.removeRemote}>
                            删除
                        </Button>: null
                    }
                    
                    <Paragraph 
                        info={this.currentSection} 
                        isAdd={this.isAdd} 
                        show={this.showParagraph}
                        onHandel={this.handelParagraph}
                    />
                </div>
                <div className={cx('view')}>
                    <div className={cx('view-title')}>
                        <Input placeholder="请填写标题" onChange={this.changeTitle} value={info.title}/>
                    </div>
                    {
                        info.cover ? <div className={cx('image-cover')} style={{backgroundImage:`url(${serverUrl + info.cover})`}}></div>  : null
                    }
                    <div className={cx('view-composition')}>
                        {
                            info.sections ? 
                            info.sections.map((section,index)=>(
                                <div key={index} className={cx('view-section')}>
                                    {
                                        section.picture ? 
                                        <img src={serverUrl + section.picture} className={cx('image-picture')}/> : null 
                                    }
                                    <pre>{section.desc}</pre>
                                    <div className={cx('paragraph-operate')}>
                                        <Button type="dashed" onClick={()=>this.paragraphEdit(index)}>修改</Button>
                                        <Button type="danger" onClick={()=>this.paragraphRemove(index)}>删除</Button>
                                    </div>
                                </div>
                            ))
                            : null
                        }
                    </div>
                </div>
            </div>
        );
      }
}