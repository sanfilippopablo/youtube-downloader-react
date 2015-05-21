var pathutils = require('path');
var download = require('./youtube-dl.js');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var _ = require('lodash');

var CurrentDownloads = {
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

// Serve static
app.use(express.static(pathutils.join(__dirname, '../.tmp')));

var download_path = '/home/pablo/Downloads/'

// IO
io.on('connection', function(socket){

  _.each(CurrentDownloads.all(), function(obj){
    io.sockets.emit('statusUpdate', obj);
  });

  socket.on('download', function(data){

    CurrentDownloads.add(data);

    // Generate download path
    var path = pathutils.join(download_path, data.author, data.title) + '.%(ext)s';

    // Download
    var downloading = download(data['URL'], path);

    downloading.on('data', function(data) {

        if (['error', 'complete'].indexOf(data.status) !== -1) {
          CurrentDownloads.remove(data);
        } else {
          CurrentDownloads.update(data);
        };

        io.sockets.emit('statusUpdate', data);
    })

  })
})

// Listening
server.listen(3001, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
