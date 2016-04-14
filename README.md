# rocket-deploy
An npm module to quickly provisioning and deployment of Windows Azure (plus more soon!) websites for prototyping and fast client demos

# requisites
- azure-cli installed ``npm i azure-cli -g``
- Authentication ``azure login`` with an account with permissions to create new websites
- Global deployment credentials configured (https://blogs.msdn.microsoft.com/kaushal/2013/05/29/windows-azure-web-sites-reset-your-deployment-credentials-vs-reset-your-publish-profile-credentials)

# getting started
Just run ``npm i -g rocket-deploy``

Then `rocket-deploy init` to be guided through

# commands

``rocket-deploy i, --init`` Run this once to set everything up<br/>
``rocket-deploy d, --deploy`` This runs the FTP deployment<br/>
``rocket-deploy p, --provision`` Run this once to seperately create your azure website
