import { createStore, applyMiddleware } from 'redux'
import ReactDOM from 'react-dom'
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux'
import mainReducer from './reducers/mainReducer'
import React from 'react'
import App from './components/App.jsx'
import Api from './utils/Api'

// Make jQuery available in the global scope for plugins
var $ = require('jquery');
window.jQuery = $;
window.$ = $;

require('../semantic-ui/semantic.js');
require('../semantic-ui/semantic.css');

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
