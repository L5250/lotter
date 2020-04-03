import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addCount, reduceCount } from '../../store/actions/countAction';
import { Layout, Button, Select, Table, Divider } from 'antd';
import { UserOutlined, CaretDownOutlined, SearchOutlined } from '@ant-design/icons'
import SVG from "svg.js"
import axios from 'axios';
import './index.scss'

const { Option } = Select;
const { Header, Footer, Sider, Content } = Layout;
class Trend extends Component {
    constructor(props) {
        super(props);
        this.tableRef = React.createRef();
    }
    state = {
        bitPosition: [],//折线1绝对定位
        lineParams: [],//画布参数
    }
    componentDidMount() {
        this.svgTable()
    }
    //ajax请求
    getData = () => {
        axios.get('https://5b5e71c98e9f160014b88cc9.mockapi.io/api/v1/lists')
            .then(res => {
                console.log(res);
                console.log(this.state);
            })

        let data = { "code": "1234", "name": "yyyy" };
        axios.post(``, data)
            .then(res => {
                console.log('res=>', res);
            })
    }

    userClick = () => {
        window.location.href = "/#/login"
    }

    svgTable = () => {
        let draw = SVG('chart_svg').size(document.getElementById('tableSvg').offsetWidth, document.getElementById('tableSvg').offsetHeight);
        console.log(document.getElementById('tableSvg').offsetHeight);
        let arr = [];
        let ball_9Arr = document.getElementsByClassName('ball_9');
        for (let i = 0; i < ball_9Arr.length; i++) {
            // console.log(ball_9Arr[i].offsetParent.offsetParent.offsetParent.offsetLeft)
            console.log(this.getPosition(ball_9Arr[i], 'left'));
            console.log(this.getPosition(ball_9Arr[i], 'top'));
            let arrb = [];
            arrb.push(this.getPosition(ball_9Arr[i], 'left'));
            arrb.push(this.getPosition(ball_9Arr[i], 'top'));
            arr.push(arrb);
        }
        draw.polyline(arr).fill('none').stroke({ width: 1, color: '#ff0000' });
    }

    getPosition = (element, name) => {
        // console.log(element, name);
        name = name.toLowerCase().replace("left", "Left").replace("top", "Top");
        let offset = 'offset' + name;
        let offsetWH = name == 'Left' ? 'offsetWidth' : 'offsetHeight';
        let actualLeft = element[offset];
        console.log(actualLeft);
        let current = element.offsetParent;
        // console.log(current);
        if (current == 'table#table.table') { current = null; }
        while (current !== null) {
            actualLeft += current[offset];
            current = current.offsetParent;
        }
        return actualLeft + (element[offsetWH] / 2);
    }

    search = () => {
        console.log(this.props);

    }

    columns = [
        {
            title: "期号",
            dataIndex: "ti",
        },
        {
            title: "奖号",
            dataIndex: "",
        },
        {
            title: "和值",
            dataIndex: "",
        },
        {
            title: "跨度",
            dataIndex: "",
        },
        {
            title: "个位",
            dataIndex: "",
            padding: 0,
            children: [
                {
                    title: '0',
                    dataIndex: 'qq',
                    render: (text, record, index, e) => {
                        return (
                            <div className={text ? "ball_9" : null} >{text}</div>
                        )
                    },

                },
                {
                    title: '1',
                    dataIndex: 'e',
                    render: (text, record, index, e) => {
                        return (
                            <div className={text ? "ball_9" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: '2',
                    dataIndex: 'e',
                    render: (text, record, index, e) => {
                        return (
                            <div className={text ? "ball_9" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: '3',
                    dataIndex: 'w',
                    render: (text, record, index, e) => {
                        return (
                            <div className={text ? "ball_9" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: '4',
                    dataIndex: 'wqq',
                    render: (text, record, index, e) => {
                        return (
                            <div className={text ? "ball_9" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: '5',
                    dataIndex: 'df',
                    render: (text, record, index, e) => {
                        return (
                            <div className={text ? "ball_9" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: '6',
                    dataIndex: 'df',
                    render: (text, record, index, e) => {
                        return (
                            <div className={text ? "ball_9" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: '7',
                    dataIndex: 'fd',
                    render: (text, record, index, e) => {
                        return (
                            <div className={text ? "ball_9" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: '8',
                    dataIndex: 'dff',
                    render: (text, record, index, e) => {
                        return (
                            <div className={text ? "ball_9" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: '9',
                    dataIndex: 'fff',
                    render: (text, record, index, e) => {
                        return (
                            <div className={text ? "ball_9" : null} >{text}</div>
                        )
                    },
                },

            ]
        },
        {
            title: "个位形态分布",
            dataIndex: "",
            // width: "146px",
            children: [
                {
                    title: "大",
                    dataIndex: "q",
                      render: (text, record, index, e) => {
                        return (
                            <div className={text ? "shape" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: "小",
                    dataIndex: "q",
                      render: (text, record, index, e) => {
                        return (
                            <div className={text ? "shape" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: "奇",
                    dataIndex: "q",
                      render: (text, record, index, e) => {
                        return (
                            <div className={text ? "shape" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: "偶",
                    dataIndex: "w",
                      render: (text, record, index, e) => {
                        return (
                            <div className={text ? "shape" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: "质",
                    dataIndex: "w",
                      render: (text, record, index, e) => {
                        return (
                            <div className={text ? "shape" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: "和",
                    dataIndex: "e",
                      render: (text, record, index, e) => {
                        return (
                            <div className={text ? "shape" : null} >{text}</div>
                        )
                    },
                },
            ]
        },
        {
            title: "个位012路",
            dataIndex: "",
            // width: "72px",
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
            // width: "72px",
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
            // width: "10%",
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
    render() {
        const { bitPosition, lineParams } = this.state
        console.log(bitPosition);
        return (
            <div class="tableSvg main" id="tableSvg">
                <Layout style={{ height: "100%" }}>
                    <div style={{ background: "#5757b1", height: "100px", padding: "0", display: "flex", justifyContent: "space-between", zIndex: 999 }}>
                        <Button ghost onClick={this.userClick} type="link" style={{ width: "100px", height: "100%" }}>
                            <UserOutlined color="#fff" style={{ fontSize: "xx-large", lineHeight: "" }} />

                        </Button>
                        <div style={{ margin: "auto 0" }}>
                            <Select
                                defaultValue="1"
                                dropdownClassName="headerSelect"
                                suffixIcon={<CaretDownOutlined style={{ color: "#fff", fontSize: "xx-large", marginTop: "-10px" }} />}
                                size="large"
                                style={{ color: "#fff", fontSize: "xx-large", height: "50px", }} bordered={false}
                            >
                                <Option value="1">腾讯十分彩</Option>
                                <Option value="13">22</Option>
                            </Select>
                        </div>
                        <div>
                            <Button ghost size="large" style={{ width: "100px", height: "50px" }}>计划</Button>
                            <Button ghost type="link" style={{ width: "100px", height: "100%" }} onClick={this.search}>
                                <SearchOutlined color="#fff" style={{ fontSize: "xx-large", lineHeight: "" }} />

                            </Button>
                        </div>
                    </div>
                    <div style={{ height: "100px", lineHeight: "100px", padding: "0 50px" }}>
                        <span style={{}}>第
                            <span style={{ fontSize: "50px", color: "#f7833b" }}>{111}</span>
                             期
                             </span>
                        <span style={{ margin: "0 20px" }}>距开奖
                                <span style={{ fontSize: "50px", color: "#f7833b" }}>{222} </span>
                        </span>
                    </div>
                    <Divider style={{ margin: "5px 0", background: "#ccc" }} />
                    <div style={{ height: "100px", lineHeight: "100px", display: "flex", padding: "0 40px" }}>
                        <div style={{ marginRight: "20px" }}>
                            <span>第</span>
                            <span style={{ margin: "0 10px" }}>{1}</span>
                            <span>期结果</span>
                        </div>
                        <div className="prizeBall">1</div>
                        <div className="prizeBall">1</div>
                        <div className="prizeBall">1</div>
                        <div className="prizeBall">1</div>
                        <div>开奖时间：11111</div>
                    </div>

                    <div style={{ padding: "0 40px", zIndex: 999 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", height: "80px", lineHeight: "80px" }}>
                            <div className="firstWord">定位</div>
                            <Button style={{ fontSize: "xx-large", height: "80px" }} type="link">万位</Button>
                            <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                            <Button style={{ fontSize: "xx-large", height: "80px" }} type="link">千位</Button>
                            <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                            <Button style={{ fontSize: "xx-large", height: "80px" }} type="link">百位</Button>
                            <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                            <Button style={{ fontSize: "xx-large", height: "80px" }} type="link">十位</Button>
                            <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                            <Button style={{ fontSize: "xx-large", height: "80px" }} type="link">个位</Button>
                            <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                            <Button style={{ fontSize: "xx-large", height: "80px" }} type="link">大小单双</Button>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", height: "80px", lineHeight: "80px", margin: "20px 0" }}>
                            <div className="firstWord">其他</div>
                            <Button style={{ fontSize: "xx-large", height: "80px" }} type="link">五星走势</Button>
                            <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                            <Button style={{ fontSize: "xx-large", height: "80px" }} type="link">五星综合</Button>
                            <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                            <Button style={{ fontSize: "xx-large", height: "80px" }} type="link">大小</Button>
                            <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                            <Button style={{ fontSize: "xx-large", height: "80px" }} type="link">单双</Button>
                            <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                            <Button style={{ fontSize: "xx-large", height: "80px" }} type="link">龙虎</Button>
                        </div>
                    </div>
                    <Content style={{ padding: "" }}>

                        <div class="tableSvg" id="tableSvg">

                            <Table
                                columns={this.columns}
                                className="list"
                                rowKey={"qq"}
                                bordered
                                pagination={false}
                                dataSource={[{ ti: "12345-222", qq: 1, b: 2, c: 3, age: 7 }, { wqq: 11, b: 22, c: 33, age: 27 }]}
                            />
                        </div>
                    </Content>
                </Layout>
                <div class="chart_svg" id="chart_svg"></div>

                <div class="chart_svg" id="chart_svg"></div>

                <div class="chart_svg" id="chart_svg"></div>
                
                <div class="chart_svg" id="chart_svg"></div>

                <div class="chart_svg" id="chart_svg"></div>


            </div>
        );
    }
}

//需要渲染什么数据
function mapStateToProps(state) {
    return {
        count: state.countReducer.count
    }
}

//需要触发什么行为
function mapActionToProps(dispatch) {
    return {
        addCount: () => dispatch(addCount()),
        reduceCount: (num) => dispatch(reduceCount(num))
    }
}

export default connect(mapStateToProps, mapActionToProps)(Trend)