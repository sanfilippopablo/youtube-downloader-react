var React = require('react');
var mui = require('material-ui');

var DownloadCard = React.createClass({
  render: function(){
    return (
      <mui.Paper zDepth={1} innerClassName="downloadcard">
        <h3 className="downloadcard-autortitulo">{this.props.download.author} - {this.props.download.title}</h3>
        <div className="downloadcard-estado">{this.props.download.status}</div>
        <div className="downloadcard-statusbar">{this.props.download.percent}</div>
      </mui.Paper>
    )
  }
})

module.exports = DownloadCard;
