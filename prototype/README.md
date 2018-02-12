# 2018 Prototype

This is a prototype of a modernized Urban Water Revealed mobile experience.
It is a web app — no Cordova — intended for users' mobile phones rather than
dedicated devices.

It's based on [these wireframes](https://marvelapp.com/2b51hbg/). The initial
splash screens and [portal preview panel](https://marvelapp.com/2b51hbg/screen/37294365)
have not been implemented yet.

The core experience is modeled after the original prototype, but with one critical
functional change. Rather than having users manually align an image with their POV
within each discovery portal, the device compass and accelerometers are used to
guide the user to the correct orientation.

This prototype is best seen as an empirical investigation of the technical and
experiential viability of that functional change, and of the overall design.

As of 2/12/18, that viability could be assessed as follows:

### Device orientation
Compass accuracy varies wildly across platforms and devices. It remains unclear
if we can reliably orient every user to the correct bearing. Further testing
in the field is required.

### Geolocation
Even with `enableHighAccuracy` enabled, HTML5 geolocation accuracy is all over
the map. To address this, the prototype ignores geolocation events beyond an
empirically determined accuracy threshold, but this means the user's location is
updated less frequently than would be needed to reliably and quickly detect
entrance into a discovery portal.

Another issue with geolocation is that HTML5 geolocation gets turned off when
the browser is backgrounded. Users will be frequently pocketing their phones
during their visit, so we'll need to figure out how to make the app robust to this.

## Installation and Development
`yarn install` to install dependencies.

`yarn start-local` will spin up the prototype at [http://localhost:1234](http://localhost:1234).

Because HTML5 geolocation requires `https`, you won't be able to access it
remotely. But you can load it in your local browser, and Parcel will use HMR
to update the running prototype as you edit files.

### On-device testing
`yarn start` will spin it up with `https` turned on and HMR turned off (due to
a Parcel bug where the HMR server won't run over a secure socket).

Point your mobile device on the local network to `https://<ip address>:1234`. The SSL
certificate is self-signed, so you'll need to convince your browser to allow
the connection.

If you want to test out in the wild, use [ngrok](https://ngrok.com/) to establish
a secure public tunnel to localhost: `ngrok tcp 1234`

## Worlds
There are currently 3 "worlds" available in the prototype:
- Fairmount Water Works
- Franklin Square (a relatively open space not far from the office)
- The Azavea office

Comment/uncomment lines `8–10` in `/src/js/MapPanel.jsx` to choose your world.

The discovery portals in the FWW world are taken from the original prototype and
contain the correct compass bearings for orienting the device. The other worlds
contain a small set of arbitrary discovery portals.
