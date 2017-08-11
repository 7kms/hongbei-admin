import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { withRouter } from 'react-router-dom'; 
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import classNames from 'classnames/bind';
import styles from '~less/login.less';
import { Row, Col, Form, Icon, Input, Button, Checkbox } from 'antd';
import { $post } from '~util/index';
let cx = classNames.bind(styles);
const FormItem = Form.Item;

@observer
class NormalLoginForm extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired
  }
  @observable isLoading = false;
//   constructor(props){
//     super(props)
//     this.isLoading = false;
//   }
  handleSubmit = (e) => {
    e.preventDefault();
    if(this.isLoading)return false;
    this.props.form.validateFields(async (err, values) => {
        console.log(err)
        if (!err) {
            this.isLoading = true;
            try {
                let res = await $post('/admin/login', values)
                console.log(res)
            }catch(e){
                console.log(e)
            }
            this.isLoading = false
        }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
        <div className={cx('content')}>
             <Row type="flex" justify="center" align="middle">
                 <header className={cx('header')}>登录</header>
             </Row>
             <Row  type="flex" justify="center" align="middle">
                <Col sm={8} xs={18}>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <FormItem>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
                        )}
                        </FormItem>
                        <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
                        )}
                        </FormItem>
                        <FormItem>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(
                            <Checkbox>Remember me</Checkbox>
                        )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="button-large" loading={this.isLoading}>
                                Log in
                            </Button>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
       
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm;