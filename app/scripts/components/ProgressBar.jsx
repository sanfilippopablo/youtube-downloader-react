var React = require('react');
import classnames from 'classnames';

var labels = {
  'success': 'Descarga completada',
  'error': 'Ocurrió un error en la descarga',
  'downloading': 'Descargando'
}

var ProgressBar = React.createClass({

  componentDidMount: function(){
    $(React.findDOMNode(this)).progress({
      autoSuccess: false,
      percent: this.props.percent
    });
  },

  componentDidUpdate: function(){
    $(React.findDOMNode(this)).progress({
      autoSuccess: false,
      percent: this.props.percent
      });
  },

  render: function(){

    var label = labels[this.props.status];

    return (
      <div className={classnames("ui", "teal", "progress", this.props.className, this.props.status)}>
        <div className="bar">
          <div className="progress"></div>
        </div>
        <div className="label">{label}</div>
      </div>
    );
  }
})

module.exports = ProgressBar;
