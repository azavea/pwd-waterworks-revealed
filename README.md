pwd-waterworks-revealed
=======================

Prototype app to guide users on "quests" which reveal interesting things about the Fairmount Water Works (and perhaps ultimately other sites in Philly).

## Developer Setup

This application is build using PhoneGap/Cordova which allows for a native application on Android and iOS to be build using HTML/CSS/JS. Here's how to set everything up to use it for Water Works Revealed.

##### Clone the repo
```shell
git clone git@github.com:azavea/pwd-waterworks-revealed
```

##### Set up grunt
```shell
npm install -g grunt-cli phonegap
npm install
grunt
```
You may need to run the first install command as a super user (sudo).

##### Try a build cycle
Modify `src/index.html`, and then build:
```shell
grunt
```
##### Using the PhoneGap Developer App

If you want to more quickly view changes to the app during development, you can skip the publish and build process by using the PhoneGap Developer App. Instructions to install the app on your machine and development device can be found at [http://app.phonegap.com/](http://app.phonegap.com/) and are reproduced here:

1. Install the app on your development machine: `npm install phonegap -g`.
2. Search for and download the "PhoneGap Developer App" from the app store on your device.
3. Build the app: `grunt app`.
4. Start the PhoneGap server from the project root: `phonegap serve`.
5. Open the PhoneGap Developer App on your device and input the server address give by the PhoneGap server.

Once you are connected to the application on the device, run `grunt watch` locally. The app will reload on the device anytime grunt catches a change.

##### Update Map Tiles

Map tiles were generated in MapBox Studio (https://www.mapbox.com/mapbox-studio/).
To alter them you will need a running copy of mapbox studio. The current project was created by Daniel (https://github.com/dmcglone/mapbox-studio-pencil.tm2).
Exporting is a complicated process but we created a VM that has all the tools needed to create a raster-based mbtiles file. The VM can be found on the fileshare (smb://fileshare/projects/PWD_StormwaterBilling/data/mapboxstudio.ova). You will need a mapbox studio key. There are instuctions in text files on the desktop. The username and password are "azavea". This user has administrative rights.
Once you have created the mbtiles file, move off the VM and use mbutil to extract the tiles (https://github.com/mapbox/mbutil). Then drop them in ```/src/tiles```.

## Native Builds

Recent versions have failed to successfully build using the phonegap platform
and tooling. Creating native applications has proven successful. In order to do
this you will need the IDE for the platform you want to build (either Android
Studio or XCode). To start, wipe out any files you may have that are lying
around from older builds:

```phonegap platform remove ios```

or

```phonegap platform remove android```

then,

```phonegap build [ios, android]```

This prepares the build directories in `./plaforms/[ios, android]`. If properly
setup it will also actually compile the application. In either case, you can
open the appropriate project file in the IDE for that platform and build or test
in a simulator.
