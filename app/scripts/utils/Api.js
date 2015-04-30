var io = require('socket.io-client');
var EventEmitter = require('events').EventEmitter;
var api = new EventEmitter();

api.socket = io();

api.socket.on('connect', function(){

})

api.socket.on('disconnect', function(){

});

// data = {author: '', title: '', url: ''}
api.download = function(data) {
  this.socket.emit('download', data);
}

api.addStatusUpdateListener = function(callback) {
  this.socket.on('statusUpdate', callback);
}

module.exports = api;
