import React from 'react'
import ProgressBar  from './ProgressBar.jsx'

require('../../styles/DownloadCard.scss');

const DownloadCard = (props) => {

  let status;
  if (['preprocessing', 'downloading', 'postprocessing'].indexOf(props.download.status) !== -1) {
    status = 'active';
  }
  else
  if (props.download.status === 'complete'){
    status = 'success'
  }
  else {
    // 'error'
    status = props.download.status
  }

  return (
    <div className="DownloadCard ui card fluid">
      <div className="content">
        <div className="info-wrapper">
          <div className="left-info">
            <h3 className="header">{props.download.author} - {props.download.title}</h3>
            <div className="meta">{props.download.details.description}</div>
          </div>
          <div className="right-info">
            <div><strong>Velocidad:</strong> {props.download.details.speed}</div>
              <div><strong>Tiempo restante estimado:</strong> {props.download.details.ETA}</div>
          </div>
        </div>
        <ProgressBar className="DownloadCard-progressbar" status={status} percent={props.download.details.percent}></ProgressBar>
      </div>
    </div>
  )
}

export default DownloadCard
