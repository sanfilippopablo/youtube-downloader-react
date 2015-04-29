var React = require('react');
var mui = require('material-ui');
var DownloadsList = require('./DownloadsList.jsx');
var DownloadForm = require('./DownloadForm.jsx');

var App = React.createClass({
  render: function(){

    var ds = [];
    ds.push({
      'author': 'El autor',
      'title': 'Un titulo',
      'status': 'Descargando el video',
      'percent': 45
    });
    ds.push({
      'author': 'Otro autor',
      'title': 'Y otro titulo',
      'status': 'Descargando el video',
      'percent': 12
    });
    ds.push({
      'author': 'El mismo autor',
      'title': 'pero otro titulo',
      'status': 'Descargando el video',
      'percent': 95
    });

    return (
      <div>
        <DownloadForm></DownloadForm>
        <DownloadsList downloads={ds}></DownloadsList>
      </div>
    )
  }
})

module.exports = App;
