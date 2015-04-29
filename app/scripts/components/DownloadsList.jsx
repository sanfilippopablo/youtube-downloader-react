var React = require('react');
var DownloadCard = require('./DownloadCard.jsx');

var DownloadsList = React.createClass({
  render: function(){
    var downloadItems = this.props.downloads.map(function(download){
      return <DownloadCard download={download} key={download.author + download.title}></DownloadCard>
    });
    return (
      <div className="downloads-list">
        {downloadItems}
      </div>
    )
  }
})

module.exports = DownloadsList;
