import React, { Component } from 'react';
import { Layout, Button, Select, Table, Divider } from 'antd';
import { UserOutlined, CaretDownOutlined, SearchOutlined } from '@ant-design/icons'
import './index.css'

const { Option } = Select;
const { Header, Footer, Sider, Content } = Layout;
class Trend extends Component {
    render() {
        const posation = ["万位", "千位", "百位", "十位", "个位", "大小单双"]
        const other = ["五星走势", "五星综合", "大小", "单双", "龙虎"]
        const columns=[
            {
                title:"期号",
                dataIndex:"",
                width:"10%"
            },
            {
                title:"奖号",
                dataIndex:"",
                width:"10%"
            },
            {
                title:"和值",
                dataIndex:"",
                width:"10%"
            },
            {
                title:"跨度",
                dataIndex:"",
                width:"10%"
            },
            {
                title:"个位",
                dataIndex:"",
                width:"10%"
            },
            {
                title:"个位形态分布",
                dataIndex:"",
                width:"10%"
            },
            {
                title:"个位012路",
                dataIndex:"",
                width:"10%"
            },
            {
                title:"个位",
                dataIndex:"",
                width:"10%"
            },
            {
                title:"个位振幅",
                dataIndex:"",
                width:"10%"
            },
        ]
        return (
            <div className="main">
                <Layout style={{height:"100%"}}>
                    <div style={{ background: "#5757b1", height: "52px", padding: "10px 0", display: "flex", justifyContent: "space-between" }}>
                        <Button ghost type="link">
                            <UserOutlined color="#fff" />

                        </Button>
                        <div>
                            <Select defaultValue="1"
                                // suffixIcon={<CaretDownOutlined color="#fff" />}
                                style={{ color: "#fff" }} bordered={false}>
                                <Option value="1">腾讯十分彩</Option>
                            </Select>
                        </div>
                        <div>
                            <Button ghost size="small">计划</Button>
                            <Button ghost type="link">
                                <SearchOutlined color="#fff" />

                            </Button>
                        </div>
                    </div>
                    <Content style={{ padding: "0 10px" }}>
                        <div>
                            <span>第{111}期</span><span>距开奖{}</span>
                        </div>
                        <Divider style={{ margin: "5px 0", background: "#ccc" }} />
                        <div style={{ height: "40px", lineHeight: "40px", display: "flex" }}>
                            <div>第{1}期结果</div>
                            <div className="prizeBall">1</div>
                            <div className="prizeBall">1</div>
                            <div className="prizeBall">1</div>
                            <div className="prizeBall">1</div>
                            <div>开奖时间：</div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>定位</div>
                            <a href="">万位</a>
                            <Divider type="vertical" style={{ margin: "5px 0", background: "#ccc" }} />
                            <a href="">千位</a>
                            <Divider type="vertical" style={{ margin: "5px 0", background: "#ccc" }} />
                            <a href="">百位</a>
                            <Divider type="vertical" style={{ margin: "5px 0", background: "#ccc" }} />
                            <a href="">十位</a>
                            <Divider type="vertical" style={{ margin: "5px 0", background: "#ccc" }} />
                            <a href="">个位</a>
                            <Divider type="vertical" style={{ margin: "5px 0", background: "#ccc" }} />
                            <a href="">大小单双</a>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>其他</div>
                            <a href="">五星走势</a>
                            <Divider type="vertical" style={{ margin: "5px 0", background: "#ccc" }} />
                            <a href="">五星综合</a>
                            <Divider type="vertical" style={{ margin: "5px 0", background: "#ccc" }} />
                            <a href="">大小</a>
                            <Divider type="vertical" style={{ margin: "5px 0", background: "#ccc" }} />
                            <a href="">单双</a>
                            <Divider type="vertical" style={{ margin: "5px 0", background: "#ccc" }} />
                            <a href="">龙虎</a>
                        </div>
                        <Table 
                            columns={columns}
                            bordered
                        />
                    </Content>
                    {/* <Footer>

                    </Footer> */}
                </Layout>
            </div>
        );
    }
}

export default Trend;