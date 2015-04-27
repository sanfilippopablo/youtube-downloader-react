var React = require('react');
var mui = require('material-ui');

var App = React.createClass({
  render: function(){
    return (
      <mui.Paper zDepth={1}>
        <p>zDepth=1</p>
      </mui.Paper>
    )
  }
})

module.exports = App;
