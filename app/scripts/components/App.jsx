import React from 'react'
import AppBar from './AppBar.jsx'
import { connect } from 'react-redux'

import { download } from '../actions'
import DownloadsList from './DownloadsList.jsx'
import DownloadForm from './DownloadForm.jsx'

require('../../styles/App.scss');

const App = ({dispatch, downloads}) => {
  return (
    <div className="App-container">
      <AppBar title="Youtube MP3 Downloader"></AppBar>
      <div className="main-section">
        <DownloadForm onFormSubmit={data => dispatch(download(data))}></DownloadForm>
        <DownloadsList downloads={downloads.downloads}></DownloadsList>
      </div>
    </div>
  )
}

App.propTypes = {
  downloads: React.PropTypes.object.isRequired
}

export default connect(state => state)(App)
