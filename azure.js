var exec = require('child_process').exec;
var inquirer = require('inquirer');
var ftp = require('./ftp');


exports.createAzureWebsite = function(settings) {
  exec('azure site create --location \"' + settings.azure.location + '\" ' + settings.site_name, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Azure site created. You can access it at \'' + settings.azure.siteUrl);
    inquirer.prompt({ type: 'confirm', name: 'confirm', default: true, message: 'Would you like me to do an FTP deployment now?' }).then(r => {
      if (r.confirm) {
        ftp.runFtp(settings);
      }
      else {
        console.log('No problem. You can do this at any time by typing \'rocket-deploy deploy\'');
        return;
      }
    });
  });
}
