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

var da = alt.createActions(DownloadActions);
module.exports = da;

// Register updateDownload action callback in Api
api.addStatusUpdateListener(da.updateDownload)
