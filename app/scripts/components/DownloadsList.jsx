import React from 'react'
import DownloadCard from './DownloadCard.jsx'

require('../../styles/DownloadsList.scss');

const DownloadsList = ({downloads}) => {

  let downloadListContent;

  if (downloads.length != 0) {
    downloadListContent = downloads.map(function(download){
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

export default DownloadsList
