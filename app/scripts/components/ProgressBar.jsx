var React = require('react');

var ProgressBar = React.createClass({

  componentDidMount: function(){
    $(React.findDOMNode(this)).progress();
  },

  render: function(){

    return (
      <div className="ui teal progress" data-percent={this.props.percent}>
        <div className="bar"></div>
        <div className="label">{this.props.percent}% Downloaded</div>
      </div>
    );
  }
})

module.exports = ProgressBar;
