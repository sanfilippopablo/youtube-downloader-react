var React = require('react');
var mui = require('material-ui');
var DownloadActions = require('../actions/DownloadActions.js');

require('../../styles/DownloadForm.scss');

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
    this.setState(this.getInitialState());
    DownloadActions.download(this.state);
  },


  render: function(){
    return (
    <div className="download-form-container">
      <form onSubmit={this.handleDownload} className="download-form">
        <div>
          <mui.TextField  hintText="URL" value={this.state.URL} onChange={this.handleURLChange} />
        </div>
        <div>
          <mui.TextField hintText="Autor" value={this.state.author} onChange={this.handleAuthorChange} />
        </div>
        <div>
          <mui.TextField hintText="Título" value={this.state.title} onChange={this.handleTitleChange} />
        </div>
        <div>
          <mui.RaisedButton label="Descargar" primary={true} />
        </div>
      </form>
      </div>
    )
  }
})

module.exports = DownloadForm;
