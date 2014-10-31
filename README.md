pwd-waterworks-revealed
=======================

Prototype app to guide users on "quests" which reveal interesting things about the Fairmount Water Works (and perhaps ultimately other sites in Philly).

## Developer Setup

PhoneGap Build is a cloud service which builds mobile apps based on HTML/CSS/JS. Here's how to set everything up to use it for PWD Water Works Revealed.

##### Clone the repo
```shell
git clone git@github.com:azavea/pwd-waterworks-revealed
```

##### Set up grunt
```shell
cd pwd-waterworks-revealed/build

# this has temporary values you will overwrite later
cp template_local.json local.json

npm install -g grunt-cli
npm install
grunt
```
`grunt` may fail after creating the zip file; we'll fix this below.

##### Set up PhoneGap Build
1. Create account at https://build.phonegap.com
1. Use your Azavea email address
1. Click the "free" option (1 private app)
1. Click "Upload a .zip file", and choose the file you created above
1. Name your app "Water Works Revealed"
1. Click "Enable debugging" and "Enable hydration"
1. Click "Ready to build" (it may fail)
1. Click the big blue "Water Works Revealed" to go to the detailed app view
1. Write down the "App Id" (on the left in the table)
1. Create a key
    1. Click the "No key selected" dropdown next to "iOS" and choose "add a key..."
    1. Title "Civic Apps iOS"
    1. For "certificate (p12) file" upload `pwd-waterworks-revealed/build/cert/ios_dist.p12`
    1. For "provisioning profile" upload `pwd-waterworks-revealed/build/cert/Civic_Apps.mobileprovision`
    1. Click "submit key" (build may fail)
    1. Click the yellow "lock" icon, and enter password "apple"
1. Click "Rebuild" in the "iOS" box

##### Install app on target device
* With your device, scan the QR code on your PhoneGap Build "Water Works Revealed" page
* Click "Install"

##### Set up `local.json`
```shell
cd pwd-waterworks-revealed/build
curl -u your-email-address@azavea.com -X POST -d "" https://build.phonegap.com/token
```
Edit `local.json` with the App ID you wrote down earlier, and the token returned by `curl`

##### Try a build cycle
Modify `src/index.html`, and then build:
```shell
grunt
```
On your device, switch away from the app and back to it.
