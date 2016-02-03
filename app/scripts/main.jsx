import { createStore, applyMiddleware, combineReducers } from 'redux'
import ReactDOM from 'react-dom'
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux'
import downloadsReducer from './reducers/downloadsReducer'
import {reducer as formReducer} from 'redux-form';
import React from 'react'
import App from './components/App.jsx'
import Api from './utils/Api'

const reducers = {
  downloads: downloadsReducer,
  form: formReducer
}
const mainReducer = combineReducers(reducers);
const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);
let store = createStoreWithMiddleware(mainReducer);

Api.addStatusUpdateListener((payload) => {
  store.dispatch({
    type: 'STATUS_UPDATE',
    payload: payload
  })
})

let rootElement = document.getElementById('app')
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
)
