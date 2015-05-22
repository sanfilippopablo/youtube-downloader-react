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
      <div className="DownloadCard ui card fluid">
        <div className="content">
          <div className="info-wrapper">
            <div className="left-info">
              <h3 className="header">{this.props.download.author} - {this.props.download.title}</h3>
              <div className="meta">{this.props.download.details.description}</div>
            </div>
            <div className="right-info">
              <div><strong>Velocidad:</strong> {this.props.download.details.speed}</div>
                <div><strong>Tiempo restante estimado:</strong> {this.props.download.details.ETA}</div>
            </div>
          </div>
          <ProgressBar className="DownloadCard-progressbar" status={status} percent={this.props.download.details.percent}></ProgressBar>
        </div>
      </div>
    )
  }
})

module.exports = DownloadCard;
