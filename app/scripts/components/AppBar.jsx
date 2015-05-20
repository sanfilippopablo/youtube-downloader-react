import React from 'react';

require('../../styles/AppBar.scss');

class AppBar extends React.Component {
  render() {
    return (
      <div className="AppBar-container" style={{backgroundColor: this.props.color}}>
        <span className="AppBar-title">{this.props.title}</span>
      </div>
    )
  }
}

AppBar.defaultProps = {color: 'cadetblue'};

export default AppBar;
