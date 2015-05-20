import React from 'react';
var mui = require('material-ui');
var DownloadsList = require('./DownloadsList.jsx');
var DownloadForm = require('./DownloadForm.jsx');

require('../../../node_modules/material-ui-sass/material-ui.scss');

require('../../styles/App.scss');

class App extends React.Component{

  render() {
    return (
        <div className="main-section">
          <DownloadForm></DownloadForm>
          <DownloadsList></DownloadsList>
        </div>
    )
  }
}

export default App;
