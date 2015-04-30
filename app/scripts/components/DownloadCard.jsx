var React = require('react');
var mui = require('material-ui');
var ProgressBar = require('./ProgressBar.jsx')

var DownloadCard = React.createClass({
  render: function(){
    return (
      <mui.Paper zDepth={1} innerClassName="downloadcard" className="downloadcardo">
        <h3 className="downloadcard-autortitulo">{this.props.download.author} - {this.props.download.title}</h3>
        <div className="downloadcard-estado">{this.props.download.status}</div>
        <div className="downloadcard-statusbar">{this.props.download.details.percent}</div>
        <ProgressBar percent={this.props.download.details.percent}></ProgressBar>
      </mui.Paper>
    )
  }
})

module.exports = DownloadCard;
