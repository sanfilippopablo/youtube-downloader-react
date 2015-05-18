import React from 'react';
var mui = require('material-ui');
var DownloadsList = require('./DownloadsList.jsx');
var DownloadForm = require('./DownloadForm.jsx');

require('../../../node_modules/material-ui-sass/material-ui.scss');

require('../../styles/App.scss');

class App extends React.Component{

  render() {
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
}

export default App;
