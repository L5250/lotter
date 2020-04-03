import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addCount, reduceCount } from '../../store/actions/countAction';
import { Layout, Button, Select, Table, Divider, Modal } from 'antd';
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
        visible: false,
    }
    componentDidMount() {
        this.getData()

        this.svgTable()
        this.svgTable1()
        this.svgTable1a()
        this.svgTable1b()
        this.svgTable2()
        this.svgTable3()
        this.svgTable4()
    }

    getData = () => {
        axios.post(`http://cp.f293.cn/api/index/list`)
            .then(res => {
                console.log('res=>', res);
            })
    }
    getTableData = () => {
        axios.post(`http://cp.f293.cn/api/index/getdata`, "")
            .then(res => {
                console.log('res=>', res);
            })
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
    //个位
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
        draw.polyline(arr).fill('none').stroke({ width: 2, color: 'rgb(204, 0, 0)' });
    }
    //个位形态分布
    //大小
    svgTable1 = () => {
        let draw = SVG('chart_svg1').size(document.getElementById('tableSvg').offsetWidth, document.getElementById('tableSvg').offsetHeight);
        console.log(document.getElementById('tableSvg').offsetHeight);
        let arr = [];
        let shape = document.getElementsByClassName('shape');
        for (let i = 0; i < shape.length; i++) {
            let arrb = [];
            arrb.push(this.getPosition(shape[i], 'left'));
            arrb.push(this.getPosition(shape[i], 'top'));
            arr.push(arrb);
        }
        draw.polyline(arr).fill('none').stroke({ width: 2, color: 'rgb(248, 99, 0)' });
    }
    //奇偶
    svgTable1a = () => {
        let draw = SVG('chart_svg1_1').size(document.getElementById('tableSvg').offsetWidth, document.getElementById('tableSvg').offsetHeight);
        let arr = [];
        let parity = document.getElementsByClassName('parity');
        for (let i = 0; i < parity.length; i++) {
            let arrb = [];
            arrb.push(this.getPosition(parity[i], 'left'));
            arrb.push(this.getPosition(parity[i], 'top'));
            arr.push(arrb);
        }
        draw.polyline(arr).fill('none').stroke({ width: 2, color: 'rgb(42, 82, 127)' });
    }
    //质和
    svgTable1b = () => {
        let draw = SVG('chart_svg1_2').size(document.getElementById('tableSvg').offsetWidth, document.getElementById('tableSvg').offsetHeight);
        console.log(document.getElementById('tableSvg').offsetHeight);
        let arr = [];
        let prime = document.getElementsByClassName('prime');
        for (let i = 0; i < prime.length; i++) {
            let arrb = [];
            arrb.push(this.getPosition(prime[i], 'left'));
            arrb.push(this.getPosition(prime[i], 'top'));
            arr.push(arrb);
        }
        draw.polyline(arr).fill('none').stroke({ width: 2, color: 'rgb(105, 131, 83)' });
    }
    //
    //个位012路
    svgTable2 = () => {
        let draw = SVG('chart_svg2').size(document.getElementById('tableSvg').offsetWidth, document.getElementById('tableSvg').offsetHeight);
        console.log(document.getElementById('tableSvg').offsetHeight);
        let arr = [];
        let bit = document.getElementsByClassName('bit');
        for (let i = 0; i < bit.length; i++) {
            let arrb = [];
            arrb.push(this.getPosition(bit[i], 'left'));
            arrb.push(this.getPosition(bit[i], 'top'));
            arr.push(arrb);
        }
        draw.polyline(arr).fill('none').stroke({ width: 2, color: 'rgb(0, 135, 34)' });
    }
    // 个位生平降
    svgTable3 = () => {
        let draw = SVG('chart_svg3').size(document.getElementById('tableSvg').offsetWidth, document.getElementById('tableSvg').offsetHeight);
        let arr = [];
        let lifting = document.getElementsByClassName('lifting');
        for (let i = 0; i < lifting.length; i++) {
            let arrb = [];
            arrb.push(this.getPosition(lifting[i], 'left'));
            arrb.push(this.getPosition(lifting[i], 'top'));
            arr.push(arrb);
        }
        draw.polyline(arr).fill('none').stroke({ width: 2, color: 'rgb(248, 99, 0)' });
    }
    //个位振幅
    svgTable4 = () => {
        let draw = SVG('chart_svg4').size(document.getElementById('tableSvg').offsetWidth, document.getElementById('tableSvg').offsetHeight);
        let arr = [];
        let amplitude = document.getElementsByClassName('amplitude');
        for (let i = 0; i < amplitude.length; i++) {
            let arrb = [];
            arrb.push(this.getPosition(amplitude[i], 'left'));
            arrb.push(this.getPosition(amplitude[i], 'top'));
            arr.push(arrb);
        }
        draw.polyline(arr).fill('none').stroke({ width: 2, color: 'rgb(30, 136, 238)' });
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

    openModal = () => {
        this.setState({
            visible: true
        })
    }
    handleCancel = () => {
        this.setState({
            visible: false
        })
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
                    dataIndex: "big",
                    render: (text, record, index, e) => {
                        return (
                            <div className={text ? "shape" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: "小",
                    dataIndex: "small",
                    render: (text, record, index, e) => {
                        return (
                            <div className={text ? "shape" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: "奇",
                    dataIndex: "df",
                    render: (text, record, index, e) => {
                        return (
                            <div className={text ? "parity" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: "偶",
                    dataIndex: "as",
                    render: (text, record, index, e) => {
                        return (
                            <div className={text ? "parity" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: "质",
                    dataIndex: "df",
                    render: (text, record, index, e) => {
                        return (
                            <div className={text ? "prime" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: "和",
                    dataIndex: "as",
                    render: (text, record, index, e) => {
                        return (
                            <div className={text ? "prime" : null} >{text}</div>
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
                    dataIndex: "as",
                    render: (text, record, index) => {
                        return (
                            <div className={text ? "bit" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: "1",
                    dataIndex: "qq",
                    render: (text, record, index) => {
                        return (
                            <div className={text ? "bit" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: "2",
                    dataIndex: "w",
                    render: (text, record, index) => {
                        return (
                            <div className={text ? "bit" : null} >{text}</div>
                        )
                    },
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
                    dataIndex: "go",
                    render: (text, record, index) => {
                        return (
                            <div className={text ? "lifting" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: "平",
                    dataIndex: "w",
                    render: (text, record, index) => {
                        return (
                            <div className={text ? "lifting" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: "降",
                    dataIndex: "to",
                    render: (text, record, index) => {
                        return (
                            <div className={text ? "lifting" : null} >{text}</div>
                        )
                    },
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
                    render: (text, record, index) => {
                        return (
                            <div className={text ? "amplitude" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: '1',
                    dataIndex: 'age',
                    render: (text, record, index) => {
                        return (
                            <div className={text ? "amplitude" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: '2',
                    dataIndex: 'age',
                    render: (text, record, index) => {
                        return (
                            <div className={text ? "amplitude" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: '3',
                    dataIndex: 'age',
                    render: (text, record, index) => {
                        return (
                            <div className={text ? "amplitude" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: '4',
                    dataIndex: 'age',
                    render: (text, record, index) => {
                        return (
                            <div className={text ? "amplitude" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: '5',
                    dataIndex: 'age',
                    render: (text, record, index) => {
                        return (
                            <div className={text ? "amplitude" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: '6',
                    dataIndex: 'age',
                    render: (text, record, index) => {
                        return (
                            <div className={text ? "amplitude" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: '7',
                    dataIndex: 'age',
                    render: (text, record, index) => {
                        return (
                            <div className={text ? "amplitude" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: '8',
                    dataIndex: 'age',
                    render: (text, record, index) => {
                        return (
                            <div className={text ? "amplitude" : null} >{text}</div>
                        )
                    },
                },
                {
                    title: '9',
                    dataIndex: 'age',
                    render: (text, record, index) => {
                        return (
                            <div className={text ? "amplitude" : null} >{text}</div>
                        )
                    },
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
                            <Button
                                onClick={this.openModal}
                                style={{ width: "200px", height: "50px", fontSize: "xx-large" }} type="link" ghost>
                                腾讯十分彩 <CaretDownOutlined style={{ color: "#fff", fontSize: "xx-large", marginTop: "-10px" }} />
                            </Button>
                            {/* <Select
                                defaultValue="1"
                                dropdownClassName="headerSelect"
                                suffixIcon={<CaretDownOutlined style={{ color: "#fff", fontSize: "xx-large", marginTop: "-10px" }} />}
                                size="large"
                                style={{ color: "#fff", fontSize: "xx-large", height: "50px", }} bordered={false}
                            >
                                <Option value="1">腾讯十分彩</Option>
                                <Option value="13">22</Option>
                            </Select> */}
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

                        <div>

                            <Table
                                columns={this.columns}
                                className="list"
                                rowKey={"qq"}
                                bordered
                                pagination={false}
                                dataSource={[{ ti: "12345-222",go:2,as:2, big: 12, qq: 1, b: 2, c: 3, age: 7 }, {df:4, wqq: 11,to:2, small: 2, b: 22, c: 33, age: 27 }]}
                            />
                        </div>
                    </Content>
                </Layout>
                <div class="chart_svg" id="chart_svg"></div>

                <div class="chart_svg1" id="chart_svg1"></div>

                <div class="chart_svg2" id="chart_svg2"></div>

                <div class="chart_svg3" id="chart_svg3"></div>

                <div class="chart_svg4" id="chart_svg4"></div>

                <div class="chart_svg1_1" id="chart_svg1_1"></div>

                <div class="chart_svg1_2" id="chart_svg1_2"></div>



                <Modal
                    // title="实时彩类"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={false}
                // okText="确定"
                // cancelText="取消"
                // footer={
                //     <div>
                //         <Button type="primary" style={{ fontSize: "xx-large", height: "60px" }}>确定</Button>
                //         <Button style={{ fontSize: "xx-large", height: "60px" }}>取消</Button>
                //     </div>
                // }
                >
                    <p style={{ fontSize: "x-large" }}>实时彩类</p>
                    <div>
                        1
                    </div>
                    <p></p>
                    <div style={{ fontSize: "x-large" }}>赛车类</div>
                </Modal>

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