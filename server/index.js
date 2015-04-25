var path = require('path');
var express = require('express');
var app = express();

// Serve static
app.use(express.static(path.join(__dirname, '../.tmp')));
app.use(express.static(path.join(__dirname, '../app')));


// Listening
var server = app.listen(3001, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
