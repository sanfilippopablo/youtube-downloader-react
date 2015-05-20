var pathutils = require('path');
var download = require('./youtube-dl.js');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// Serve static
app.use(express.static(pathutils.join(__dirname, '../.tmp')));

var download_path = '/home/pablo/Downloads/'

// IO
io.on('connection', function(socket){
  socket.on('download', function(data){

    // Generate download path
    var path = pathutils.join(download_path, data.author, data.title) + '.%(ext)s';

    // Download
    var downloading = download(data['URL'], path);

    downloading.on('data', function(data) {
        socket.emit('statusUpdate', data);
    })

  })
})

// Listening
server.listen(3001, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
