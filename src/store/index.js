import { createStore, combineReducers } from 'redux';
 import countReducer from './reducers/countReducer';
 
 const rootReducer = combineReducers({
     countReducer
 })
 
 const initializeState = {}; // 定义初始化的state
 
 const store = createStore(rootReducer,initializeState);
 
 export default store;