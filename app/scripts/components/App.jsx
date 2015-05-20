import React from 'react';
import AppBar from './AppBar.jsx';
var DownloadsList = require('./DownloadsList.jsx');
var DownloadForm = require('./DownloadForm.jsx');

require('../../../node_modules/material-ui-sass/material-ui.scss');

require('../../styles/App.scss');

class App extends React.Component{

  render() {
    return (
      <div className="App-container">
        <AppBar title="Youtube MP3 Downloader"></AppBar>
        <div className="main-section">
          <DownloadForm></DownloadForm>
          <DownloadsList></DownloadsList>
        </div>
      </div>
    )
  }
}

export default App;
