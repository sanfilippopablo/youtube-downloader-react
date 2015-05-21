var EventEmitter = require('events').EventEmitter;
var spawn = require('child_process').spawn;

var download = function(url, path) {
  console.log('Downloading')
  var downloadRegex = /\[download\]\s{1,3}(\d{1,3}\.\d)% of .* at (.*) ETA (\d{2}:\d{2})/;
  var eventEmitter = new EventEmitter();
  var error = false;
  command = 'youtube-dl';
  args = ['--extract-audio', '--audio-format', 'mp3', '-o', path, url];
  var proc = spawn(command, args);
  proc.stdout.on('data', function(data) {
    error = false;
    var response = data.toString().trim();

    if (response.indexOf('[youtube]') != -1) {
      // Preprocessing
      var data = {
        'URL': url,
        'status': 'preprocessing',
        'details': {
          'percent': 0,
          'description': response.slice(10)
        }
      }
      eventEmitter.emit('data', data)
    } else if (downloadRegex.test(response)) {
      // Downloading
      var info = downloadRegex.exec(response);
      var data = {
        'URL': url,
        'status': 'downloading',
        'details': {
          'description': 'Downloading video',
          'percent': Number(info[1]),
          'speed': info[2],
          'ETA': info[3]
        }
      }
      eventEmitter.emit('data', data);
    } else if (response.indexOf('[ffmpeg]') != -1) {
      //Postprocessing
      var data = {
        'URL': url,
        'status': 'postprocessing',
        'details': {
          'percent': 100,
          'description': 'Converting to MP3'
        }
      }
      eventEmitter.emit('data', data);
    }

  })

  proc.on('close', function(){
    if (!error) {
      var data = {
        'URL': url,
        'status': 'complete',
        'details': {
          'percent': 100,
          'description': 'Complete'
        }
      }
      eventEmitter.emit('data', data);
    }
  })

  proc.stderr.on('data', function(data){
    // Error
    error = true;
    console.log(data.toString());
    var data = {
      'URL': url,
      'status': 'error',
      'details': {
        'percent': 100,
        'description': 'Error'
      }
    };
    eventEmitter.emit('data', data);
  })

  return eventEmitter;
}

module.exports = download;
