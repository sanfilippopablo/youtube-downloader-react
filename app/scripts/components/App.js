import React from 'react'
import AppBar from './AppBar.jsx'
import { connect } from 'react-redux'

import { download } from '../actions'

var DownloadsList = require('./DownloadsList.jsx');
var DownloadForm = require('./DownloadForm.jsx');

require('../../styles/App.scss');



class App extends React.Component {
  render() {
    const {dispatch, downloads} = this.props;

    return (
      <div className="App-container">
        <AppBar title="Youtube MP3 Downloader"></AppBar>
        <div className="main-section">
          <DownloadForm onFormSubmit={data => dispatch(download(data))}></DownloadForm>
          <DownloadsList downloads={downloads}></DownloadsList>
        </div>
      </div>
    )
  }
}

App.propTypes = {
  downloads: React.PropTypes.array.isRequired
}

function select(state) {
  return state
}

export default connect(select)(App);
