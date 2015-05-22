var _ = require('lodash');

module.exports = {
  _downloads: [],

  add: function(download) {
    this._downloads.push(download);
  },

  all: function() {
    return this._downloads;
  },

  remove: function(objToRemove) {
    _.remove(this._downloads, function(obj){
      return obj.URL === objToRemove.URL;
    });
  },

  update: function(newObj) {
    var d = _.find(this._downloads, function(obj){
      return obj.URL === newObj.URL;
    });
    _.merge(d, newObj);
  }
}
