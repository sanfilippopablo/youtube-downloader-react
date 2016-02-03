import React from 'react'
import {reduxForm} from 'redux-form'
import TextField from 'material-ui/lib/text-field'
import RaisedButton from 'material-ui/lib/raised-button'

require('../../styles/DownloadForm.scss');

var DownloadForm = React.createClass({

  render: function(){

    const {fields: {URL, author, title}, handleSubmit} = this.props;

    return (
    <div className="download-form-container">
      <form onSubmit={handleSubmit} className="download-form">
        <div className="field">
          <TextField fullWidth={true} floatingLabelText="URL" {...URL} />
        </div>
        <div className="field">
          <TextField fullWidth={true} floatingLabelText="Autor" {...author} />
        </div>
        <div className="field">
          <TextField fullWidth={true} floatingLabelText="Título" {...title} />
        </div>
        <div className="field">
          <RaisedButton label="Descargar" type="submit" secondary={true} />
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
