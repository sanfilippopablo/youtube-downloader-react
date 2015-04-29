var React = require('react');
var mui = require('material-ui');
var DownloadsList = require('./DownloadsList.jsx');
var DownloadForm = require('./DownloadForm.jsx');

var App = React.createClass({
  render: function(){

    return (
      <div>
        <mui.AppBar title="Youtube MP3 Downloader" showMenuIconButton={false}></mui.AppBar>
        <div className="main-section">
          <DownloadForm></DownloadForm>
          <DownloadsList></DownloadsList>
        </div>
      </div>
    )
  }
})

module.exports = App;
