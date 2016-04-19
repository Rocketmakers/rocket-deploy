var figlet = require('figlet');
var inquirer = require('inquirer');
var fs = require('fs');
var jsonfile = require('jsonfile');
var util = require('util');
var azure = require('./azure/azure');
var path = require('path');
var copy = require('copy-files');

var wd = process.cwd();
var thisDir = __dirname;

var configPath = path.join(wd, 'config.json');

function loadConfig(cb) {
  jsonfile.readFile(configPath, function(err, obj) {
    cb(obj);
  });
}

var hostingQuestion = { name: 'hostingChoice', type: 'list', message: 'Where will your site be hosted?', default: 'Windows Azure', choices: ['Windows Azure', 'Amazon S3 (UNSUPPORTED)', 'Stamplay (UNSUPPORTED)', 'Firebase (UNSUPPORTED)'] };

exports.runInit = function() {
  copyFile(path.join(thisDir, 'config.json'), configPath).then(() => {
    loadConfig((config) => {
      figlet('Rocket Deploy', function(err, data) {
        console.log('\r\n');
        console.log(data);
        console.log('\r\n');
        inquirer.prompt(hostingQuestion).then((r) => {
          if (r.hostingChoice === "Windows Azure") {
            console.log("\r\nCool, lets go with Windows Azure.\r\n");
            inquirer.prompt({ type: 'confirm',
            name: 'confirm',
            default: true,
            message: 'You\'ll need to have the following: \r\n - azure-cli installed (npm i azure-cli -g)\n - Authentication (azure login) with an account with permissions to create new websites.\n - Global deployment credentials configured (https://blogs.msdn.microsoft.com/kaushal/2013/05/29/windows-azure-web-sites-reset-your-deployment-credentials-vs-reset-your-publish-profile-credentials/) \r\n Have you done this?' }).then(confirmResponse => {
              if (confirmResponse.confirm) {
                updateSettings(config);
              }else{
                return;
              }
            });
          }
          else {
            console.log("Sorry, this provider is currently unsupported")
            return;
          }
        })
      });
    });
  })
}

function copyFile(source, target) {
  return new Promise(function(resolve, reject) {
    var rd = fs.createReadStream(source);
    rd.on('error', reject);
    var wr = fs.createWriteStream(target);
    wr.on('error', reject);
    wr.on('finish', resolve);
    rd.pipe(wr);
  });
}

function updateSettings(config) {
  console.log('\n');
  inquirer.prompt([
    { name: 'siteName', message: 'Now enter the name of your site (no spaces please)' },
    { name: 'azureUser', message: 'The user name of you Azure deployment user' },
    { name: 'azureLocation', message: 'The location of your Azure server', default: "West Europe" },
    ]).then((r) => {
    const siteName = r.siteName;
    inquirer.prompt([
      { name: 'ftpHost', message: 'The FTP url', default: "waws-prod-am2-003.ftp.azurewebsites.windows.net" },
      { name: 'ftpPort', message: 'The FTP port', default: 21 },
      { name: 'ftpUser', message: 'The FTP username', default: siteName + "\\" + r.azureUser },
      { name: 'ftpPassword', message: 'The FTP password' }
    ]).then((r2) => {
      settings = config;
      settings.azure.user = r.azureUser;
      settings.azure.location = r.azureLocation;
      settings.azure.siteUrl = siteName + '.azurewebsites.net';
      settings.site_name = siteName;
      settings.ftp.host = r2.ftpHost;
      settings.ftp.port = r2.ftpPort;
      settings.ftp.user = r2.ftpUser;
      settings.ftp.password = r2.ftpPassword;
      jsonfile.writeFile(configPath, settings, { spaces: 4 }, function() {
        inquirer.prompt({ type: 'confirm', name: 'confirm', default: true, message: 'Do you want to provision the azure website now?' }).then(r => {
          if (r.confirm) {
            azure.createAzureWebsite(settings);
          }
          else {
            return;
          }
        })
      });
    })
  })
}