import React from 'react'

require('../../styles/AppBar.scss');

const AppBar = ({color, title}) => {
  return (
    <div className="AppBar-container" style={{backgroundColor: color}}>
      <span className="AppBar-title">{title}</span>
    </div>
  )
}

AppBar.defaultProps = {color: 'cadetblue'};

export default AppBar;
