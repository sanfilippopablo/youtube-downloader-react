var React = require('react');
var ProgressBar = require('./ProgressBar.jsx');

require('../../styles/DownloadCard.scss');

var DownloadCard = React.createClass({
  render: function(){
    var status;
    if (['preprocessing', 'downloading', 'postprocessing'].indexOf(this.props.download.status) !== -1) {
      status = 'active';
    }
    else
    if (this.props.download.status === 'complete'){
      status = 'success'
    }
    else {
      // 'error'
      status = this.props.download.status
    }

    return (
      <div className="ui card fluid">
        <div className="content">
          <h3 className="header">{this.props.download.author} - {this.props.download.title}</h3>
          <div className="meta">{this.props.download.details.description}</div>
          <ProgressBar className="DownloadCard-progressbar" status={status} percent={this.props.download.details.percent}></ProgressBar>
        </div>
      </div>
    )
  }
})

module.exports = DownloadCard;
