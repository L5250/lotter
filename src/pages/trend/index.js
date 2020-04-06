import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addCount, reduceCount } from '../../store/actions/countAction';
import { Layout, Button, Select, Table, Divider, Modal, message, Spin, Avatar } from 'antd';
import { UserOutlined, CaretDownOutlined, SearchOutlined } from '@ant-design/icons'
import cookie from 'react-cookies'
import axios from 'axios';
import SVG from "svg.js"
import './index.scss'

const { Option } = Select;
const { Header, Footer, Sider, Content } = Layout;
class Trend extends Component {
    constructor(props) {
        super(props);
        this.tableRef = React.createRef();
    }
    state = {
        visible: false,
        headData: [],
        mainLoaing: false,

        loading: false,
        loading1: false,

        dataSource: [],
        newData: [],
        tableStr: "个",

        nextPeriods: "",//下期期号
        lotteryTime: '',//下期开奖时间
        h: "00",
        m: "00",
        s: "00",

        lastPeriods: "",//上期
        lastTime: "",//上期时间
        lastResult: [],//上期结果

        columnsIndex: 0


    }
    componentDidMount() {
        this.getData()
        this.getTableData()
    }

    //
    clearSvg = () => {
        let svg = document.getElementById("chart_svg").getElementsByTagName("svg")
        for (let i = 0; i < svg.length; i++) {
            svg[i].style = "display:none"
        }
        let svg1 = document.getElementById("chart_svg1").getElementsByTagName("svg")
        for (let i = 0; i < svg1.length; i++) {
            svg1[i].style = "display:none"
        }
        let svg1_1 = document.getElementById("chart_svg1_1").getElementsByTagName("svg")
        for (let i = 0; i < svg1_1.length; i++) {
            svg1_1[i].style = "display:none"
        }
        let svg1_2 = document.getElementById("chart_svg1_2").getElementsByTagName("svg")
        for (let i = 0; i < svg1_2.length; i++) {
            svg1_2[i].style = "display:none"
        }
        let svg2 = document.getElementById("chart_svg2").getElementsByTagName("svg")
        for (let i = 0; i < svg2.length; i++) {
            svg2[i].style = "display:none"
        }
        let svg3 = document.getElementById("chart_svg3").getElementsByTagName("svg")
        for (let i = 0; i < svg3.length; i++) {
            svg3[i].style = "display:none"
        }
        let svg4 = document.getElementById("chart_svg4").getElementsByTagName("svg")
        for (let i = 0; i < svg4.length; i++) {
            svg4[i].style = "display:none"
        }
    }
    creataData = (index) => {
        this.setState({
            loading: true,
            columnsIndex: 0,

        })
        setTimeout(() => {
            this.setState({
                loading: false
            })
        }, 1500);
        this.clearSvg()
        // let svg5 = document.getElementById("chart_svg5").getElementsByTagName("svg")
        // for (let i = 0; i < svg5.length; i++) {
        //     svg[i].style = "display:none"
        // }
        // this.forceUpdate();
        // this.refs.chart_svg.style="display:none"
        let { dataSource } = this.state
        let tableStr = ""

        let newData = []
        for (let i = 0; i < dataSource.length; i++) {
            let arr = dataSource[i].h.split(",")
            // let num = dataSource[i].h.charAt(dataSource[i].h.length - index)
            let num = arr[index]
            newData.push({
                s: dataSource[i].s,
                q: dataSource[i].q,
                h: num,
                arr: dataSource[i].h,
            })
        }
        console.log(newData);
        if (index === 0) {
            tableStr = "万"
        }
        if (index === 1) {
            tableStr = "千"
        }
        if (index === 2) {
            tableStr = "百"
        }
        if (index === 3) {
            tableStr = "十"
        }
        if (index === 4) {
            tableStr = "个"
        }
        this.setState({
            newData,
            tableStr
        })
        setTimeout(() => {
            this.createSVG()

        }, 500);
        console.log(tableStr);
    }

    countTime = (nextDate) => {
        const { lotteryTime } = this.state
        //设置截止时间  
        let str = nextDate;
        let endDate = new Date(str);
        let end = endDate.getTime();
        // console.log(end);
        if (end && end > 0) {
            //获取当前时间  
            let date = new Date();
            let now = date.getTime();

            let leftTime = end - now;
            //定义变量 d,h,m,s保存倒计时的时间  
            let h = 0,
                m = 0,
                s = 0;
            if (leftTime > 0) {
                // d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
                h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
                m = Math.floor(leftTime / 1000 / 60 % 60);
                s = Math.floor(leftTime / 1000 % 60);
                if (h == 0 && m == 0 && s == 3) {
                    axios.get(`http://t.f293.cn/api/ins_data`).then(res => {

                    })
                }
                this.setState({
                    h: h < 10 ? "0" + h : h,
                    s: s < 10 ? "0" + s : s,
                    m: m < 10 ? "0" + m : m,
                })
                setTimeout(() => {
                    this.countTime(nextDate)
                }, 200);
            } else {
                // this.getTableData()
                window.location.href = '/'
            }
        } else {
            this.setState({
                h: "00",
                s: "00",
                m: "00",
            })
        }

    }
    //彩票分类数据
    getData = () => {
        this.setState({
            loading1: true
        })
        axios.post(`http://t.f293.cn/api/list`)
            .then(res => {
                if (res.data.code === 1) {
                    console.log('res=>', res);
                    this.setState({
                        headData: res.data.data,
                        loading1: false
                    })
                } else {
                    message.warning(res.data.msg)
                }
            })
    }
    //开奖时间表格数据
    getTableData = () => {
        this.setState({
            loading: true,
        })
        axios.get(`http://t.f293.cn/api/ins_data`).then(res => {
            axios.get(`http://t.f293.cn/api/get_data?id=1852`)
                .then(res => {
                    console.log('res=>', res);
                    if (res.data.code === 1) {
                        this.countTime(res.data.next[1])

                        let newData = []
                        for (let i = 0; i < res.data.data.length; i++) {
                            let arr = res.data.data[i].h.split(",")
                            // let num = res.data.data[i].h.charAt(res.data.data[i].h.length - index)
                            let num = arr[4]
                            newData.push({
                                s: res.data.data[i].s,
                                q: res.data.data[i].q,
                                h: num,
                                arr: res.data.data[i].h,
                            })
                        }


                        this.setState({
                            lotteryTime: res.data.next[1],
                            nextPeriods: res.data.next[0],
                            dataSource: res.data.data,
                            loading: false,
                            newData,
                        })

                        setTimeout(() => {
                            this.createSVG()

                        }, 500);


                        if (res.data.data[0]) {
                            this.setState({
                                lastPeriods: res.data.data[0].q,
                                lastTime: res.data.data[0].s,
                                lastResult: res.data.data[0].h.split(","),
                            })
                        }
                    }
                })
        })

    }


    createSVG = () => {
        this.svgTable()
        this.svgTable1()
        this.svgTable1a()
        this.svgTable1b()
        this.svgTable2()
        this.svgTable3()
        this.svgTable4()
    }
    // clearSvg = () => {
    //     // SVG('chart_svg').remove();
    //     document.querySelector('chart_svg').innerHTML = '';
    // }


    userClick = () => {
        window.location.href = "/#/login"
    }
    //个位
    svgTable = () => {
        let draw = SVG('chart_svg').size(document.getElementById('tableSvg').offsetWidth, document.getElementById('tableSvg').offsetHeight);
        // console.log(document.getElementById('tableSvg').offsetHeight);
        let arr = [];
        let ball_9Arr = document.getElementsByClassName('ball_9');
        for (let i = 0; i < ball_9Arr.length; i++) {
            // console.log(ball_9Arr[i].offsetParent.offsetParent.offsetParent.offsetLeft)
            // console.log(this.getPosition(ball_9Arr[i], 'left'));
            // console.log(this.getPosition(ball_9Arr[i], 'top'));
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
        // console.log(offsetWH);
        let current = element.offsetParent;
        // console.log(current);
        if (current == 'table#table.table') { current = null; }
        while (current !== null) {
            actualLeft += current[offset];
            current = current.offsetParent;
        }
        // console.log(actualLeft + (element[offsetWH] / 2));
        return actualLeft + (element[offsetWH] / 2);
    }

    search = () => {
        // console.log(this.props);
        // this.createSVG()
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

    sum = (text) => {
        let a = text.split(",")
        let sum = 0
        for (let i = 0; i < a.length; i++) {
            sum = sum + Number(a[i])
        }
        // console.log(sum);
        return sum
    }

    //升降
    lifting1 = (text, record, index) => {
        // console.log(text, record, index);
        let num = text
        let lastIndex = index <= 0 ? 0 : index - 1
        // console.log(lastIndex);
        let lastNum = Number((this.state.newData[lastIndex].h))
        // console.log(lastNum);
        if (num - lastNum > 0) {
            return (
                <div className="lifting">升</div>
            )
        }
    }
    lifting2 = (text, record, index) => {
        let num = text
        let lastIndex = index <= 0 ? 0 : index - 1
        let lastNum = Number((this.state.newData[lastIndex].h))
        if (num - lastNum == 0) {
            return (
                <div className="lifting">平</div>
            )
        }
    }
    lifting3 = (text, record, index) => {
        let num = text
        let lastIndex = index <= 0 ? 0 : index - 1
        let lastNum = Number((this.state.newData[lastIndex].h))
        if (num - lastNum < 0) {
            return (
                <div className="lifting">降</div>
            )
        }
    }

    //充值
    buy = () => {
        // const{}
        let name = cookie.loadAll().name
        console.log(name);
        if (name) {
            axios.post(`http://t.f293.cn/api/buy`, { name, card: "dd902f27db5061fd874b092f2b3fea87" }).then(res => {
                console.log(res);
                if (res.data.code === 1) {
                    message.success("充值成功")
                } else {
                    message.warning(res.data.msg)
                }
            })
        } else {
            message.warning("请先登录")
        }

    }

    //跨度
    sortMin = (a, b) => {
        return a - b
    }
    cutBuy = (text) => {
        let arr = text.split(",")
        arr.sort(this.sortMin)
        return arr[4] - arr[0]
    }
    //
    changeTable = (crr) => {
        this.setState({
            columnsIndex: crr
        })
        this.clearSvg()
    }
    fiveColumns = [
        {
            title: "期号",
            dataIndex: "q",
            width: "120px"
        },
        {
            title: "奖号",
            dataIndex: "h",
            width: "60px",
        },
        {
            title: "万位",
            dataIndex: "h",
            width: "60px",
            children: [
                {
                    title: '0',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "0" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '1',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "1" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '2',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "2" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '3',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "3" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '4',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "4" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '5',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "5" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '6',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "6" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '7',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "7" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '8',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "8" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '9',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "9" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },

            ]
        },
        {
            title: "千位",
            dataIndex: "h",
            width: "60px",
            children: [
                {
                    title: '0',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "0" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '1',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "1" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '2',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "2" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '3',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "3" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '4',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "4" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '5',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "5" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '6',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "6" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '7',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "7" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '8',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "8" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '9',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "9" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },

            ]
        },
        {
            title: "百位",
            dataIndex: "h",
            width: "60px",
            children: [
                {
                    title: '0',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "0" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '1',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "1" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '2',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "2" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '3',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "3" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '4',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "4" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '5',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "5" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '6',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "6" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '7',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "7" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '8',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "8" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '9',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "9" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },

            ]
        },

        {
            title: "十位",
            dataIndex: "h",
            width: "60px",
            children: [
                {
                    title: '0',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "0" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '1',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "1" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '2',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "2" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '3',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "3" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '4',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "4" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '5',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "5" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '6',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "6" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '7',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "7" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '8',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "8" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '9',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "9" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },

            ]
        },
        {
            title: "个位",
            dataIndex: "h",
            width: "60px",
            children: [
                {
                    title: '0',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "0" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '1',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "1" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '2',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "2" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '3',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "3" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '4',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "4" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '5',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "5" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '6',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "6" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '7',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "7" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '8',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "8" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '9',
                    dataIndex: 'h',
                    render: (text, record, index) => {
                        return (
                            text === "9" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                        )
                    },
                },

            ]
        },
    ]

    render() {
        const { loading, loading1, dataSource, h, m, s, nextPeriods, lastPeriods, lastTime, lastResult, newData } = this.state


        const columns = [
            {
                title: "期号",
                dataIndex: "q",
                width: "120px"
            },
            {
                title: "奖号",
                dataIndex: "arr",
                width: "60px",
                render: (text, record) => {
                    let a = text.split(",");
                    if (this.state.tableStr == "个") {
                        return (
                            <span>
                                <span>{a[0]}</span>
                                <span>{a[1]}</span>
                                <span>{a[2]}</span>
                                <span>{a[3]}</span>
                                <span style={{ color: "#dd1625" }}>{a[4]}</span>
                            </span>
                        )
                    }
                    if (this.state.tableStr == "十") {
                        return (
                            <span>
                                <span>{a[0]}</span>
                                <span>{a[1]}</span>
                                <span>{a[2]}</span>
                                <span style={{ color: "#dd1625" }}>{a[3]}</span>
                                <span>{a[4]}</span>
                            </span>
                        )
                    }
                    if (this.state.tableStr == "百") {
                        return (
                            <span>
                                <span>{a[0]}</span>
                                <span>{a[1]}</span>
                                <span style={{ color: "#dd1625" }}>{a[2]}</span>
                                <span>{a[3]}</span>
                                <span>{a[4]}</span>
                            </span>
                        )
                    }
                    if (this.state.tableStr == "千") {
                        return (
                            <span>
                                <span>{a[0]}</span>
                                <span style={{ color: "#dd1625" }}>{a[1]}</span>
                                <span>{a[2]}</span>
                                <span>{a[3]}</span>
                                <span >{a[4]}</span>
                            </span>
                        )
                    }
                    if (this.state.tableStr == "万") {
                        return (
                            <span>
                                <span style={{ color: "#dd1625" }}>{a[0]}</span>
                                <span>{a[1]}</span>
                                <span>{a[2]}</span>
                                <span>{a[3]}</span>
                                <span>{a[4]}</span>
                            </span>
                        )
                    }
                    // text.replace(/,/g, "")
                }

            },
            {
                title: "和值",
                dataIndex: "arr",
                width: "60px",
                render: (text, record) => (
                    this.sum(text, record)
                )
            },
            {
                title: "跨度",
                dataIndex: "arr",
                width: "60px",
                render: text => this.cutBuy(text)
            },
            {
                title: this.state.tableStr + "位",
                dataIndex: "",
                padding: 0,
                children: [
                    {
                        title: '0',
                        dataIndex: 'h',
                        render: (text, record, index) => {
                            return (
                                text === "0" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                            )
                        },
                    },
                    {
                        title: '1',
                        dataIndex: 'h',
                        render: (text, record, index) => {
                            return (
                                text === "1" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                            )
                        },
                    },
                    {
                        title: '2',
                        dataIndex: 'h',
                        render: (text, record, index) => {
                            return (
                                text === "2" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                            )
                        },
                    },
                    {
                        title: '3',
                        dataIndex: 'h',
                        render: (text, record, index) => {
                            return (
                                text === "3" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                            )
                        },
                    },
                    {
                        title: '4',
                        dataIndex: 'h',
                        render: (text, record, index) => {
                            return (
                                text === "4" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                            )
                        },
                    },
                    {
                        title: '5',
                        dataIndex: 'h',
                        render: (text, record, index) => {
                            return (
                                text === "5" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                            )
                        },
                    },
                    {
                        title: '6',
                        dataIndex: 'h',
                        render: (text, record, index) => {
                            return (
                                text === "6" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                            )
                        },
                    },
                    {
                        title: '7',
                        dataIndex: 'h',
                        render: (text, record, index) => {
                            return (
                                text === "7" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                            )
                        },
                    },
                    {
                        title: '8',
                        dataIndex: 'h',
                        render: (text, record, index) => {
                            return (
                                text === "8" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                            )
                        },
                    },
                    {
                        title: '9',
                        dataIndex: 'h',
                        render: (text, record, index) => {
                            return (
                                text === "9" ? <div className={text ? "ball_9" : null} >{text}</div> : null
                            )
                        },
                    },

                ]
            },
            {
                title: this.state.tableStr + "位形态分布",
                dataIndex: "",
                // width: "146px",
                children: [
                    {
                        title: "大",
                        dataIndex: "h",
                        render: (text, record, index) => {
                            return (
                                text >= 5 && text <= 9 ? <div className={text ? "shape" : null} >大</div> : null
                            )
                        },
                    },
                    {
                        title: "小",
                        dataIndex: "h",
                        render: (text, record, index) => {
                            return (
                                text >= 0 && text <= 4 ? <div className={text ? "shape" : null} >小</div> : null
                            )
                        },
                    },
                    {
                        title: "奇",
                        dataIndex: "h",
                        render: (text, record, index) => {
                            return (
                                text == 1 || text == 3 || text == 5 || text == 7 || text == 9 ? <div className={text ? "parity" : null} >奇</div> : null
                            )
                        },
                    },
                    {
                        title: "偶",
                        dataIndex: "h",
                        render: (text, record, index) => {
                            return (
                                text == 0 || text == 2 || text == 4 || text == 6 || text == 8 ? <div className={text ? "parity" : null} >偶</div> : null
                            )
                        },
                    },
                    {
                        title: "质",
                        dataIndex: "h",
                        render: (text, record, index) => {
                            return (
                                text == 1 || text == 2 || text == 3 || text == 5 || text == 7 ? <div className={text ? "prime" : null} >质</div> : null
                            )
                        },
                    },
                    {
                        title: "和",
                        dataIndex: "h",
                        render: (text, record, index) => {
                            return (
                                text == 0 || text == 4 || text == 6 || text == 8 || text == 9 ? <div className={text ? "prime" : null} >和</div> : null
                            )
                        },
                    },
                ]
            },
            {
                title: this.state.tableStr + "位012路",
                dataIndex: "",
                // width: "72px",
                children: [
                    {
                        title: "0",
                        dataIndex: "h",
                        render: (text, record, index) => {
                            return (
                                text == 0 || text == 3 || text == 6 || text == 9 ? <div className={text ? "bit" : null} >0</div> : null
                            )
                        },
                    },
                    {
                        title: "1",
                        dataIndex: "h",
                        render: (text, record, index) => {
                            return (
                                text == 1 || text == 4 || text == 7 ? <div className={text ? "bit" : null} >1</div> : null
                            )
                        },
                    },
                    {
                        title: "2",
                        dataIndex: "h",
                        render: (text, record, index) => {
                            return (
                                text == 2 || text == 5 || text == 8 ? <div className={text ? "bit" : null} >2</div> : null
                            )
                        },
                    },
                ]
            },
            {
                title: this.state.tableStr + "位",
                dataIndex: "",
                // width: "72px",
                children: [
                    {
                        title: "升",
                        dataIndex: "h",
                        render: (text, record, index) => this.lifting1(text, record, index)
                    },
                    {
                        title: "平",
                        dataIndex: "h",
                        render: (text, record, index) => this.lifting2(text, record, index)
                    },
                    {
                        title: "降",
                        dataIndex: "h",
                        render: (text, record, index) => this.lifting3(text, record, index)
                    },
                ]
            },
            {
                title: this.state.tableStr + "位振幅",
                dataIndex: "",
                // width: "10%",
                children: [
                    {
                        title: '0',
                        dataIndex: 'h',
                        render: (text, record, index) => {
                            let num = text
                            let lastIndex = index <= 0 ? 0 : index - 1
                            let lastNum = Number(this.state.newData[lastIndex].h)
                            let number = Math.abs(lastNum - num)
                            return (
                                number === 0 ? <div className={text ? "amplitude" : null} >{number}</div> : null
                            )
                        },
                    },
                    {
                        title: '1',
                        dataIndex: 'h',
                        render: (text, record, index) => {
                            let num = text
                            let lastIndex = index <= 0 ? 0 : index - 1
                            let lastNum = Number(this.state.newData[lastIndex].h)
                            let number = Math.abs(lastNum - num)
                            return (
                                number === 1 ? <div className={text ? "amplitude" : null} >{number}</div> : null
                            )
                        },
                    },
                    {
                        title: '2',
                        dataIndex: 'h',
                        render: (text, record, index) => {
                            let num = text
                            let lastIndex = index <= 0 ? 0 : index - 1
                            let lastNum = Number(this.state.newData[lastIndex].h)
                            let number = Math.abs(lastNum - num)
                            return (
                                number === 2 ? <div className={text ? "amplitude" : null} >{number}</div> : null
                            )
                        },
                    },
                    {
                        title: '3',
                        dataIndex: 'h',
                        render: (text, record, index) => {
                            let num = text
                            let lastIndex = index <= 0 ? 0 : index - 1
                            let lastNum = Number(this.state.newData[lastIndex].h)
                            let number = Math.abs(lastNum - num)
                            return (
                                number === 3 ? <div className={text ? "amplitude" : null} >{number}</div> : null
                            )
                        },
                    },
                    {
                        title: '4',
                        dataIndex: 'h',
                        render: (text, record, index) => {
                            let num = text
                            let lastIndex = index <= 0 ? 0 : index - 1
                            let lastNum = Number(this.state.newData[lastIndex].h)
                            let number = Math.abs(lastNum - num)
                            return (
                                number === 4 ? <div className={text ? "amplitude" : null} >{number}</div> : null
                            )
                        },
                    },
                    {
                        title: '5',
                        dataIndex: 'h',
                        render: (text, record, index) => {
                            let num = text
                            let lastIndex = index <= 0 ? 0 : index - 1
                            let lastNum = Number(this.state.newData[lastIndex].h)
                            let number = Math.abs(lastNum - num)
                            return (
                                number === 5 ? <div className={text ? "amplitude" : null} >{number}</div> : null
                            )
                        },
                    },
                    {
                        title: '6',
                        dataIndex: 'h',
                        render: (text, record, index) => {
                            let num = text
                            let lastIndex = index <= 0 ? 0 : index - 1
                            let lastNum = Number(this.state.newData[lastIndex].h)
                            let number = Math.abs(lastNum - num)
                            return (
                                number === 6 ? <div className={text ? "amplitude" : null} >{number}</div> : null
                            )
                        },
                    },
                    {
                        title: '7',
                        dataIndex: 'h',
                        render: (text, record, index) => {
                            let num = text
                            let lastIndex = index <= 0 ? 0 : index - 1
                            let lastNum = Number(this.state.newData[lastIndex].h)
                            let number = Math.abs(lastNum - num)
                            return (
                                number === 7 ? <div className={text ? "amplitude" : null} >{number}</div> : null
                            )
                        },
                    },
                    {
                        title: '8',
                        dataIndex: 'h',
                        render: (text, record, index) => {
                            let num = text
                            let lastIndex = index <= 0 ? 0 : index - 1
                            let lastNum = Number(this.state.newData[lastIndex].h)
                            let number = Math.abs(lastNum - num)
                            return (
                                number === 8 ? <div className={text ? "amplitude" : null} >{number}</div> : null
                            )
                        },
                    },
                    {
                        title: '9',
                        dataIndex: 'h',
                        render: (text, record, index) => {
                            let num = text
                            let lastIndex = index <= 0 ? 0 : index - 1
                            let lastNum = Number(this.state.newData[lastIndex].h)
                            let number = Math.abs(lastNum - num)
                            return (
                                number === 9 ? <div className={text ? "amplitude" : null} >{number}</div> : null
                            )
                        },
                    },

                ]
            },
        ]
        return (
            <Spin spinning={loading || loading1} >
                <div className="tableSvg main" id="tableSvg">
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
                                <Button ghost size="large" style={{ width: "100px", height: "50px" }} onClick={this.buy}>充值</Button>
                                <Button ghost type="link" style={{ width: "100px", height: "100%" }} onClick={this.search}>
                                    <SearchOutlined color="#fff" style={{ fontSize: "xx-large", lineHeight: "" }} />

                                </Button>
                            </div>
                        </div>
                        <div style={{ height: "100px", lineHeight: "100px", padding: "0 50px" }}>
                            <span style={{}}>第
                            <span style={{ fontSize: "50px", color: "#f7833b" }}>{nextPeriods}</span>
                             期
                             </span>
                            <span style={{ margin: "0 20px" }}>距开奖
                                <span style={{ fontSize: "50px", color: "#f7833b" }}>{h}:{m}:{s} </span>
                            </span>
                        </div>
                        <Divider style={{ margin: "5px 0", background: "#ccc" }} />
                        <div style={{ height: "100px", lineHeight: "100px", display: "flex", padding: "0 40px", fontSize: "large" }}>
                            <div style={{ marginRight: "20px" }}>
                                <span>第</span>
                                <span style={{ margin: "0 10px" }}>{lastPeriods}</span>
                                <span>期结果</span>
                            </div>
                            {
                                lastResult.map((item, index) => {
                                    return (
                                        <div className="prizeBall" key={index}>{item}</div>

                                    )
                                })
                            }
                            {/* <div className="prizeBall">1</div>
                            <div className="prizeBall">1</div>
                            <div className="prizeBall">1</div>
                            <div className="prizeBall">1</div> */}
                            <div>开奖时间：
                            <span style={{ margin: "0 10px" }}>{lastTime.slice(0, 16)}</span>

                            </div>
                        </div>

                        <div style={{ padding: "0 40px", zIndex: 999 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", height: "80px", lineHeight: "80px" }}>
                                <div className="firstWord">定位</div>
                                <Button onClick={() => this.creataData(0)} style={{ fontSize: "xx-large", height: "80px" }} type="link">万位</Button>
                                <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                                <Button onClick={() => this.creataData(1)} style={{ fontSize: "xx-large", height: "80px" }} type="link">千位</Button>
                                <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                                <Button onClick={() => this.creataData(2)} style={{ fontSize: "xx-large", height: "80px" }} type="link">百位</Button>
                                <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                                <Button onClick={() => this.creataData(3)} style={{ fontSize: "xx-large", height: "80px" }} type="link">十位</Button>
                                <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                                <Button onClick={() => this.creataData(4)} style={{ fontSize: "xx-large", height: "80px" }} type="link">个位</Button>
                                <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                                <Button onClick={() => this.creataData(5)} style={{ fontSize: "xx-large", height: "80px" }} type="link">大小单双</Button>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", height: "80px", lineHeight: "80px", margin: "20px 0" }}>
                                <div className="firstWord">其他</div>
                                <Button onClick={() => this.changeTable(1)} style={{ fontSize: "xx-large", height: "80px" }} type="link">五星走势</Button>
                                <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                                <Button onClick={() => this.changeTable(2)} style={{ fontSize: "xx-large", height: "80px" }} type="link">五星综合</Button>
                                <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                                <Button onClick={() => this.changeTable(3)} style={{ fontSize: "xx-large", height: "80px" }} type="link">大小</Button>
                                <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                                <Button onClick={() => this.changeTable(4)} style={{ fontSize: "xx-large", height: "80px" }} type="link">单双</Button>
                                <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                                <Button onClick={() => this.changeTable(5)} style={{ fontSize: "xx-large", height: "80px" }} type="link">龙虎</Button>
                            </div>
                        </div>
                        <Content style={{ padding: "" }}>

                            <Table
                                columns={this.state.columnsIndex === 1 ? this.fiveColumns : columns}
                                className="list"
                                rowKey={"q"}
                                bordered
                                pagination={false}
                                dataSource={newData}
                            />


                        </Content>
                    </Layout>

                    <div className="chart_svg" id="chart_svg" ref="chart_svg"></div>

                    <div className="chart_svg1" id="chart_svg1"></div>

                    <div className="chart_svg2" id="chart_svg2"></div>

                    <div className="chart_svg3" id="chart_svg3"></div>

                    <div className="chart_svg4" id="chart_svg4"></div>

                    <div className="chart_svg1_1" id="chart_svg1_1"></div>

                    <div className="chart_svg1_2" id="chart_svg1_2"></div>


                    <Modal
                        // title="实时彩类"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={false}
                        className="trendSort"
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
                            {
                                this.state.headData.map((item, index) => {
                                    return (
                                        <div key={index} style={{ display: "inline-block" }}>
                                            <Avatar
                                                className="trendImg"
                                                src={item.img}
                                                shape="square"
                                                alt={item.name}>

                                            </Avatar >
                                            <div style={{ textAlign: "center", width: "110px", fontSize: "large" }}>{item.type}</div>

                                        </div>
                                    )
                                })
                            }
                        </div>
                        <p style={{ fontSize: "x-large" }}>赛车类</p>
                        <div></div>
                    </Modal>

                </div>
            </Spin>
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