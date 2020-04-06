import React, { Component } from 'react'
import { Form, Input, Button, Checkbox, message, Spin } from 'antd'
import axios from 'axios';
// import { post } from '../../util/axios'
import cookie from 'react-cookies'
import './index.css'

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};
const tailLayout = {
    // wrapperCol: { offset: 8, span: 16 },
};



export default class Login extends Component {
    state = {
        loginLoading: false
    }
    componentDidMount() {

    }
    onFinish = values => {
        this.setState({
            loginLoading: true
        })
        console.log('Success:', values);
        // window.location.href = "/"
        // localStorage.setItem("token",111)
        axios.post(`http://t.f293.cn/api/login`, values)
            .then(res => {
                if (res.data.code === 1) {
                    message.success(res.data.msg)
                    console.log('res=>', res);
                    cookie.save('name', res.data.user_info.name)
                    // localStorage.setItem("name", res.data.user_info.name)
                    // localStorage.setItem("id", res.data.user_info.id)
                    window.location.href = "/"
                    this.setState({
                        loginLoading: false
                    })
                } else {
                    message.warning(res.data.msg)
                    this.setState({
                        loginLoading: false
                    })
                }
            })

    };

    onSubmit = () => {
    }
    render() {
        const { loginLoading } = this.state
        return (
            <Spin spinning={loginLoading} size={"large"}>

                <div className="login">
                    <p style={{ textAlign: "center", color: "#4860e6" }}>登录</p>
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

                        <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: "center", margin: "50px" }} >
                            <Button type="primary" onClick={this.onSubmit} htmlType="submit">登录</Button>
                        </Form.Item>
                    </Form>
                    <Button type="link" style={{ textAlign: "right", width: "100%" }} onClick={() => { window.location.href = "/#/logon" }} >没有账号，去注册</Button>

                </div>
            </Spin>
        )
    }
}
