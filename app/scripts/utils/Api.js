var io = require('socket.io-client');
var EventEmmiter = require('events').EventEmmiter;
var api = new EventEmmiter();

api.socket = io();

api.socket.on('connect', function(){
  console.log('socket connected');
})

api.socket.on('disconnect', function(){
  console.log('socket disconnected');
});

// data = {author: '', title: '', url: ''}
api.download = function(data) {
  this.socket.emit(data);
}

api.addStatusUpdateListener = function(callback) {
  this.socket.on('statusUpdate', callback);
}

module.exports = api;
