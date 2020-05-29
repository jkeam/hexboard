'use strict';

var Rx = require('rx')
  , fs = require('fs')
  , request = require('request')
  ;

var tag = 'SKETCH';

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var filenameList = Rx.Observable.fromNodeCallback(fs.readdir)('test/sketches/');

var postRandomImage = function(hostname) {
  filenameList.map(function(filenames) {
    const index = getRandomInt(0, filenames.length);
    const filename = filenames[index];
    const readStream = fs.createReadStream('test/sketches/' + filename);
    readStream.setEncoding('base64');
    const ts = new Date().getTime();
    const url = encodeURI('http://' + hostname + '/api/sketch/0?name=Name_'+ ts +'&cuid=cuid_' + ts +'&submission_id=' + ts);
    // var url = 'http://sketch.demo.apps.summit3.paas.ninja/demo/sketchpod-1-otzf5' + '/doodle' + '?username=John%20Doe&cuid=test&submission=123';
    // var url = 'http://openshiftproxy-bleathemredhat.rhcloud.com/demo/sketchpod-1-otzf5' + '/doodle' + '?username=John%20Doe&cuid=test&submission=123';
    // var url = 'http://1k.jbosskeynote.com/api/sketch/' + id + '?name=John%20Doe&cuid=test&submission_id=123';
    // var url = 'http://ec2-52-7-153-116.compute-1.amazonaws.com/api/sketch/' + id + '?name=John%20Doe&cuid=test&submission_id=123';
    console.log(tag, 'Posting to: ', url)
    var req = request.post(url, function (err, res, body) {
      if (err) {
        throw new Error(err);
      }
      console.log(tag, 'res', res.body);
    });
    readStream.pipe(req);
  })
  .subscribeOnError(function(err) {
    console.log(err);
  });
}

module.exports = {
  postRandomImage: postRandomImage
}
