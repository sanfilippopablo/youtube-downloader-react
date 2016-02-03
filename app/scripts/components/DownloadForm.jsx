import React from 'react'
import {reduxForm} from 'redux-form'

require('../../styles/DownloadForm.scss');

var DownloadForm = React.createClass({

  render: function(){

    const {fields: {URL, author, title}, handleSubmit} = this.props;

    return (
    <div className="download-form-container">
      <form onSubmit={handleSubmit} className="download-form ui form">
          <div className="field">
            <input type="text" placeholder="URL" {...URL} />
          </div>
        <div className="field">
          <input type="text" placeholder="Autor" {...author} />
        </div>
        <div className="field">
          <input type="text" placeholder="Título" {...title} />
        </div>
        <div className="field">
          <button className="ui button primary">Descargar</button>
        </div>
      </form>
      </div>
    )
  }
})

DownloadForm = reduxForm({
  form: 'download',
  fields: ['URL', 'author', 'title']
})(DownloadForm);

export default DownloadForm
