var exec = require('child_process').exec;
var inquirer = require('inquirer');
var ftp = require('./../ftp.js');


function confirm(question) {
  return inquirer.prompt({ type: 'confirm', name: 'confirm', default: true, message: question })
}

exports.createAzureWebsite = function (settings) {
  exec('azure site create --location \"' + settings.azure.location + '\" ' + settings.site_name, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Azure site created. You can access it at \'' + settings.azure.siteUrl);
    askDoFtpDeployment(settings);

    // confirm('Would you like to add basic authentication (Browser username & password popup)').then(r => {

    //   inquirer.prompt([
    //     { name: 'username', message: 'Now enter the name of your site (no spaces please)' },
    //     { name: 'password', message: 'The user name of you Azure deployment user' },
    //   ]).then((authResponse) => {
    //     // MODIFY WEB.CONFIG HERE

    //   });
    // });
  });
}

function askDoFtpDeployment(settings) {
  confirm('Would you like me to do an FTP deployment now?').then(ftpConfirm => {
    if (ftpConfirm.confirm) {
      ftp.runFtp(settings);
    }
    else {
      console.log('No problem. You can do this at any time by typing \'rocket-deploy deploy\'');
      return;
    }
  });
}
