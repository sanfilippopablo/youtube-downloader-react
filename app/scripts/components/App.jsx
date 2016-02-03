import React from 'react'
import AppBar from 'material-ui/lib/app-bar';
import { connect } from 'react-redux'

import { download } from '../actions'
import DownloadsList from './DownloadsList.jsx'
import DownloadForm from './DownloadForm.jsx'

require('../../styles/App.scss');

const App = ({dispatch, downloads}) => {
  return (
    <div className="App-container">
      <AppBar title="Youtube MP3 Downloader" />
      <div className="main-section">
        <DownloadForm onSubmit={data => dispatch(download(data))}></DownloadForm>
        <DownloadsList downloads={downloads}></DownloadsList>
      </div>
    </div>
  )
}

App.propTypes = {
  downloads: React.PropTypes.array.isRequired
}

export default connect(state => state)(App)
