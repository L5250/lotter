import React from 'react';
import ReactDOM from 'react-dom';
import RouterLink from './router/index'
// import App from './App';
import Login from './login'
import Trend from './pages/trend'
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import store from './store'
import './index.css';
import * as serviceWorker from './serviceWorker';


ReactDOM.render(
  // <React.StrictMode>
    <Provider store={store}>
      <RouterLink />
    </Provider>
  // </React.StrictMode>
  ,
  document.getElementById('root',console.log(store))
);

serviceWorker.unregister();
