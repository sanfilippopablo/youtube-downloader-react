var alt = require('../alt');
var api = require('../utils/Api');

function DownloadActions() {};

DownloadActions.prototype.download = function(d) {
  api.download(d);
  this.dispatch(d);
}

DownloadActions.prototype.updateDownload = function(statusData) {
  this.dispatch(statusData);
}

module.exports = da = alt.createActions(DownloadActions);

// Register updateDownload action callback in Api
api.addStatusUpdateListener(da.updateDownload)
