var pathutils = require('path');
var download = require('./youtube-dl.js');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var _ = require('lodash');

var config = require('./config')[process.env.NODE_ENV];
var download_path = require('./configuration.json')['download_path'];
var CurrentDownloads = require('./CurrentDownloads');

// Serve static
app.use(express.static(config.public_folder));

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
