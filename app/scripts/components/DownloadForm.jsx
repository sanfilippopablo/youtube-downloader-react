var React = require('react');
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
      <form onSubmit={this.handleDownload} className="download-form ui form">
          <div className="field">
            <input type="text" placeholder="URL" value={this.state.URL} onChange={this.handleURLChange} />
          </div>
        <div className="field">
          <input type="text" placeholder="Autor" value={this.state.author} onChange={this.handleAuthorChange} />
        </div>
        <div className="field">
          <input type="text" placeholder="Título" value={this.state.title} onChange={this.handleTitleChange} />
        </div>
        <div className="field">
          <button className="ui button primary">Descargar</button>
        </div>
      </form>
      </div>
    )
  }
})

module.exports = DownloadForm;
