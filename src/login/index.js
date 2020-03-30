import React, { Component } from 'react'
import { Form, Input, Button, Checkbox,message } from 'antd'
import axios from 'axios';
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

    }
    onFinish = values => {
        console.log('Success:', values);
        const _this = this;
        axios.get('https://5b5e71c98e9f160014b88cc9.mockapi.io/api/v1/lists')
            .then(function (res) {
                if (res.code === 0) {
                    // Cookie.addCookie("user", res.data.token, 0)
                    // document.cookie = "user=" + res.data.token
                    this.setState({
                        Login: true
                    });
                    window.location.href = '/'
                } else {
                    return message.warning("账号密码错误")
                }
            })
            .catch(function (error) {
                console.log(error);
                _this.setState({
                    isLoaded: false,
                    error: error
                })
            })
    };

    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };
    onSubmit = () => {
        console.log(1);
    }
    render() {
        return (
            <div className="login">
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                >
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[{ required: true, message: '请输入用户名！' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[{ required: true, message: '请输入密码！' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    {/* <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                        <Checkbox>记住我</Checkbox>
                    </Form.Item> */}

                    <Form.Item style={{ textAlign: "center" }} >
                        <Button type="primary" onClick={this.onSubmit} htmlType="submit">登录</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}
