import React from 'react';
import ReactDOM from 'react-dom';
import RouterLink from './router/index'
import { Provider } from 'react-redux';
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
  document.getElementById('root')
);

serviceWorker.unregister();
