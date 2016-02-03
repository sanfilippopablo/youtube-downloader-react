import React from 'react'
import ProgressBar  from './ProgressBar.jsx'
import LinearProgress from 'material-ui/lib/linear-progress'

require('../../styles/DownloadCard.scss');

const DownloadCard = (props) => {
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
        <LinearProgress mode="determinate" value={props.download.details.percent} />
      </div>
    </div>
  )
}

export default DownloadCard
