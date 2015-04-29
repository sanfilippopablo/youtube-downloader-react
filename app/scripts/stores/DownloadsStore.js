var alt = require('../alt');
var _ = require('lodash');
var DownloadActions = require('../actions/DownloadActions');

function DownloadsStore() {
  this.downloads = [];

  this.downloads.push({
    'author': 'El autor',
    'title': 'Un titulo',
    'status': 'Descargando el video',
    'percent': 45
  });
  this.downloads.push({
    'author': 'Otro autor',
    'title': 'Y otro titulo',
    'status': 'Descargando el video',
    'percent': 12
  });
  this.downloads.push({
    'author': 'El mismo autor',
    'title': 'pero otro titulo',
    'status': 'Descargando el video',
    'percent': 95
  });

  this.bindListeners({
    handleDownload: DownloadActions.DOWNLOAD
  });
}

DownloadsStore.prototype.handleDownload = function (d) {
  var defParams = {
    'status': 'preprocessing',
    'details': 'Sending to server'
  }
  var d = _.assign(d, defParams);
  this.downloads.push(d);
}

module.exports = alt.createStore(DownloadsStore, 'DownloadsStore');
