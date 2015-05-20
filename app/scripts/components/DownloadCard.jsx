var React = require('react');
var ProgressBar = require('./ProgressBar.jsx');

require('../../styles/DownloadCard.scss');

var DownloadCard = React.createClass({
  render: function(){
    return (
      <div className="ui card fluid">
        <div className="content">
          <h3 className="header">{this.props.download.author} - {this.props.download.title}</h3>
          <div className="meta">{this.props.download.status}</div>
          <div className="downloadcard-statusbar">{this.props.download.details.percent}</div>
          <ProgressBar percent={this.props.download.details.percent}></ProgressBar>
        </div>
      </div>
    )
  }
})

module.exports = DownloadCard;
