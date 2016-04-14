#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var path = require('path');
var init = require('./init.js');
var ftp = require('./ftp.js');
var azure = require('./azure.js');
var jsonfile = require('jsonfile');

var configPath = path.join(process.cwd(), 'config.json');

program
  .version('0.0.1')
  .option('-i, --init', 'Initialise site')
  .option('-d, --deploy', 'Deploy via FTP')
  .option('-p, --provision', 'Create a site in azure')
  .parse(process.argv);

function loadConfig(cb) {
  jsonfile.readFile(configPath, function(err, obj) {
    cb(obj);
  });
}

function checkForConfig(cb) {
  fs.access(configPath, fs.F_OK, function(err) {
    if (!err) {
      cb(true);
    } else {
      cb(false);
    }
  });
}


if (program.init) {
  init.runInit();
}
if (program.deploy) {
  checkForConfig((gotConfig) => {
    if (gotConfig) {
      loadConfig((config) => {
        ftp.runFtp(config);
      })
    }
    else {
      console.log("You must run init before you can run this command");
    }
  })
}

if (program.provision) {
  checkForConfig((gotConfig) => {
    if (gotConfig) {
      loadConfig((config) => {
        azure.createAzureWebsite(config);
      });
    }
    else {
      console.log("You must run init before you can run this command");
    }
  })
}