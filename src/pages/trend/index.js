import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addCount, reduceCount } from '../../store/actions/countAction';
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
    state = {
        bitPosition: [],//折线1绝对定位
        lineParams: [],//画布参数
    }
    componentDidMount() {
        console.log(this.props);

        console.log(this.refs);
        let rectObject = this.refs.canvas.getBoundingClientRect();
        console.log(rectObject);
        // this.updateCanvas();

        this.createLine()

    }

    updateCanvas() {
        const ctx = this.refs.canvas.getContext('2d');
        const ctx0 = this.refs.bitCanvas0.getContext('2d');
        const { lineParams } = this.state
        for (let i = 0; i < lineParams.length; i++) {
            let ctxNo = ctx + i
            // let ctxCan = bitCanvas + i
            // const ctxNo = this.refs.ctxCan.getContext('2d');

            ctxNo.moveTo(0, 0);
            ctxNo.lineTo(lineParams.lineToX, lineParams.lineToY);
        }

        ctx.moveTo(0, 0);
        ctx.lineTo(100, 90);
        ctx.lineTo(20, 90);

        ctx.stroke();
    }

    createLine = () => {
        let bitIds0 = document.getElementsByClassName("Bit0")
        let bitIds1 = document.getElementsByClassName("Bit1")
        let bitIds2 = document.getElementsByClassName("Bit2")
        let bitIds3 = document.getElementsByClassName("Bit3")
        let bitIds4 = document.getElementsByClassName("Bit4")
        let bitIds5 = document.getElementsByClassName("Bit5")
        let bitIds6 = document.getElementsByClassName("Bit6")
        let bitIds7 = document.getElementsByClassName("Bit7")
        let bitIds8 = document.getElementsByClassName("Bit8")
        let bitIds9 = document.getElementsByClassName("Bit9")
        // let childWidth = ids.offsetWidth;
        console.log(bitIds0);
        let bitPosition = []
        for (let i = 1; i < bitIds0.length; i++) {
            if (bitIds0[i].innerText) {
                bitPosition.push(bitIds0[i].getBoundingClientRect())
            }
        }

        for (let i = 1; i < bitIds1.length; i++) {
            if (bitIds1[i].innerText) {
                bitPosition.push(bitIds1[i].getBoundingClientRect())
            }
        }
        for (let i = 1; i < bitIds2.length; i++) {
            if (bitIds2[i].innerText) {
                bitPosition.push(bitIds2[i].getBoundingClientRect())
            }
        }
        for (let i = 1; i < bitIds3.length; i++) {
            if (bitIds3[i].innerText) {
                bitPosition.push(bitIds3[i].getBoundingClientRect())
            }
        }
        for (let i = 1; i < bitIds4.length; i++) {
            if (bitIds4[i].innerText) {
                bitPosition.push(bitIds4[i].getBoundingClientRect())
            }
        }
        for (let i = 1; i < bitIds5.length; i++) {
            if (bitIds5[i].innerText) {
                bitPosition.push(bitIds5[i].getBoundingClientRect())
            }
        }
        for (let i = 1; i < bitIds6.length; i++) {
            if (bitIds6[i].innerText) {
                bitPosition.push(bitIds6[i].getBoundingClientRect())
            }
        }
        for (let i = 1; i < bitIds7.length; i++) {
            if (bitIds7[i].innerText) {
                bitPosition.push(bitIds7[i].getBoundingClientRect())
            }
        }
        for (let i = 1; i < bitIds8.length; i++) {
            if (bitIds8[i].innerText) {
                bitPosition.push(bitIds8[i].getBoundingClientRect())
            }
        }
        for (let i = 1; i < bitIds9.length; i++) {
            if (bitIds9[i].innerText) {
                bitPosition.push(bitIds9[i].getBoundingClientRect())
            }
        }

        // console.log(childWidth);

        let lineParams = []
        for (let i = 0; i < bitPosition.length; i++) {
            for (let j = 1; j < bitPosition.length; j++) {
                lineParams.push(
                    {
                        width: Math.abs(bitPosition[i].x - bitPosition[j].x),
                        height: Math.abs(bitPosition[i].y - bitPosition[j].y),
                        left: bitPosition[i].x + bitPosition[i].width / 2,
                        top: bitPosition[i].y + bitPosition[i].height / 2,
                        lineToX: bitPosition[j].x,
                        lineToY: bitPosition[j].y,
                    }
                )
            }
        }

        console.log(lineParams);
        this.setState({
            bitPosition,
            lineParams,
        })

    }

    createCanvas = () => {
        const { lineParams } = this.state
        lineParams.map((item, index) => {
            return (
                <canvas key={index} ref={"bitCanvas" + index} width={item.width} height={item.height}
                    style={{ background: "#ccc", position: "absolute", left: item.left, top: item.top }}
                ></canvas>
            )
        })
    }

    search = () => {
        console.log(this.props);
        this.props.setStateData({
            a: 3
        })
    }

    columns = [
        {
            title: "期号",
            dataIndex: "ti",
            // width: "78px"
        },
        {
            title: "奖号",
            dataIndex: "",
            // width: "57px"
        },
        {
            title: "和值",
            dataIndex: "",
            // width: "40px"
        },
        {
            title: "跨度",
            dataIndex: "",
            // width: "40px"
        },
        {
            title: "个位",
            dataIndex: "",
            // width: "241px",
            padding: 0,
            children: [
                {
                    title: '0',
                    dataIndex: 'qq',
                    className: "Bit0",
                    // render: (text, record, index, e) => {
                    //     return (
                    //         <div  onClick={e => this.getXY(e)}>{text}</div>
                    //     )
                    // },
                },
                {
                    title: '1',
                    dataIndex: 'e',
                    className: "Bit1",
                },
                {
                    title: '2',
                    dataIndex: 'e',
                    className: "Bit2",
                },
                {
                    title: '3',
                    dataIndex: 'w',
                    className: "Bit3",
                },
                {
                    title: '4',
                    dataIndex: 'wqq',
                    className: "Bit4",
                },
                {
                    title: '5',
                    dataIndex: 'df',
                    className: "Bit5",
                },
                {
                    title: '6',
                    dataIndex: 'df',
                    className: "Bit6",
                },
                {
                    title: '7',
                    dataIndex: 'fd',
                    className: "Bit7",
                },
                {
                    title: '8',
                    dataIndex: 'dff',
                    className: "Bit8",
                },
                {
                    title: '9',
                    dataIndex: 'fff',
                    className: "Bit9",
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
                    dataIndex: "",
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
            <div className="main">
                <Layout style={{ height: "100%" }}>
                    <div style={{ background: "#5757b1", height: "100px", padding: "0", display: "flex", justifyContent: "space-between" }}>
                        <Button ghost type="link" style={{ width: "100px", height: "100%" }}>
                            <UserOutlined color="#fff" style={{ fontSize: "xx-large", lineHeight: "" }} />

                        </Button>
                        <div style={{ margin: "auto 0" }}>
                            <Select
                                defaultValue="1"
                                dropdownStyle={{ fontSize: "large" }}
                                // suffixIcon={<CaretDownOutlined color="#fff" />}
                                size="large"
                                style={{ color: "#fff", fontSize: "xx-large", height: "50px", }} bordered={false}
                            >
                                <Option value="1">腾讯十分彩</Option>
                            </Select>
                        </div>
                        <div>
                            <Button ghost size="large" style={{ width: "100px", height: "50px" }}>计划</Button>
                            <Button ghost type="link" style={{ width: "100px", height: "100%" }} onClick={this.search}>
                                <SearchOutlined color="#fff" style={{ fontSize: "xx-large", lineHeight: "" }} />

                            </Button>
                        </div>
                    </div>
                    <Content style={{ padding: "" }}>
                        <div style={{ height: "100px", lineHeight: "100px", padding: "0 50px" }}>
                            <span style={{}}>第
                            <span>{111}</span>
                             期
                             </span>
                            <span>距开奖
                                <span>{} </span>
                            </span>
                        </div>
                        <Divider style={{ margin: "5px 0", background: "#ccc" }} />
                        <div style={{ height: "100px", lineHeight: "100px", display: "flex", padding: "0 40px" }}>
                            <div>第{1}期结果</div>
                            <div className="prizeBall">1</div>
                            <div className="prizeBall">1</div>
                            <div className="prizeBall">1</div>
                            <div className="prizeBall">1</div>
                            <div>开奖时间：</div>
                        </div>

                        <div style={{ padding: "0 40px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", height: "80px", lineHeight: "80px" }}>
                                <div>定位</div>
                                <a href="#:javascript">万位</a>
                                <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                                <a href="#:javascript">千位</a>
                                <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                                <a href="#:javascript">百位</a>
                                <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                                <a href="#:javascript">十位</a>
                                <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                                <a href="#:javascript">个位</a>
                                <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                                <a href="#:javascript">大小单双</a>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", height: "80px", lineHeight: "80px" }}>
                                <div>其他</div>
                                <a href="#:javascript">五星走势</a>
                                <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                                <a href="#:javascript">五星综合</a>
                                <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                                <a href="#:javascript">大小</a>
                                <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                                <a href="#:javascript">单双</a>
                                <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                                <a href="#:javascript">龙虎</a>
                            </div>
                        </div>
                        <div className="canvasTable">

                            <Table
                                columns={this.columns}
                                className="list"
                                // style={{ width: "100%", position: "absolute" }}
                                rowKey={"qq"}
                                bordered
                                pagination={false}
                                // size="small"
                                dataSource={[{ ti: "12345-222", qq: 1, b: 2, c: 3, age: 7 }, { wqq: 11, b: 22, c: 33, age: 27 }]}
                            />


                        </div>

                    </Content>
                    {/* <Footer>

                    </Footer> */}
                    <div
                        // style={{ width: "100%", position: "absolute" }}
                        ref={this.tableRef}
                    >
                        {
                            this.createCanvas
                        }
                        <canvas ref="canvas"
                            width="200" height="100"
                        // style={{ border: "1px solid #000000", position: "absolute" }}
                        > 您的浏览器不支持 HTML5 canvas 标签。</canvas>

                    </div>
                </Layout>
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