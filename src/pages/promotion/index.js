import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import {$get,$post,$put} from '~util/index';
import {serverUrl} from '~util/config'
import {Icon, Button, Upload, message, Input, Switch,Row ,Col, Modal} from 'antd';
const { TextArea } = Input;
const uploadAction = `${serverUrl}/admin/upload`;

// @inject('store')
@observer
class Page extends PureComponent{
    @observable acitvity = {
        desc:'',
        title:'',
        picture: '',
        enable: false
    };
    @observable loading = true;
    constructor(props){
        super(props);
    }
    static propTypes = {
        match: PropTypes.object.isRequired
    }
    uploadPicture = (info)=>{
        if (info.file.status === 'done') {
            this.acitvity.picture = info.file.response.path;
            message.success(`${info.file.name} file uploaded successfully`);
        }
    }
    onChangeTitle = (e)=>{
        this.acitvity.title = e.target.value
    }
    onChangeTextArea = (e)=>{
        this.acitvity.desc = e.target.value
    }
    onChangeSwitch = (checked)=>{
        this.acitvity.enable = checked
    }
    async changeRemote({_id,desc,title,picture,enable}){
        let url = '/activity';
        let $api = $post;
        if(_id){
            $api = $put;
            url = url + '/' + _id;
        }
        try{
            await $api(url,{title,desc,picture,enable});
            Modal.success({
                title:'提示',
                content: '提交成功'
            })
        }catch(e){
            console.log(e);
        }
       
    }
    submit = ()=>{
        let {picture} = this.acitvity;
        if(!picture){
            Modal.warn({
                title:'图片不能为空'
            });
            return false;
        }
        this.changeRemote(this.acitvity);
    }
    async getList(){
        try{
            let res = await $get('/activity');
            let obj = res.data[0] || {};
            this.acitvity = Object.assign(this.acitvity,obj);
            this.loading = false;
        }catch(e){
            console.log(e);
        }
    }
    componentWillMount(){
        this.getList()
    }
    render(){
        if(this.loading){
            return null;
        }
        let {enable,picture,title,desc} = this.acitvity;
        return (
            <div>
                <Row>
                    <Input placeholder="活动标题" value={title} onChange={this.onChangeTitle}/>
                </Row>
                <Row>
                    <div>
                        建议 750 * 1366 的jpg格式图片<br/>
                    </div>
                    <Upload name="file" 
                        showUploadList={false}
                        onChange={this.uploadPicture}
                        action={uploadAction}>
                        <Button>
                            <Icon type="upload" /> 上传活动封面
                        </Button>
                    </Upload>
                </Row>
                <Row>
                    { picture ? <div ><img style={{'maxWidth':375}} src={serverUrl + picture}/></div> : null }
                </Row>
                <Row>
                    <TextArea rows={4} placeholder="活动描述" value={desc} onChange={this.onChangeTextArea}/>
                </Row>
                <Row>
                    <Col>是否上线</Col>
                    <Switch 
                        onChange={this.onChangeSwitch}
                        checked={enable}
                        checkedChildren={<Icon type="check" />} 
                        unCheckedChildren={<Icon type="cross" />}/>
                </Row>
                <Row>
                    <Button type="primary" loading={this.isLoading} onClick={this.submit}>
                       提交
                    </Button>
                </Row>
            </div>
        )
    }
}

export default Page;