var alt = require('../alt');

function DownloadActions() {};

DownloadActions.prototype.download = function(d) {
  this.dispatch(d);
}

DownloadActions.prototype.updateDownload = function(statusData) {
  this.dispatch(statusData);
}

module.exports = alt.createActions(DownloadActions);
