import React, { Component } from 'react'
import { Form, Input, Button, Checkbox, message } from 'antd'
import axios from 'axios';
import cookie from 'react-cookies'
import './index.scss'

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};
const tailLayout = {
    // wrapperCol: { offset: 8, span: 16 },
};

export default class Login extends Component {
    state = {

    }
    componentDidMount() {

    }
    onFinish = values => {
        // console.log('Success:', values);
        axios.post(`http://cp.f293.cn/api/login/register`, values)
            .then(res => {
                if (res.data.code === 200) {
                    message.success(res.data.msg)
                    console.log('res=>', res);
                    cookie.save('userId', 1)
                    window.location.href="/#/login"
                } else {
                    message.warning(res.data.msg)
                }
            })
    };

    render() {
        return (
            <div className="logon">
                <p style={{textAlign:"center",color:"#4860e6"}}>注册新账号</p>
                <Form
                    {...layout}
                    size="large"
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                >
                    <Form.Item
                        label="用户名"
                        name="name"
                        rules={[{ required: true, message: '请输入用户名！' }]}
                    >
                        <Input placeholder="请输入用户名！" />
                    </Form.Item>

                    <Form.Item
                        style={{ margin: "50px 0" }}
                        label="密码"
                        name="pwd"
                        rules={[{ required: true, message: '请输入密码！' }]}
                    >
                        <Input.Password placeholder="请输入密码！" />
                    </Form.Item>
                    <Form.Item
                        style={{ margin: "50px 0" }}
                        label="确认密码"
                        name="repwd"
                        rules={[{ required: true, message: '请确认密码！' }]}
                    >
                        <Input.Password placeholder="请确认密码！" />
                    </Form.Item>

                    <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: "center", margin: "50px" }} >
                        <Button type="primary" onClick={this.onSubmit} htmlType="submit">注册</Button>
                    </Form.Item>
                </Form>
                <Button  type="link" style={{textAlign:"right",width:"100%"}} onClick={()=>{window.location.href="/#/login"}} >返回登录</Button>

            </div>
        )
    }
}

