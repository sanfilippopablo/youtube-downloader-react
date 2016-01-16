import React from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'

const labels = {
  'success': 'Descarga completada',
  'error': 'Ocurrió un error en la descarga',
  'downloading': 'Descargando'
}

class ProgressBar extends React.Component {

  componentDidMount() {
    $(ReactDOM.findDOMNode(this)).progress({
      autoSuccess: false,
      percent: this.props.percent
    });
  }

  componentDidUpdate() {
    $(ReactDOM.findDOMNode(this)).progress({
      autoSuccess: false,
      percent: this.props.percent
      });
  }

  render() {

    let label = labels[this.props.status];

    return (
      <div className={classnames("ui", "teal", "progress", this.props.className, this.props.status)}>
        <div className="bar">
          <div className="progress"></div>
        </div>
        <div className="label">{label}</div>
      </div>
    );
  }
}

export default ProgressBar
