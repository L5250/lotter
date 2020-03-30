import React, { Component } from 'react';
import { HashRouter as Router, Link, Route } from 'react-router-dom';
import Trend from '../pages/trend/index';
import Login from '../login/index'
import Logon from '../logon/index'

class RouterLink extends Component {
    render() {
        return (
            <Router>
                <Route path='/' exact component={Trend}></Route>
                <Route path='/login'  component={Login}></Route>
                <Route path='/logon' component={Logon}></Route>
            </Router>
        );
    }
}

export default RouterLink;