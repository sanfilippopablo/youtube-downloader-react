var React = require('react');
var DownloadCard = require('./DownloadCard.jsx');

require('../../styles/DownloadsList.scss');

var DownloadsList = React.createClass({

  render: function() {

    let downloadListContent;

    if (this.props.downloads.length != 0) {
      downloadListContent = this.props.downloads.map(function(download){
        return <DownloadCard download={download} key={download.URL}></DownloadCard>
      });
    }
    else {
      downloadListContent = <div className="no-downloads-message">No hay descargas en este momento.</div>
    }

    return (
      <div className="downloads-list">
        {downloadListContent}
      </div>
    )
  }
})

module.exports = DownloadsList;
