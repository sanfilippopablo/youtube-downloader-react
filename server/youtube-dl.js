var EventEmitter = require('events').EventEmitter;
var spawn = require('child_process').spawn;

var download = function(url, path) {
  console.log('Downloading')
  var downloadRegex = /\[download\]\s{1,3}(\d{1,3}\.\d)% of .* at (.*) ETA (\d{2}:\d{2})/;
  var eventEmitter = new EventEmitter();
  command = 'youtube-dl';
  args = ['--extract-audio', '--audio-format', 'mp3', '-o', path, url];
  var proc = spawn(command, args);
  proc.stdout.on('data', function(data) {
    var response = data.toString().trim();

    if (response.indexOf('[youtube]') != -1) {
      // Preprocessing
      var data = {
        'url': url,
        'status': 'preprocessing',
        'details': response.slice(10)
      }
      eventEmitter.emit('data', data)
    } else if (downloadRegex.test(response)) {
      // Downloading
      var info = downloadRegex.exec(response);
      var data = {
        'url': url,
        'status': 'downloading',
        'details': {
          'percent': info[1],
          'speed': info[2],
          'ETA': info[3]
        }
      }
      eventEmitter.emit('data', data);
    } else if (response.indexOf('[ffmpeg]') != -1) {
      //Postprocessing
      var data = {
        'url': url,
        'status': 'postprocessing',
        'details': 'Converting to MP3'
      }
      eventEmitter.emit('data', data);
    }

  })

  proc.on('close', function(){
    var data = {
      'url': url,
      'status': 'complete'
    }
    eventEmitter.emit('data', data);
  })

  proc.stderr.on('data', function(data){
    console.log(data.toString())
  })

  return eventEmitter;
}

module.exports = download;
