import React, { Component } from 'react';
import { Layout, Button, Select, Table, Divider } from 'antd';
import { UserOutlined, CaretDownOutlined, SearchOutlined } from '@ant-design/icons'
import './index.scss'

const { Option } = Select;
const { Header, Footer, Sider, Content } = Layout;
class Trend extends Component {
    constructor(props) {
        super(props);
        this.tableRef = React.createRef();
    }
    componentDidMount() {
        this.updateCanvas();
        console.log(this.refs);
        let rectObject = this.refs.canvas.getBoundingClientRect();
        console.log(rectObject);

    }

    updateCanvas() {
        const ctx = this.refs.canvas.getContext('2d');
        ctx.moveTo(0, 0);
        ctx.lineTo(100, 90);
        ctx.lineTo(20, 90);

        ctx.stroke();
    }
    click=(e)=>{
console.log(e);
// console.log(e.getBoundingClientRect());
    }
    render() {
        const posation = ["万位", "千位", "百位", "十位", "个位", "大小单双"]
        const other = ["五星走势", "五星综合", "大小", "单双", "龙虎"]
        const columns = [
            {
                title: "期号",
                dataIndex: "",
                // width: "40px"
            },
            {
                title: "奖号",
                dataIndex: "",
                // width: "10%"
            },
            {
                title: "和值",
                dataIndex: "",
                // width: "10%"
            },
            {
                title: "跨度",
                dataIndex: "",
                // width: "10%"
            },
            {
                title: "个位",
                dataIndex: "",
                width: "10%",
                padding: 0,
                children: [
                    {
                        title: '0',
                        dataIndex: 'qq',
                        render: (text, record, index,e) => {
                            console.log(text,record,index,e);

                            return (
                                <div onClick={(e)=>this.click(e)}>{text}</div>

                            )
                        }
                    },
                    {
                        title: '1',
                        dataIndex: 'age',
                    },
                    {
                        title: '2',
                        dataIndex: 'age',
                    },
                    {
                        title: '3',
                        dataIndex: 'age',
                    },
                    {
                        title: '4',
                        dataIndex: 'age',
                    },
                    {
                        title: '5',
                        dataIndex: 'age',
                    },
                    {
                        title: '6',
                        dataIndex: 'age',
                    },
                    {
                        title: '7',
                        dataIndex: 'age',
                    },
                    {
                        title: '8',
                        dataIndex: 'age',
                    },
                    {
                        title: '9',
                        dataIndex: 'age',
                    },

                ]
            },
            {
                title: "个位形态分布",
                dataIndex: "",
                width: "10%",
                children: [
                    {
                        title: "大",
                        dataIndex: "",
                        ref: 'big'
                    },
                    {
                        title: "小",
                        dataIndex: "",
                    },
                    {
                        title: "奇",
                        dataIndex: "",
                    },
                    {
                        title: "偶",
                        dataIndex: "",
                    },
                    {
                        title: "质",
                        dataIndex: "",
                    },
                    {
                        title: "和",
                        dataIndex: "",
                    },
                ]
            },
            {
                title: "个位012路",
                dataIndex: "",
                width: "10%",
                children: [
                    {
                        title: "0",
                        dataIndex: "",
                    },
                    {
                        title: "1",
                        dataIndex: "",
                    },
                    {
                        title: "2",
                        dataIndex: "",
                    },
                ]
            },
            {
                title: "个位",
                dataIndex: "",
                width: "10%",
                children: [
                    {
                        title: "升",
                        dataIndex: "",
                    },
                    {
                        title: "平",
                        dataIndex: "",
                    },
                    {
                        title: "降",
                        dataIndex: "",
                    },
                ]
            },
            {
                title: "个位振幅",
                dataIndex: "",
                width: "10%",
                children: [
                    {
                        title: '0',
                        dataIndex: 'age',
                    },
                    {
                        title: '1',
                        dataIndex: 'age',
                    },
                    {
                        title: '2',
                        dataIndex: 'age',
                    },
                    {
                        title: '3',
                        dataIndex: 'age',
                    },
                    {
                        title: '4',
                        dataIndex: 'age',
                    },
                    {
                        title: '5',
                        dataIndex: 'age',
                    },
                    {
                        title: '6',
                        dataIndex: 'age',
                    },
                    {
                        title: '7',
                        dataIndex: 'age',
                    },
                    {
                        title: '8',
                        dataIndex: 'age',
                    },
                    {
                        title: '9',
                        dataIndex: 'age',
                    },

                ]
            },
        ]
        return (
            <div className="main">
                <Layout style={{ height: "100%" }}>
                    <div style={{ background: "#5757b1", height: "52px", padding: "10px 0", display: "flex", justifyContent: "space-between" }}>
                        <Button ghost type="link">
                            <UserOutlined color="#fff" />

                        </Button>
                        <div>
                            <Select defaultValue="1"
                                // suffixIcon={<CaretDownOutlined color="#fff" />}
                                style={{ color: "#fff", fontSize: "large" }} bordered={false}>
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
                        <div style={{ height: "40px", lineHeight: "40px" }}>
                            <span style={{ fontSize: "large" }}>第
                            <span>{111}</span>
                             期
                             </span>
                            <span>距开奖
                                <span>{} </span>
                            </span>
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

                        <div style={{ padding: "0 10px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", height: "40px", lineHeight: "40px" }}>
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
                            <div style={{ display: "flex", justifyContent: "space-between", height: "40px", lineHeight: "40px" }}>
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
                        </div>
                        <div className="canvasTable">

                            <Table
                                columns={columns}
                                className="list"
                                // style={{ width: "100%", position: "absolute" }}
                                bordered
                                dataSource={[{ qq: 1, b: 2, c: 3, age: 7 }]}
                            />
                            <div
                            // style={{ width: "100%", position: "absolute" }} 
                            >
                                <canvas ref="canvas" width="200" height="100"
                                    style={{ border: "1px solid #000000", position: "absolute" }}>
                                    您的浏览器不支持 HTML5 canvas 标签。
                                    </canvas>
                            </div>

                        </div>

                    </Content>
                    {/* <Footer>

                    </Footer> */}
                </Layout>
            </div>
        );
    }
}

export default Trend;