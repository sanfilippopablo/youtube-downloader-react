var React = require('react');
var DownloadsStore = require('../stores/DownloadsStore.js')
var DownloadCard = require('./DownloadCard.jsx');

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
    var downloadItems = this.state.downloads.map(function(download){
      return <DownloadCard download={download} key={download.URL}></DownloadCard>
    });
    return (
      <div className="downloads-list">
        {downloadItems}
      </div>
    )
  }
})

module.exports = DownloadsList;
