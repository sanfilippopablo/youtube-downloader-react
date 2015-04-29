var React = require('react');

var ProgressBar = React.createClass({
  render: function(){
    var outterStyle = {
      "width": "100%",
      "height": "8px",
      "background-color": "#eee"
    };
    var innerStyle = {
      "background-color": "aqua",
      "height": "8px",
      "width": this.props.percent + "%"
    };
    return (
      <div style={outterStyle}>
        <div style={innerStyle}></div>
      </div>
    );
  }
})

module.exports = ProgressBar;
