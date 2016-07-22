var fs = require('fs');
var request = require('request');
var exec = require('child_process').exec;
var http = require('http');


var download = function(uri, filename, callback) {
  request.head(uri, function(err) {
    try {
      request(uri).pipe(fs.createWriteStream(`${filename}`)).on('close', callback);
    } catch (e) {
      console.log(`Kabuumm file does not exist ${uri}`);
    }
    if (err) {
      console.log('error', err);
    }
  });
};

var output = 'test.mp4';
var musicUri = 'http://art-list.io/uploads/fdb50ae9e8214ecc83625557a4bb08db.mp3';
var videoUri = 'http://localhost/test.webm';

function process(videoUri, musicUri, output) {
  var date = new Date().getTime();
  var video_file_path =  '/tmp/' + date + '.mp4';
  var music_file_path =  '/tmp/' + date + '.mp3';

  var videoFile = fs.createWriteStream(video_file_path);

  /*
    Do get request for download remote video
  */
  var request = http.get(videoUri, function(response) {

    var stream = response.pipe(videoFile);
    stream.on('finish', function () {
        console.log('Video downloaded');
        download(musicUri, music_file_path, function() { // When download finised
          console.log(`Music downloaded`);
          var cmd = `ffmpeg -i ${video_file_path} -i ${music_file_path} -c:v mpeg4 -b:v 48k ${output}`;
          exec(cmd, function(error, stdout, stderr) {
            if (error) {
              console.log(error);
            } else {
              console.log('Process ended.');
            }
          });
        });
    });
  });
}

process(videoUri, musicUri, output);
