var React = require('react');
var DownloadsStore = require('../stores/DownloadsStore.js')
var DownloadCard = require('./DownloadCard.jsx');

require('../../styles/DownloadsList.scss');

var DownloadsList = React.createClass({

  getInitialState: function() {
    return DownloadsStore.getState();
  },

  componentDidMount: function() {
    DownloadsStore.listen(this.onChange);
  },

  componentWillUmount: function() {
    DownloadsStore.unlisten(this.onChange);
  },

  onChange: function(state) {

    this.setState(state);
  },

  render: function(){
  var downloadListContent;
    if (this.state.downloads.length != 0) {
downloadListContent = this.state.downloads.map(function(download){
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
