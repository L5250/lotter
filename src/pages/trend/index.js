import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addCount, reduceCount } from '../../store/actions/countAction';
import { Layout, Button, Select, Table, Divider, Modal, message, Spin, Avatar, Badge, Input } from 'antd';
import { UserOutlined, CaretDownOutlined, SearchOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import cookie from 'react-cookies'
import axios from 'axios';
import SVG from "svg.js"
import './index.scss'


// const colud = "http://47.92.106.226/"
const colud = window.api
// console.log(window.api);

const { Option } = Select;
const { Header, Footer, Sider, Content } = Layout;
class Trend extends Component {
    constructor(props) {
        super(props);
        this.tableRef = React.createRef();
    }
    state = {
        visible: false,
        buyVisible: false,
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

        columnsIndex: 0,

        card: "",
        id: "",

        isTime: true,
        trendName: "",

    }
    componentDidMount() {
        this.getData()
        // this.getTableData()
    }



    //彩票分类数据
    getData = () => {
        this.setState({
            loading1: true
        })
        axios.post(`${colud}/api/list`)
            .then(res => {
                if (res.data.code === 1) {
                    this.setState({
                        headData: res.data.data,
                        loading1: false,
                    })
                    if (res.data.data[0]) {
                        this.setState({
                            id: res.data.data[0].id,
                            trendName: res.data.data[0].type,
                        })
                        this.getTableData(res.data.data[0].id)

                    }
                } else {
                    message.warning(res.data.msg)
                }
            })
    }
    //开奖时间表格数据
    getTableData = (id) => {
        this.setState({
            loading: true,
            visible: false,
            columnsIndex: 0,
            id
        })
        this.clearSvg()
        axios.get(`${colud}/api/ins_data`).then(res => {
            axios.get(`${colud}/api/get_data?id=${id}`)
                .then(res => {
                    if (res.data.code === 1) {

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
                            if (this.state.columnsIndex == 0 || this.state.columnsIndex == 6) {
                                this.countTime(res.data.next[1])

                                this.createSVG()
                            } else {

                                this.createFiveSVG()
                            }

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

    //切换彩种
    changeTableData = (id, type) => {
        this.setState({
            loading: true,
            visible: false,
            // columnsIndex: 0,
            newData: [],
            nextPeriods: "",//下期期号
            lotteryTime: '',//下期开奖时间
            h: "00",
            m: "00",
            s: "00",
            isTime: false,
            id,
            trendName: type,
        })
        this.clearSvg()
        axios.get(`${colud}/api/ins_data`).then(res => {
            axios.get(`${colud}/api/get_data?id=${id}`)
                .then(res => {
                    if (res.data.code === 1) {
                        // console.log(res.data);
                        this.setState({
                            loading: true,
                            dataSource: res.data.data,
                            lotteryTime: res.data.next[1],
                            nextPeriods: res.data.next[0],

                        })
                        setTimeout(() => {
                            this.setState({
                                loading: false
                            })
                        }, 1500);
                        // this.clearSvg()

                        let dataSource = res.data.data
                        // console.log(dataSource);

                        let newData = []
                        for (let i = 0; i < dataSource.length; i++) {
                            let arr = dataSource[i].h.split(",")
                            let num = arr[4]
                            newData.push({
                                s: dataSource[i].s,
                                q: dataSource[i].q,
                                h: num,
                                arr: dataSource[i].h,
                            })
                        }

                        this.setState({
                            newData,
                            tableStr: "个",
                            columnsIndex: 0,
                            isTime: true,

                        })
                        setTimeout(() => {
                            this.createSVG()
                            this.countTime(res.data.next[1])

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

    //充值
    buy = () => {
        const { card } = this.state
        let name = cookie.loadAll().name
        if (name) {
            axios.post(`${colud}/api/buy`, { name, card }).then(res => {
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


    userClick = () => {
        // window.location.href = "/#/login"
        this.props.history.push('/login')
    }


    //定位按钮创造数据
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

        const { dataSource } = this.state
        let tableStr = ""

        let newData = []
        for (let i = 0; i < dataSource.length; i++) {
            let arr = dataSource[i].h.split(",")
            let num = arr[index]
            newData.push({
                s: dataSource[i].s,
                q: dataSource[i].q,
                h: num,
                arr: dataSource[i].h,
            })
        }
        // console.log(newData);
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
    }
    //其他按钮创造数据
    changeTable = (crr) => {
        this.setState({
            columnsIndex: crr,
            loading: true,
        })
        setTimeout(() => {
            this.setState({
                loading: false
            })
        }, 1500);
        this.clearSvg()

        const { dataSource } = this.state

        let newData = []
        for (let i = 0; i < dataSource.length; i++) {
            let arr = dataSource[i].h.split(",")
            // let num = arr[index]

            newData.push({
                s: dataSource[i].s,
                q: dataSource[i].q,
                h1: arr[0],
                h2: arr[1],
                h3: arr[2],
                h4: arr[3],
                h5: arr[4],
                arr: dataSource[i].h,

            })
        }
        // console.log(newData);
        setTimeout(() => {
            this.createFiveSVG()

        }, 500);
        this.setState({
            newData
        })
    }
    //大小单双
    creataBMData = (index) => {
        this.setState({
            columnsIndex: index,
            loading: true,
        })
        setTimeout(() => {
            this.setState({
                loading: false
            })
        }, 1500);
        this.clearSvg()

        const { dataSource } = this.state

        let newData = []
        for (let i = 0; i < dataSource.length; i++) {
            let arr = dataSource[i].h.split(",")
            // let num = arr[index]

            newData.push({
                s: dataSource[i].s,
                q: dataSource[i].q,
                h: arr[3] + arr[4],

            })
        }
        setTimeout(() => {
            this.createSVG()

        }, 500);
        this.setState({
            newData
        })
    }
    //倒计时
    timeOut = () => {
        const { lotteryTime } = this.state
        console.log(lotteryTime);
        return lotteryTime
    }

    //开奖时间倒计时
    countTime = (nextDate) => {
        //设置截止时间  
        let str = nextDate.replace(/-/g, "/");
        // let str = "2020-04-10 11:44:20"
        let endDate = new Date(str);
        let end = endDate.getTime();
        // console.log(end);
        if (end && end > 0 && this.state.isTime) {
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
                    axios.get(`${colud}/api/ins_data`).then(res => {

                    })
                }

                this.setState({
                    h: h < 10 ? "0" + h : h,
                    s: s < 10 ? "0" + s : s,
                    m: m < 10 ? "0" + m : m,
                })
                let time = setTimeout(() => {
                    this.countTime(nextDate)
                }, 100);
                // let time = setInterval(() => {
                //     this.countTime(nextDate)
                // }, 100);
                if (h == 0 && m == 0 && s == 0) {
                    this.clearSvg()
                    clearTimeout(time)
                    this.setState({
                        loading: true
                    })
                    let time1 = setInterval(() => {
                        axios.get(`${colud}/api/get_data?id=${this.state.id}`).then(res => {
                            // console.log(res);
                            if (res.data.code === 1 && res.data.next[1] != nextDate) {
                                clearInterval(time1)
                                this.clearSvg()
                                this.changeTableData(this.state.id, this.state.trendName)
                            } else {
                                // message.warning(res.data.msg)
                                axios.get(`${colud}/api/ins_data`).then(res => {

                                })
                            }
                        })
                    }, 1000);

                }
                // console.log(h, m, s);
            } else {
                // setTimeout(() => {
                //     this.changeTableData(this.state.id)
                // }, 3000);
                // this.props.history.push('/')

            }
        } else {
            this.setState({
                h: "00",
                s: "00",
                m: "00",
            })
        }

    }
    //创造SVG
    createSVG = () => {
        this.svgTable()
        this.svgTable1()
        this.svgTable1a()
        this.svgTable1b()
        this.svgTable2()
        this.svgTable3()
        this.svgTable4()
    }
    createFiveSVG = () => {
        this.svgTableFive()
        this.svgTableFive1()
        this.svgTableFive2()
        this.svgTableFive3()
        this.svgTableFive4()
    }
    //清除SVG
    clearSvg = () => {
        let svg = document.getElementById("chart_svg")
        // console.log(svg.hasChildNodes());
        if (svg.hasChildNodes()) {
            svg.removeChild(svg.lastChild);
        }
        let svg1 = document.getElementById("chart_svg1")
        if (svg1.hasChildNodes()) {
            svg1.removeChild(svg1.lastChild);
        }
        let svg1_1 = document.getElementById("chart_svg1_1")
        if (svg1_1.hasChildNodes()) {
            svg1_1.removeChild(svg1_1.lastChild);
        }
        let svg1_2 = document.getElementById("chart_svg1_2")
        if (svg1_2.hasChildNodes()) {
            svg1_2.removeChild(svg1_2.lastChild);
        }
        let svg2 = document.getElementById("chart_svg2")
        if (svg2.hasChildNodes()) {
            svg2.removeChild(svg2.lastChild);
        }
        let svg3 = document.getElementById("chart_svg3")
        if (svg3.hasChildNodes()) {
            svg3.removeChild(svg3.lastChild);
        }
        let svg4 = document.getElementById("chart_svg4")
        if (svg4.hasChildNodes()) {
            svg4.removeChild(svg4.lastChild);
        }
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
        for (let i = 1; i < arr.length; i++) {
            let item = arr[i - 1]
            let item1 = arr[i]

            let x = item[0]
            let y = item[1]
            let x1 = item1[0]
            let y1 = item1[1]
            if (x1 < x) {
                x = x - 4
                y = y - 4
            } else if (x1 > x) {
                x = x + 4
                y = y + 4
            } else {
                y = y + 8
            }

            if (x1 < x) {
                x1 = x1 + 10
                y1 = y1 - 5
            } else if (x1 > x) {
                x1 = x1 - 10
                y1 = y1 - 5
            } else {
                y1 = y1 - 10
            }
            item[0] = "M" + (x) + " " + (y)
            item[1] = "L" + (x1) + " " + (y1)
        }

        draw.path(arr.toString()).fill('none').stroke({ width: 1, color: 'rgb(204, 0, 0)' });
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
        for (let i = 1; i < arr.length; i++) {
            let item = arr[i - 1]
            let item1 = arr[i]

            let x = item[0]
            let y = item[1]
            let x1 = item1[0]
            let y1 = item1[1]
            if (x1 < x) {
                x = x - 4
                y = y - 4
            } else if (x1 > x) {
                x = x + 8
                y = y + 4
            } else {
                y = y + 8
            }

            if (x1 < x) {
                x1 = x1 + 10
                y1 = y1 - 5
            } else if (x1 > x) {
                x1 = x1 - 10
                y1 = y1 - 5
            } else {
                y1 = y1 - 10
            }
            item[0] = "M" + (x) + " " + (y)
            item[1] = "L" + (x1) + " " + (y1)
        }
        draw.path(arr.toString()).fill('none').stroke({ width: 1, color: 'rgb(248, 99, 0)' });
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
        for (let i = 1; i < arr.length; i++) {
            let item = arr[i - 1]
            let item1 = arr[i]

            let x = item[0]
            let y = item[1]
            let x1 = item1[0]
            let y1 = item1[1]
            if (x1 < x) {
                x = x - 4
                y = y - 4
            } else if (x1 > x) {
                x = x + 8
                y = y + 4
            } else {
                y = y + 8
            }

            if (x1 < x) {
                x1 = x1 + 10
                y1 = y1 - 5
            } else if (x1 > x) {
                x1 = x1 - 10
                y1 = y1 - 5
            } else {
                y1 = y1 - 10
            }
            item[0] = "M" + (x) + " " + (y)
            item[1] = "L" + (x1) + " " + (y1)
        }
        draw.path(arr.toString()).fill('none').stroke({ width: 1, color: 'rgb(42, 82, 127)' });
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
        for (let i = 1; i < arr.length; i++) {
            let item = arr[i - 1]
            let item1 = arr[i]

            let x = item[0]
            let y = item[1]
            let x1 = item1[0]
            let y1 = item1[1]
            if (x1 < x) {
                x = x - 4
                y = y - 4
            } else if (x1 > x) {
                x = x + 8
                y = y + 4
            } else {
                y = y + 8
            }

            if (x1 < x) {
                x1 = x1 + 10
                y1 = y1 - 5
            } else if (x1 > x) {
                x1 = x1 - 10
                y1 = y1 - 5
            } else {
                y1 = y1 - 10
            }
            item[0] = "M" + (x) + " " + (y)
            item[1] = "L" + (x1) + " " + (y1)
        }
        draw.path(arr.toString()).fill('none').stroke({ width: 1, color: 'rgb(105, 131, 83)' });
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
        for (let i = 1; i < arr.length; i++) {
            let item = arr[i - 1]
            let item1 = arr[i]

            let x = item[0]
            let y = item[1]
            let x1 = item1[0]
            let y1 = item1[1]
            if (x1 < x) {
                x = x - 8
                y = y - 4
            } else if (x1 > x) {
                x = x + 8
                y = y + 4
            } else {
                y = y + 8
            }

            if (x1 < x) {
                x1 = x1 + 10
                y1 = y1 - 5
            } else if (x1 > x) {
                x1 = x1 - 10
                y1 = y1 - 5
            } else {
                y1 = y1 - 10
            }
            item[0] = "M" + (x) + " " + (y)
            item[1] = "L" + (x1) + " " + (y1)
        }
        draw.path(arr.toString()).fill('none').stroke({ width: 1, color: 'rgb(0, 135, 34)' });
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
        for (let i = 1; i < arr.length; i++) {
            let item = arr[i - 1]
            let item1 = arr[i]

            let x = item[0]
            let y = item[1]
            let x1 = item1[0]
            let y1 = item1[1]
            if (x1 < x) {
                x = x - 8
                y = y - 4
            } else if (x1 > x) {
                x = x + 8
                y = y + 4
            } else {
                y = y + 8
            }

            if (x1 < x) {
                x1 = x1 + 10
                y1 = y1 - 5
            } else if (x1 > x) {
                x1 = x1 - 10
                y1 = y1 - 5
            } else {
                y1 = y1 - 10
            }
            item[0] = "M" + (x) + " " + (y)
            item[1] = "L" + (x1) + " " + (y1)
        }
        draw.path(arr.toString()).fill('none').stroke({ width: 1, color: 'rgb(248, 99, 0)' });
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
        for (let i = 1; i < arr.length; i++) {
            let item = arr[i - 1]
            let item1 = arr[i]

            let x = item[0]
            let y = item[1]
            let x1 = item1[0]
            let y1 = item1[1]
            if (x1 < x) {
                x = x - 4
                y = y - 4
            } else if (x1 > x) {
                x = x + 8
                y = y + 4
            } else {
                y = y + 8
            }

            if (x1 < x) {
                x1 = x1 + 10
                y1 = y1 - 5
            } else if (x1 > x) {
                x1 = x1 - 10
                y1 = y1 - 5
            } else {
                y1 = y1 - 10
            }
            item[0] = "M" + (x) + " " + (y)
            item[1] = "L" + (x1) + " " + (y1)
        }
        draw.path(arr.toString()).fill('none').stroke({ width: 1, color: 'rgb(30, 136, 238)' });
    }



    //-------------------------------五星走势-----------------------//
    //万
    svgTableFive = () => {
        let draw = SVG('chart_svg').size(document.getElementById('tableSvg').offsetWidth, document.getElementById('tableSvg').offsetHeight);
        let arr = [];
        let ball_1 = document.getElementsByClassName('ball_1');
        for (let i = 0; i < ball_1.length; i++) {
            let arrb = [];
            arrb.push(this.getPosition(ball_1[i], 'left'));
            arrb.push(this.getPosition(ball_1[i], 'top'));
            arr.push(arrb);
        }
        for (let i = 1; i < arr.length; i++) {
            let item = arr[i - 1]
            let item1 = arr[i]

            let x = item[0]
            let y = item[1]
            let x1 = item1[0]
            let y1 = item1[1]
            if (x1 < x) {
                x = x - 4
                y = y - 4
            } else if (x1 > x) {
                x = x + 4
                y = y + 4
            } else {
                y = y + 8
            }

            if (x1 < x) {
                x1 = x1 + 6
                y1 = y1 - 5
            } else if (x1 > x) {
                x1 = x1 - 6
                y1 = y1 - 5
            } else {
                y1 = y1 - 6
            }
            item[0] = "M" + (x) + " " + (y)
            item[1] = "L" + (x1) + " " + (y1)
        }
        draw.path(arr.toString()).fill('none').stroke({ width: 1, color: 'rgb(204, 0, 0)' });
    }
    //千
    svgTableFive1 = () => {
        let draw = SVG('chart_svg1').size(document.getElementById('tableSvg').offsetWidth, document.getElementById('tableSvg').offsetHeight);
        let arr = [];
        let ball_2 = document.getElementsByClassName('ball_2');
        for (let i = 0; i < ball_2.length; i++) {
            let arrb = [];
            arrb.push(this.getPosition(ball_2[i], 'left'));
            arrb.push(this.getPosition(ball_2[i], 'top'));
            arr.push(arrb);
        }
        for (let i = 1; i < arr.length; i++) {
            let item = arr[i - 1]
            let item1 = arr[i]

            let x = item[0]
            let y = item[1]
            let x1 = item1[0]
            let y1 = item1[1]
            if (x1 < x) {
                x = x - 4
                y = y - 4
            } else if (x1 > x) {
                x = x + 4
                y = y + 4
            } else {
                y = y + 8
            }

            if (x1 < x) {
                x1 = x1 + 6
                y1 = y1 - 5
            } else if (x1 > x) {
                x1 = x1 - 6
                y1 = y1 - 5
            } else {
                y1 = y1 - 6
            }
            item[0] = "M" + (x) + " " + (y)
            item[1] = "L" + (x1) + " " + (y1)
        }
        draw.path(arr.toString()).fill('none').stroke({ width: 1, color: 'rgb(104, 53, 53)' });
    }
    //百
    svgTableFive2 = () => {
        let draw = SVG('chart_svg2').size(document.getElementById('tableSvg').offsetWidth, document.getElementById('tableSvg').offsetHeight);
        let arr = [];
        let ball_3 = document.getElementsByClassName('ball_3');
        for (let i = 0; i < ball_3.length; i++) {
            let arrb = [];
            arrb.push(this.getPosition(ball_3[i], 'left'));
            arrb.push(this.getPosition(ball_3[i], 'top'));
            arr.push(arrb);
        }
        for (let i = 1; i < arr.length; i++) {
            let item = arr[i - 1]
            let item1 = arr[i]

            let x = item[0]
            let y = item[1]
            let x1 = item1[0]
            let y1 = item1[1]
            if (x1 < x) {
                x = x - 4
                y = y - 4
            } else if (x1 > x) {
                x = x + 4
                y = y + 4
            } else {
                y = y + 8
            }

            if (x1 < x) {
                x1 = x1 + 6
                y1 = y1 - 5
            } else if (x1 > x) {
                x1 = x1 - 6
                y1 = y1 - 5
            } else {
                y1 = y1 - 6
            }
            item[0] = "M" + (x) + " " + (y)
            item[1] = "L" + (x1) + " " + (y1)
        }
        draw.path(arr.toString()).fill('none').stroke({ width: 1, color: 'rgb(204, 0, 0)' });
    }
    //十
    svgTableFive3 = () => {
        let draw = SVG('chart_svg3').size(document.getElementById('tableSvg').offsetWidth, document.getElementById('tableSvg').offsetHeight);
        let arr = [];
        let ball_4 = document.getElementsByClassName('ball_4');
        for (let i = 0; i < ball_4.length; i++) {
            let arrb = [];
            arrb.push(this.getPosition(ball_4[i], 'left'));
            arrb.push(this.getPosition(ball_4[i], 'top'));
            arr.push(arrb);
        }
        for (let i = 1; i < arr.length; i++) {
            let item = arr[i - 1]
            let item1 = arr[i]

            let x = item[0]
            let y = item[1]
            let x1 = item1[0]
            let y1 = item1[1]
            if (x1 < x) {
                x = x - 4
                y = y - 4
            } else if (x1 > x) {
                x = x + 4
                y = y + 4
            } else {
                y = y + 8
            }

            if (x1 < x) {
                x1 = x1 + 6
                y1 = y1 - 5
            } else if (x1 > x) {
                x1 = x1 - 6
                y1 = y1 - 5
            } else {
                y1 = y1 - 6
            }
            item[0] = "M" + (x) + " " + (y)
            item[1] = "L" + (x1) + " " + (y1)
        }
        draw.path(arr.toString()).fill('none').stroke({ width: 1, color: 'rgb(104, 53, 53)' });
    }
    //个
    svgTableFive4 = () => {
        let draw = SVG('chart_svg4').size(document.getElementById('tableSvg').offsetWidth, document.getElementById('tableSvg').offsetHeight);
        let arr = [];
        let ball_5 = document.getElementsByClassName('ball_5');
        for (let i = 0; i < ball_5.length; i++) {
            let arrb = [];
            arrb.push(this.getPosition(ball_5[i], 'left'));
            arrb.push(this.getPosition(ball_5[i], 'top'));
            arr.push(arrb);
        }
        // console.log(arr);
        for (let i = 1; i < arr.length; i++) {
            let item = arr[i - 1]
            let item1 = arr[i]

            let x = item[0]
            let y = item[1]
            let x1 = item1[0]
            let y1 = item1[1]
            if (x1 < x) {
                x = x - 4
                y = y - 4
            } else if (x1 > x) {
                x = x + 4
                y = y + 4
            } else {
                y = y + 8
            }

            if (x1 < x) {
                x1 = x1 + 6
                y1 = y1 - 5
            } else if (x1 > x) {
                x1 = x1 - 6
                y1 = y1 - 5
            } else {
                y1 = y1 - 6
            }
            item[0] = "M" + (x) + " " + (y)
            item[1] = "L" + (x1) + " " + (y1)
        }
        draw.path(arr.toString()).fill('none').stroke({ width: 1, color: 'rgb(204, 0, 0)' });
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
        return (actualLeft + (element[offsetWH] / 2));
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
    openBuy = () => {
        let name = cookie.loadAll().name
        if (name) {
            this.setState({
                buyVisible: true
            })
        } else {
            message.warning("请先登录")
        }

    }
    handleCancel = () => {
        this.setState({
            visible: false
        })
    }
    handleCancel1 = () => {
        this.setState({
            buyVisible: false
        })
    }

    cardChange = (e) => {
        let value = e.target.value
        console.log(value);
        this.setState({
            card: value
        })
    }
    //和值
    sum = (text) => {
        let a = text.split(",")
        let sum = 0
        for (let i = 0; i < a.length; i++) {
            sum = sum + Number(a[i])
        }
        // console.log(sum);
        return sum
    }
    //跨度
    cutBuy = (text) => {
        let arr = text.split(",")
        arr.sort((a, b) => {
            return a - b
        })
        return arr[4] - arr[0]
    }

    //奇偶比
    compare1 = (text, record) => {
        let arr = text.split(",")
        let a = 0
        let b = 0
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == 1 || arr[i] == 3 || arr[i] == 5 || arr[i] == 7 || arr[i] == 9) {
                a = a + 1
            }
            if (arr[i] == 0 || arr[i] == 2 || arr[i] == 4 || arr[i] == 6 || arr[i] == 8) {
                b = b + 1
            }
        }
        return a + ":" + b
    }
    //大小比
    compare2 = (text, record) => {
        let arr = text.split(",")
        let a = 0
        let b = 0
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == 0 || arr[i] == 1 || arr[i] == 2 || arr[i] == 3 || arr[i] == 4) {
                a = a + 1
            }
            if (arr[i] == 5 || arr[i] == 6 || arr[i] == 7 || arr[i] == 8 || arr[i] == 9) {
                b = b + 1
            }
        }
        return a + ":" + b
    }
    //质和比
    compare3 = (text, record) => {
        let arr = text.split(",")
        let a = 0
        let b = 0
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == 1 || arr[i] == 2 || arr[i] == 3 || arr[i] == 5 || arr[i] == 7) {
                a = a + 1
            }
            if (arr[i] == 0 || arr[i] == 4 || arr[i] == 6 || arr[i] == 8 || arr[i] == 9) {
                b = b + 1
            }
        }
        return a + ":" + b
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



    //五星
    fiveColumns = [
        {
            title: "期号",
            dataIndex: "q",
            width: "120px"
        },
        {
            title: "奖号",
            dataIndex: "arr",
            width: "60px",
            render: text => text.replace(/,/g, "")
        },
        {
            title: "万位",
            dataIndex: "h",
            children: [
                {
                    title: '0',
                    dataIndex: 'h1',
                    render: (text, record, index) => {
                        return (
                            text === "0" ? <div className={text ? "ball_1" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '1',
                    dataIndex: 'h1',
                    render: (text, record, index) => {
                        return (
                            text === "1" ? <div className={text ? "ball_1" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '2',
                    dataIndex: 'h1',
                    render: (text, record, index) => {
                        return (
                            text === "2" ? <div className={text ? "ball_1" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '3',
                    dataIndex: 'h1',
                    render: (text, record, index) => {
                        return (
                            text === "3" ? <div className={text ? "ball_1" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '4',
                    dataIndex: 'h1',
                    render: (text, record, index) => {
                        return (
                            text === "4" ? <div className={text ? "ball_1" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '5',
                    dataIndex: 'h1',
                    render: (text, record, index) => {
                        return (
                            text === "5" ? <div className={text ? "ball_1" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '6',
                    dataIndex: 'h1',
                    render: (text, record, index) => {
                        return (
                            text === "6" ? <div className={text ? "ball_1" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '7',
                    dataIndex: 'h1',
                    render: (text, record, index) => {
                        return (
                            text === "7" ? <div className={text ? "ball_1" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '8',
                    dataIndex: 'h1',
                    render: (text, record, index) => {
                        return (
                            text === "8" ? <div className={text ? "ball_1" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '9',
                    dataIndex: 'h1',
                    render: (text, record, index) => {
                        return (
                            text === "9" ? <div className={text ? "ball_1" : null} >{text}</div> : null
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
                    dataIndex: 'h2',
                    render: (text, record, index) => {
                        return (
                            text === "0" ? <div className={text ? "ball_2" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '1',
                    dataIndex: 'h2',
                    render: (text, record, index) => {
                        return (
                            text === "1" ? <div className={text ? "ball_2" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '2',
                    dataIndex: 'h2',
                    render: (text, record, index) => {
                        return (
                            text === "2" ? <div className={text ? "ball_2" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '3',
                    dataIndex: 'h2',
                    render: (text, record, index) => {
                        return (
                            text === "3" ? <div className={text ? "ball_2" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '4',
                    dataIndex: 'h2',
                    render: (text, record, index) => {
                        return (
                            text === "4" ? <div className={text ? "ball_2" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '5',
                    dataIndex: 'h2',
                    render: (text, record, index) => {
                        return (
                            text === "5" ? <div className={text ? "ball_2" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '6',
                    dataIndex: 'h2',
                    render: (text, record, index) => {
                        return (
                            text === "6" ? <div className={text ? "ball_2" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '7',
                    dataIndex: 'h2',
                    render: (text, record, index) => {
                        return (
                            text === "7" ? <div className={text ? "ball_2" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '8',
                    dataIndex: 'h2',
                    render: (text, record, index) => {
                        return (
                            text === "8" ? <div className={text ? "ball_2" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '9',
                    dataIndex: 'h2',
                    render: (text, record, index) => {
                        return (
                            text === "9" ? <div className={text ? "ball_2" : null} >{text}</div> : null
                        )
                    },
                },

            ]
        },
        {
            title: "百位",
            dataIndex: "h",
            children: [
                {
                    title: '0',
                    dataIndex: 'h3',
                    render: (text, record, index) => {
                        return (
                            text === "0" ? <div className={text ? "ball_3" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '1',
                    dataIndex: 'h3',
                    render: (text, record, index) => {
                        return (
                            text === "1" ? <div className={text ? "ball_3" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '2',
                    dataIndex: 'h3',
                    render: (text, record, index) => {
                        return (
                            text === "2" ? <div className={text ? "ball_3" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '3',
                    dataIndex: 'h3',
                    render: (text, record, index) => {
                        return (
                            text === "3" ? <div className={text ? "ball_3" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '4',
                    dataIndex: 'h3',
                    render: (text, record, index) => {
                        return (
                            text === "4" ? <div className={text ? "ball_3" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '5',
                    dataIndex: 'h3',
                    render: (text, record, index) => {
                        return (
                            text === "5" ? <div className={text ? "ball_3" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '6',
                    dataIndex: 'h3',
                    render: (text, record, index) => {
                        return (
                            text === "6" ? <div className={text ? "ball_3" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '7',
                    dataIndex: 'h3',
                    render: (text, record, index) => {
                        return (
                            text === "7" ? <div className={text ? "ball_3" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '8',
                    dataIndex: 'h3',
                    render: (text, record, index) => {
                        return (
                            text === "8" ? <div className={text ? "ball_3" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '9',
                    dataIndex: 'h3',
                    render: (text, record, index) => {
                        return (
                            text === "9" ? <div className={text ? "ball_3" : null} >{text}</div> : null
                        )
                    },
                },

            ]
        },

        {
            title: "十位",
            dataIndex: "h",
            children: [
                {
                    title: '0',
                    dataIndex: 'h4',
                    render: (text, record, index) => {
                        return (
                            text === "0" ? <div className={text ? "ball_4" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '1',
                    dataIndex: 'h4',
                    render: (text, record, index) => {
                        return (
                            text === "1" ? <div className={text ? "ball_4" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '2',
                    dataIndex: 'h4',
                    render: (text, record, index) => {
                        return (
                            text === "2" ? <div className={text ? "ball_4" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '3',
                    dataIndex: 'h4',
                    render: (text, record, index) => {
                        return (
                            text === "3" ? <div className={text ? "ball_4" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '4',
                    dataIndex: 'h4',
                    render: (text, record, index) => {
                        return (
                            text === "4" ? <div className={text ? "ball_4" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '5',
                    dataIndex: 'h4',
                    render: (text, record, index) => {
                        return (
                            text === "5" ? <div className={text ? "ball_4" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '6',
                    dataIndex: 'h4',
                    render: (text, record, index) => {
                        return (
                            text === "6" ? <div className={text ? "ball_4" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '7',
                    dataIndex: 'h4',
                    render: (text, record, index) => {
                        return (
                            text === "7" ? <div className={text ? "ball_4" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '8',
                    dataIndex: 'h4',
                    render: (text, record, index) => {
                        return (
                            text === "8" ? <div className={text ? "ball_4" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '9',
                    dataIndex: 'h4',
                    render: (text, record, index) => {
                        return (
                            text === "9" ? <div className={text ? "ball_4" : null} >{text}</div> : null
                        )
                    },
                },

            ]
        },
        {
            title: "个位",
            dataIndex: "h",
            children: [
                {
                    title: '0',
                    dataIndex: 'h5',
                    render: (text, record, index) => {
                        return (
                            text === "0" ? <div className={text ? "ball_5" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '1',
                    dataIndex: 'h5',
                    render: (text, record, index) => {
                        return (
                            text === "1" ? <div className={text ? "ball_5" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '2',
                    dataIndex: 'h5',
                    render: (text, record, index) => {
                        return (
                            text === "2" ? <div className={text ? "ball_5" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '3',
                    dataIndex: 'h5',
                    render: (text, record, index) => {
                        return (
                            text === "3" ? <div className={text ? "ball_5" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '4',
                    dataIndex: 'h5',
                    render: (text, record, index) => {
                        return (
                            text === "4" ? <div className={text ? "ball_5" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '5',
                    dataIndex: 'h5',
                    render: (text, record, index) => {
                        return (
                            text === "5" ? <div className={text ? "ball_5" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '6',
                    dataIndex: 'h5',
                    render: (text, record, index) => {
                        return (
                            text === "6" ? <div className={text ? "ball_5" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '7',
                    dataIndex: 'h5',
                    render: (text, record, index) => {
                        return (
                            text === "7" ? <div className={text ? "ball_5" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '8',
                    dataIndex: 'h5',
                    render: (text, record, index) => {
                        return (
                            text === "8" ? <div className={text ? "ball_5" : null} >{text}</div> : null
                        )
                    },
                },
                {
                    title: '9',
                    dataIndex: 'h5',
                    render: (text, record, index) => {
                        return (
                            text === "9" ? <div className={text ? "ball_5" : null} >{text}</div> : null
                        )
                    },
                },

            ]
        },
    ]
    //五星综合
    fiveAllColumns = [
        {
            title: "期号",
            dataIndex: "q",
            width: "80px"
        },
        {
            title: "奖号",
            dataIndex: "arr",
            width: "40px",
            render: (text, record) => text.replace(/,/g, "")

        },
        {
            title: "和值",
            dataIndex: "arr",
            width: "40px",
            render: (text, record) => (
                this.sum(text, record)
            )
        },
        {
            title: "跨度",
            dataIndex: "arr",
            width: "40px",
            render: text => this.cutBuy(text)
        },
        {
            title: "基本号码",
            dataIndex: "h",
            children: [
                {
                    title: '0',
                    dataIndex: 'arr',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        let re = 0
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i] == 1) {
                                re = re + 1
                            }
                        }
                        return (
                            re > 0 ? <Badge count={re == 1 ? 0 : re}> <div className={text ? "budge" : null} >1</div> </Badge> : null
                        )
                    },
                },
                {
                    title: '1',
                    dataIndex: 'arr',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        let re = 0
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i] == 2) {
                                re = re + 1
                            }
                        }
                        return (
                            re > 0 ? <Badge count={re == 1 ? 0 : re}> <div className={text ? "budge" : null} >2</div> </Badge> : null
                        )
                    },
                },
                {
                    title: '2',
                    dataIndex: 'arr',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        let re = 0
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i] == 3) {
                                re = re + 1
                            }
                        }
                        return (
                            re > 0 ? <Badge count={re == 1 ? 0 : re}> <div className={text ? "budge" : null} >3</div> </Badge> : null
                        )
                    },
                },
                {
                    title: '3',
                    dataIndex: 'arr',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        let re = 0
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i] == 4) {
                                re = re + 1
                            }
                        }
                        return (
                            re > 0 ? <Badge count={re == 1 ? 0 : re}> <div className={text ? "budge" : null} >4</div> </Badge> : null
                        )
                    },
                },
                {
                    title: '4',
                    dataIndex: 'arr',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        let re = 0
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i] == 5) {
                                re = re + 1
                            }
                        }
                        return (
                            re > 0 ? <Badge count={re == 1 ? 0 : re}> <div className={text ? "budge" : null} >5</div> </Badge> : null
                        )
                    },
                },
                {
                    title: '5',
                    dataIndex: 'arr',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        let re = 0
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i] == 6) {
                                re = re + 1
                            }
                        }
                        return (
                            re > 0 ? <Badge count={re == 1 ? 0 : re}> <div className={text ? "budge" : null} >6</div> </Badge> : null
                        )
                    },
                },
                {
                    title: '6',
                    dataIndex: 'arr',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        let re = 0
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i] == 7) {
                                re = re + 1
                            }
                        }
                        return (
                            re > 0 ? <Badge count={re == 1 ? 0 : re}> <div className={text ? "budge" : null} >7</div> </Badge> : null
                        )
                    },
                },
                {
                    title: '7',
                    dataIndex: 'arr',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        let re = 0
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i] == 8) {
                                re = re + 1
                            }
                        }
                        return (
                            re > 0 ? <Badge count={re == 1 ? 0 : re}> <div className={text ? "budge" : null} >8</div> </Badge> : null
                        )
                    },
                },
                {
                    title: '8',
                    dataIndex: 'arr',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        let re = 0
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i] == 9) {
                                re = re + 1
                            }
                        }
                        return (
                            re > 0 ? <Badge count={re == 1 ? 0 : re}> <div className={text ? "budge" : null} >9</div> </Badge> : null
                        )
                    },
                },
                {
                    title: '9',
                    dataIndex: 'arr',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        let re = 0
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i] == 0) {
                                re = re + 1
                            }
                        }
                        return (
                            re > 9 ? <Badge count={re == 1 ? 0 : re}> <div className={text ? "budge" : null} >9</div> </Badge> : null
                        )
                    },
                },

            ]
        },
        {
            title: "和值尾号",
            dataIndex: "h",
            children: [
                {
                    title: '0',
                    dataIndex: 'arr',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        let sum = 0
                        for (let i = 0; i < arr.length; i++) {
                            sum = sum + Number(arr[i])
                        }
                        let last = String(sum)[String(sum).length - 1]
                        return (
                            last === "0" ? <div className={last ? "ball_2" : null} >{last}</div> : null
                        )
                    },
                },
                {
                    title: '1',
                    dataIndex: 'h2',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        let sum = 0
                        for (let i = 0; i < arr.length; i++) {
                            sum = sum + Number(arr[i])
                        }
                        let last = String(sum)[String(sum).length - 1]
                        return (
                            last === "1" ? <div className={last ? "ball_2" : null} >{last}</div> : null
                        )
                    },
                },
                {
                    title: '2',
                    dataIndex: 'h2',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        let sum = 0
                        for (let i = 0; i < arr.length; i++) {
                            sum = sum + Number(arr[i])
                        }
                        let last = String(sum)[String(sum).length - 1]
                        return (
                            last === "2" ? <div className={last ? "ball_2" : null} >{last}</div> : null
                        )
                    },
                },
                {
                    title: '3',
                    dataIndex: 'h2',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        let sum = 0
                        for (let i = 0; i < arr.length; i++) {
                            sum = sum + Number(arr[i])
                        }
                        let last = String(sum)[String(sum).length - 1]
                        return (
                            last === "3" ? <div className={last ? "ball_2" : null} >{last}</div> : null
                        )
                    },
                },
                {
                    title: '4',
                    dataIndex: 'h2',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        let sum = 0
                        for (let i = 0; i < arr.length; i++) {
                            sum = sum + Number(arr[i])
                        }
                        let last = String(sum)[String(sum).length - 1]
                        return (
                            last === "4" ? <div className={last ? "ball_2" : null} >{last}</div> : null
                        )
                    },
                },
                {
                    title: '5',
                    dataIndex: 'h2',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        let sum = 0
                        for (let i = 0; i < arr.length; i++) {
                            sum = sum + Number(arr[i])
                        }
                        let last = String(sum)[String(sum).length - 1]
                        return (
                            last === "5" ? <div className={last ? "ball_2" : null} >{last}</div> : null
                        )
                    },
                },
                {
                    title: '6',
                    dataIndex: 'h2',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        let sum = 0
                        for (let i = 0; i < arr.length; i++) {
                            sum = sum + Number(arr[i])
                        }
                        let last = String(sum)[String(sum).length - 1]
                        return (
                            last === "6" ? <div className={last ? "ball_2" : null} >{last}</div> : null
                        )
                    },
                },
                {
                    title: '7',
                    dataIndex: 'h2',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        let sum = 0
                        for (let i = 0; i < arr.length; i++) {
                            sum = sum + Number(arr[i])
                        }
                        let last = String(sum)[String(sum).length - 1]
                        return (
                            last === "7" ? <div className={last ? "ball_2" : null} >{last}</div> : null
                        )
                    },
                },
                {
                    title: '8',
                    dataIndex: 'h2',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        let sum = 0
                        for (let i = 0; i < arr.length; i++) {
                            sum = sum + Number(arr[i])
                        }
                        let last = String(sum)[String(sum).length - 1]
                        return (
                            last === "8" ? <div className={last ? "ball_2" : null} >{last}</div> : null
                        )
                    },
                },
                {
                    title: '9',
                    dataIndex: 'h2',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        let sum = 0
                        for (let i = 0; i < arr.length; i++) {
                            sum = sum + Number(arr[i])
                        }
                        let last = String(sum)[String(sum).length - 1]
                        return (
                            last === "9" ? <div className={last ? "ball_2" : null} >{last}</div> : null
                        )
                    },
                },

            ]
        },
        {
            title: "跨度",
            dataIndex: "h",
            children: [
                {
                    title: '0',
                    dataIndex: 'arr',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        arr.sort((a, b) => {
                            return a - b
                        })
                        let cutBuynum = arr[4] - arr[0]
                        return (
                            cutBuynum == "0" ? <div className={cutBuynum ? "ball_3" : null} >{cutBuynum}</div> : null
                        )
                    },
                },
                {
                    title: '1',
                    dataIndex: 'arr',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        arr.sort((a, b) => {
                            return a - b
                        })
                        let cutBuynum = arr[4] - arr[0]
                        return (
                            cutBuynum == "1" ? <div className={cutBuynum ? "ball_3" : null} >{cutBuynum}</div> : null
                        )
                    },
                },
                {
                    title: '2',
                    dataIndex: 'arr',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        arr.sort((a, b) => {
                            return a - b
                        })
                        let cutBuynum = arr[4] - arr[0]
                        return (
                            cutBuynum == "2" ? <div className={cutBuynum ? "ball_3" : null} >{cutBuynum}</div> : null
                        )
                    },
                },
                {
                    title: '3',
                    dataIndex: 'arr',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        arr.sort((a, b) => {
                            return a - b
                        })
                        let cutBuynum = arr[4] - arr[0]
                        return (
                            cutBuynum == "3" ? <div className={cutBuynum ? "ball_3" : null} >{cutBuynum}</div> : null
                        )
                    },
                },
                {
                    title: '4',
                    dataIndex: 'arr',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        arr.sort((a, b) => {
                            return a - b
                        })
                        let cutBuynum = arr[4] - arr[0]
                        return (
                            cutBuynum == "4" ? <div className={cutBuynum ? "ball_3" : null} >{cutBuynum}</div> : null
                        )
                    },
                },
                {
                    title: '5',
                    dataIndex: 'arr',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        arr.sort((a, b) => {
                            return a - b
                        })
                        let cutBuynum = arr[4] - arr[0]
                        return (
                            cutBuynum == "5" ? <div className={cutBuynum ? "ball_3" : null} >{cutBuynum}</div> : null
                        )
                    },
                },
                {
                    title: '6',
                    dataIndex: 'arr',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        arr.sort((a, b) => {
                            return a - b
                        })
                        let cutBuynum = arr[4] - arr[0]
                        return (
                            cutBuynum == "6" ? <div className={cutBuynum ? "ball_3" : null} >{cutBuynum}</div> : null
                        )
                    },
                },
                {
                    title: '7',
                    dataIndex: 'arr',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        arr.sort((a, b) => {
                            return a - b
                        })
                        let cutBuynum = arr[4] - arr[0]
                        return (
                            cutBuynum == "7" ? <div className={cutBuynum ? "ball_3" : null} >{cutBuynum}</div> : null
                        )
                    },
                },
                {
                    title: '8',
                    dataIndex: 'arr',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        arr.sort((a, b) => {
                            return a - b
                        })
                        let cutBuynum = arr[4] - arr[0]
                        return (
                            cutBuynum == "8" ? <div className={cutBuynum ? "ball_3" : null} >{cutBuynum}</div> : null
                        )
                    },
                },
                {
                    title: '9',
                    dataIndex: 'arr',
                    render: (text, record, index) => {
                        let arr = text.split(",")
                        arr.sort((a, b) => {
                            return a - b
                        })
                        let cutBuynum = arr[4] - arr[0]
                        return (
                            cutBuynum == "9" ? <div className={cutBuynum ? "ball_3" : null} >{cutBuynum}</div> : null
                        )
                    },
                },

            ]
        },
        {
            title: "奇偶比",
            dataIndex: "arr",
            width: "40px",
            render: (text, record) => (
                this.compare1(text, record)
            )
        },
        {
            title: "大小比",
            dataIndex: "arr",
            width: "40px",
            render: (text, record) => (
                this.compare2(text, record)
            )
        },
        {
            title: "质合比",
            dataIndex: "arr",
            width: "40px",
            render: (text, record) => (
                this.compare3(text, record)
            )
        },
    ]
    //大小单双
    bigOrSmallColumns = [
        {
            title: "期号",
            dataIndex: "q",
            width: "80px"
        },
        {
            title: "奖号",
            dataIndex: "h",
            width: "40px",
            // render: (text, record) => text.replace(/,/g, "")

        },
        {
            title: "和值",
            dataIndex: "h",
            width: "40px",
            render: (text, record) => (
                Number(text[0]) + Number(text[1])
            )
        },
        {
            title: "跨度",
            dataIndex: "h",
            width: "40px",
            render: text => (
                Math.abs(Number(text[0]) - Number(text[1]))
            )
        },
        {
            title: "十位",
            dataIndex: "",
            children: [
                {
                    title: "大",
                    dataIndex: "h",
                    render: text => {
                        let a = Number(text[0])
                        if (a >= 5) {
                            return (
                                <div className="shape">大</div>
                            )
                        }
                    }
                },
                {
                    title: "小",
                    dataIndex: "h",
                    render: text => {
                        let a = Number(text[0])
                        if (a < 5) {
                            return (
                                <div className="shape">小</div>
                            )
                        }
                    }
                },
                {
                    title: "单",
                    dataIndex: "h",
                    render: text => {
                        let a = Number(text[0])
                        if (a === 1 || a === 3 || a === 5 || a === 7 || a === 9) {
                            return (
                                <div className="prime">单</div>
                            )
                        }
                    }
                },
                {
                    title: "双",
                    dataIndex: "h",
                    render: text => {
                        let a = Number(text[0])
                        if (a === 0 || a === 2 || a === 4 || a === 6 || a === 8) {
                            return (
                                <div className="prime">双</div>
                            )
                        }
                    }
                },
            ]
        },
        {
            title: "个位",
            dataIndex: "arr",
            children: [
                {
                    title: "大",
                    dataIndex: "h",
                    render: text => {
                        let a = Number(text[1])
                        if (a >= 5) {
                            return (
                                <div className="amplitude">大</div>
                            )
                        }
                    }
                },
                {
                    title: "小",
                    dataIndex: "h",
                    render: text => {
                        let a = Number(text[1])
                        if (a < 5) {
                            return (
                                <div className="amplitude">小</div>
                            )
                        }
                    }
                },
                {
                    title: "单",
                    dataIndex: "h",
                    render: text => {
                        let a = Number(text[1])
                        if (a === 1 || a === 3 || a === 5 || a === 7 || a === 9) {
                            return (
                                <div className="parity">单</div>
                            )
                        }
                    }
                },
                {
                    title: "双",
                    dataIndex: "h",
                    render: text => {
                        let a = Number(text[1])
                        if (a === 0 || a === 2 || a === 4 || a === 6 || a === 8) {
                            return (
                                <div className="parity">双</div>
                            )
                        }
                    }
                },
            ]
        },
        {
            title: "大小单双位置分布",
            dataIndex: "arr",
            children: [
                {
                    title: "大大",
                    className: "po_bag",
                    dataIndex: "h",
                    render: text => {
                        let a = Number(text[0])
                        let b = Number(text[1])
                        if (a >= 5 && b >= 5) {
                            return (
                                <div className="po_bag_word">大大</div>
                            )
                        }
                    }
                },
                {
                    title: "大小",
                    className: "po_bag",
                    dataIndex: "h",
                    render: text => {
                        let a = Number(text[0])
                        let b = Number(text[1])
                        if (a >= 5 && b < 5) {
                            return (
                                <div className="po_bag_word">大小</div>
                            )
                        }
                    }
                },
                {
                    title: "大单",
                    className: "po_bag",
                    dataIndex: "h",
                    render: text => {
                        let a = Number(text[0])
                        let b = Number(text[1])
                        if (a >= 5 && (b === 1 || b === 3 || b === 5 || b === 7 || b === 9)) {
                            return (
                                <div className="po_bag_word">大单</div>
                            )
                        }
                    }
                },
                {
                    title: "大双",
                    className: "po_bag",
                    dataIndex: "h",
                    render: text => {
                        let a = Number(text[0])
                        let b = Number(text[1])
                        if (a >= 5 && (b === 0 || b === 2 || b === 4 || b === 6 || b === 8)) {
                            return (
                                <div className="po_bag_word">大双</div>
                            )
                        }
                    }
                },
                {
                    title: "小大",
                    className: "po_bag",
                    dataIndex: "h",
                    render: text => {
                        let a = Number(text[0])
                        let b = Number(text[1])
                        if (a < 5 && b >= 5) {
                            return (
                                <div className="po_bag_word">小大</div>
                            )
                        }
                    }
                },
                {
                    title: "小小",
                    className: "po_bag",
                    dataIndex: "h",
                    render: text => {
                        let a = Number(text[0])
                        let b = Number(text[1])
                        if (a < 5 && b < 5) {
                            return (
                                <div className="po_bag_word">小小</div>
                            )
                        }
                    }
                },
                {
                    title: "小单",
                    className: "po_bag",
                    dataIndex: "h",
                    render: text => {
                        let a = Number(text[0])
                        let b = Number(text[1])
                        if (a < 5 && (b === 1 || b === 3 || b === 5 || b === 7 || b === 9)) {
                            return (
                                <div className="po_bag_word">小单</div>
                            )
                        }
                    }
                },
                {
                    title: "小双",
                    className: "po_bag",
                    dataIndex: "h",
                    render: text => {
                        let a = Number(text[0])
                        let b = Number(text[1])
                        if (a < 5 && (b === 0 || b === 2 || b === 4 || b === 6 || b === 8)) {
                            return (
                                <div className="po_bag_word">小双</div>
                            )
                        }
                    }
                },
                {
                    title: "单大",
                    className: "po_bag",
                    dataIndex: "h",
                    render: text => {
                        let a = Number(text[0])
                        let b = Number(text[1])
                        if ((a === 1 || a === 3 || a === 5 || a === 7 || a === 9) && b >= 5) {
                            return (
                                <div className="po_bag_word">单大</div>
                            )
                        }
                    }
                },
                {
                    title: "单小",
                    className: "po_bag",
                    dataIndex: "h",
                    render: text => {
                        let a = Number(text[0])
                        let b = Number(text[1])
                        if ((a === 1 || a === 3 || a === 5 || a === 7 || a === 9) && b < 5) {
                            return (
                                <div className="po_bag_word">单小</div>
                            )
                        }
                    }
                },
                {
                    title: "单单",
                    className: "po_bag",
                    dataIndex: "h",
                    render: text => {
                        let a = Number(text[0])
                        let b = Number(text[1])
                        if ((a === 1 || a === 3 || a === 5 || a === 7 || a === 9) && (b === 1 || b === 3 || b === 5 || b === 7 || b === 9)) {
                            return (
                                <div className="po_bag_word">单单</div>
                            )
                        }
                    }
                },
                {
                    title: "单双",
                    className: "po_bag",
                    dataIndex: "h",
                    render: text => {
                        let a = Number(text[0])
                        let b = Number(text[1])
                        if ((a === 1 || a === 3 || a === 5 || a === 7 || a === 9) && (b === 0 || b === 2 || b === 4 || b === 6 || b === 8)) {
                            return (
                                <div className="po_bag_word">单双</div>
                            )
                        }
                    }
                },
                {
                    title: "双大",
                    className: "po_bag",
                    dataIndex: "h",
                    render: text => {
                        let a = Number(text[0])
                        let b = Number(text[1])
                        if ((a === 0 || a === 2 || a === 4 || a === 6 || a === 8) && b >= 5) {
                            return (
                                <div className="po_bag_word">双大</div>
                            )
                        }
                    }
                },
                {
                    title: "双小",
                    className: "po_bag",
                    dataIndex: "h",
                    render: text => {
                        let a = Number(text[0])
                        let b = Number(text[1])
                        if ((a === 0 || a === 2 || a === 4 || a === 6 || a === 8) && b < 5) {
                            return (
                                <div className="po_bag_word">双小</div>
                            )
                        }
                    }
                },
                {
                    title: "双单",
                    className: "po_bag",
                    dataIndex: "h",
                    render: text => {
                        let a = Number(text[0])
                        let b = Number(text[1])
                        if ((a === 0 || a === 2 || a === 4 || a === 6 || a === 8) && (b === 1 || b === 3 || b === 5 || b === 7 || b === 9)) {
                            return (
                                <div className="po_bag_word">双单</div>
                            )
                        }
                    }
                },
                {
                    title: "双双",
                    className: "po_bag",
                    dataIndex: "h",
                    render: text => {
                        let a = Number(text[0])
                        let b = Number(text[1])
                        if ((a === 0 || a === 2 || a === 4 || a === 6 || a === 8) && (b === 0 || b === 2 || b === 4 || b === 6 || b === 8)) {
                            return (
                                <div className="po_bag_word">双双</div>
                            )
                        }
                    }
                },
            ]
        },
    ]

    render() {
        const { loading, loading1, trendName, h, m, s, nextPeriods, lastPeriods, lastTime, lastResult, newData, columnsIndex, tableStr } = this.state


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
                                    {trendName} <CaretDownOutlined style={{ color: "#fff", fontSize: "xx-large", marginTop: "-10px" }} />
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
                                <Button ghost size="large" style={{ width: "100px", height: "50px" }} onClick={this.openBuy}>充值</Button>
                                <Button ghost type="link" style={{ width: "100px", height: "100%" }} onClick={this.search}>
                                    <SearchOutlined color="#fff" style={{ fontSize: "xx-large", lineHeight: "" }} />

                                </Button>
                            </div>
                        </div>
                        <div style={{ height: "100px", lineHeight: "100px", padding: "0 50px" }}>
                            <span>
                                <span>第</span>
                                <span style={{ fontSize: "50px", color: "#f7833b", margin: "0 20px" }}>{nextPeriods}</span>
                                <span>期</span>
                            </span>
                            <span style={{ margin: "0 20px" }}>距开奖
                                <span style={{ fontSize: "50px", color: "#f7833b", margin: "0 20px" }}>
                                    {h}:{m}:{s}
                                </span>
                            </span>
                        </div>
                        <Divider style={{ margin: "5px 0", background: "#ccc" }} />
                        <div style={{ height: "100px", lineHeight: "100px", display: "flex", padding: "0 40px", fontSize: "large" }}>
                            <div style={{ marginRight: "20px" }}>
                                <span>第</span>
                                <span style={{ margin: "0 20px" }}>{lastPeriods}</span>
                                <span>期结果</span>
                            </div>
                            {
                                lastResult.map((item, index) => {
                                    return (
                                        <div className="prizeBall" key={index}>{item}</div>

                                    )
                                })
                            }
                            <div>开奖时间：
                            <span style={{ margin: "0 10px" }}>{lastTime.slice(0, 16)}</span>

                            </div>
                        </div>

                        <div style={{ padding: "0 40px", zIndex: 999 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", height: "80px", lineHeight: "80px" }}>
                                <div className="firstWord">定位</div>
                                <Button
                                    onClick={() => this.creataData(0)}
                                    style={{ fontSize: "xx-large", height: "80px" }}
                                    type="link"
                                    danger={columnsIndex === 0 && tableStr === "万" ? true : false}
                                >
                                    万位</Button>
                                <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                                <Button
                                    onClick={() => this.creataData(1)}
                                    style={{ fontSize: "xx-large", height: "80px" }}
                                    type="link"
                                    danger={columnsIndex === 0 && tableStr === "千" ? true : false}
                                >千位</Button>
                                <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                                <Button
                                    onClick={() => this.creataData(2)}
                                    style={{ fontSize: "xx-large", height: "80px" }}
                                    type="link"
                                    danger={columnsIndex === 0 && tableStr === "百" ? true : false}
                                >百位</Button>
                                <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                                <Button
                                    onClick={() => this.creataData(3)}
                                    style={{ fontSize: "xx-large", height: "80px" }}
                                    type="link"
                                    danger={columnsIndex === 0 && tableStr === "十" ? true : false}
                                >十位</Button>
                                <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                                <Button
                                    onClick={() => this.creataData(4)}
                                    style={{ fontSize: "xx-large", height: "80px" }}
                                    type="link"
                                    danger={columnsIndex === 0 && tableStr === "个" ? true : false}
                                >个位</Button>
                                <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                                <Button
                                    onClick={() => this.creataBMData(6)}
                                    style={{ fontSize: "xx-large", height: "80px" }}
                                    type="link"
                                    danger={columnsIndex === 6 ? true : false}
                                >大小单双</Button>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", height: "80px", lineHeight: "80px", margin: "20px 0" }}>
                                <div className="firstWord">其他</div>
                                <Button onClick={() => this.changeTable(1)}
                                    style={{ fontSize: "xx-large", height: "80px" }}
                                    type="link"
                                    danger={columnsIndex === 1 ? true : false}>五星走势</Button>
                                <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                                <Button
                                    onClick={() => this.changeTable(2)}
                                    style={{ fontSize: "xx-large", height: "80px" }}
                                    type="link"
                                    danger={columnsIndex === 2 ? true : false}>五星综合</Button>
                                <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                                <Button
                                    // onClick={() => this.changeTable(3)}
                                    style={{ fontSize: "xx-large", height: "80px" }}
                                    type="link">大小</Button>
                                <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                                <Button
                                    // onClick={() => this.changeTable(4)}
                                    style={{ fontSize: "xx-large", height: "80px" }}
                                    type="link">单双</Button>
                                <Divider type="vertical" style={{ height: "40px", margin: "25px 0", background: "#ccc" }} />
                                <Button
                                    // onClick={() => this.changeTable(5)}
                                    style={{ fontSize: "xx-large", height: "80px" }}
                                    type="link">龙虎</Button>
                            </div>
                        </div>
                        <Content style={{ padding: "" }}>
                            {
                                this.state.columnsIndex === 1 ?
                                    <Table
                                        columns={this.fiveColumns}
                                        className="fiveGoList"
                                        rowKey={"q"}
                                        bordered
                                        pagination={false}
                                        dataSource={newData}
                                    />
                                    : this.state.columnsIndex === 2 ?
                                        <Table
                                            columns={this.fiveAllColumns}
                                            className="fiveAllList"
                                            rowKey={"q"}
                                            bordered
                                            pagination={false}
                                            dataSource={newData}
                                        /> : this.state.columnsIndex === 6 ?
                                            <Table
                                                columns={this.bigOrSmallColumns}
                                                className="list"
                                                rowKey={"q"}
                                                bordered
                                                pagination={false}
                                                dataSource={newData}
                                            />
                                            :
                                            <Table
                                                columns={columns}
                                                className="list"
                                                rowKey={"q"}
                                                bordered
                                                pagination={false}
                                                dataSource={newData}
                                            />
                            }



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
                                                alt={item.name}
                                                onClick={() => this.changeTableData(item.id, item.type)}
                                            >

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

                    <Modal
                        // title="实时彩类"
                        visible={this.state.buyVisible}
                        onOk={this.buy}
                        onCancel={this.handleCancel1}
                        // footer={false}
                        okText="确定"
                        cancelText="取消"
                        className="trendSort"
                    >
                        <Input style={{ margin: "30px 0" }} onChange={e => this.cardChange(e)} />
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