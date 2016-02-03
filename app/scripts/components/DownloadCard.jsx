import React from 'react'
import ProgressBar  from './ProgressBar.jsx'
import LinearProgress from 'material-ui/lib/linear-progress'
import Card from 'material-ui/lib/card/card'

require('../../styles/DownloadCard.scss');

const DownloadCard = (props) => {
  return (
    <Card className="downloadcard">
      <div className="info-wrapper">
        <div>
          <h3 className="header">{props.download.author} - {props.download.title}</h3>
          <div className="meta">{props.download.details.description}</div>
        </div>
        <div>
          <div><strong>Velocidad:</strong> {props.download.details.speed}</div>
            <div><strong>Tiempo restante estimado:</strong> {props.download.details.ETA}</div>
        </div>
      </div>
      <LinearProgress mode="determinate" value={props.download.details.percent} />
    </Card>
  )
}

export default DownloadCard
