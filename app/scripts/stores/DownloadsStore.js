var alt = require('../alt');
var _ = require('lodash');
var DownloadActions = require('../actions/DownloadActions');

function DownloadsStore() {
  this.downloads = [];

  this.bindListeners({
    handleDownload: DownloadActions.DOWNLOAD,
    handleStatusUpdate: DownloadActions.UPDATE_DOWNLOAD
  });
}

DownloadsStore.prototype.handleDownload = function (d) {

  var defParams = {
    'status': 'preprocessing',
    'details': {
      'percent': 0
    }
  }
  var d = _.assign(d, defParams);
  this.downloads.push(d);
}

DownloadsStore.prototype.handleStatusUpdate = function(status) {
  for (var i = 0; i < this.downloads.length; i++) {
    if (this.downloads[i].URL === status.URL) {
      this.downloads[i] = _.assign(this.downloads[i], status);
    } else {

    }
  }
}

module.exports = alt.createStore(DownloadsStore, 'DownloadsStore');
