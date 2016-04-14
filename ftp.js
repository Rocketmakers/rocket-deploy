var ftpClient = require('ftp-client');
var fs = require('fs');
var jsonfile = require('jsonfile');

exports.runFtp = function(settings) {
  var client = new ftpClient(settings.ftp);
  client.connect(function(params) {
    console.log("Connected to " + settings.ftp.host + ", ready to upload!");
    client.upload([(settings.client.basePath + '/**')], settings.client.serverPath, {
      baseDir: settings.client.basePath,
      overwrite: settings.client.overwrite
    }, function(result) {
      console.log(result);
    });
  });
}
