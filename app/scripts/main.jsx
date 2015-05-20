var React = require('react');
var mui = require('material-ui');
var App = require('./components/App.jsx');

// Make jQuery available in the global scope for plugins
var $ = require('jquery');
window.jQuery = $;
window.$ = $;

require('../semantic-ui/semantic.js');
require('../semantic-ui/semantic.css');

React.render(
  <App />,
  document.getElementById('app')
);
