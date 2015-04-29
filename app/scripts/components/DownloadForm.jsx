var React = require('react');
var mui = require('material-ui');

var DownloadForm = React.createClass({
  getInitialState: function(){
    return {URL: '', author: '', title: ''}
  },

  handleURLChange: function(e) {
    this.setState({URL: e.target.value})
  },

  handleAuthorChange: function(e) {
    this.setState({author: e.target.value})
  },

  handleTitleChange: function(e) {
    this.setState({title: e.target.value})
  },

  handleDownload: function(e) {
    e.preventDefault();
    console.log(this.state);
  },


  render: function(){
    return (
      <form onSubmit={this.handleDownload} className="download-form">
        <div>
          <mui.TextField  hintText="URL" onChange={this.handleURLChange} />
        </div>
        <div>
          <mui.TextField hintText="Autor" onChange={this.handleAuthorChange} />
        </div>
        <div>
          <mui.TextField hintText="Título" onChange={this.handleTitleChange} />
        </div>
        <div>
          <mui.RaisedButton label="Descargar" primary={true} />
        </div>
      </form>
    )
  }
})

module.exports = DownloadForm;
