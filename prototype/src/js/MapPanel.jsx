import React from 'react';
import { Map, TileLayer, Circle, CircleMarker, GeoJSON } from 'react-leaflet';
import { point } from '@turf/helpers';
import circle from '@turf/circle';
import buffer from '@turf/buffer';
import booleanWithin from '@turf/boolean-within';
import { areas } from './areas';
import { zones } from './zones';
import {
    initialMapCenter,
    initialZoom,
    defaultZoneRadius,
    zoneBuffer
} from './constants';
require('leaflet-path-drag');

export default class MapPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: null,
            lng: null,
            acc: null,
            detectLocation: true,
            zones: null
        };
    }

    componentDidMount() {
        this.initZones();
        this.initGeolocation();
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.geolocationId);
    }

    initZones() {
        this.setState({
            zones: zones.map(zone => {
                return Object.assign(zone, {
                    polygon: circle(
                        [zone.lng, zone.lat],
                        zone.radius || defaultZoneRadius * 0.001,
                        { units: 'kilometers' }
                    ),
                    done: false
                });
            })
        });
    }

    initGeolocation() {
        if ('geolocation' in navigator) {
            this.geolocationId = navigator.geolocation.watchPosition(
                this.onLocationChange,
                this.onLocationError,
                { enableHighAccuracy: true }
            );
        } else {
            console.log('Geolocation not supported');
            window.alert('Geolocation not supported');
        }
    }

    getCalibratedLatitude(lat) {
        // return lat - 0.0004;
        return lat;
    }

    getCalibratedLongitude(lng) {
        return lng;
    }

    getCurrentZone() {
        return this.state.zones.find(zone =>
            booleanWithin(
                point([this.state.lng, this.state.lat]),
                buffer(zone.polygon, zoneBuffer, { units: 'kilometers' })
            )
        );
    }

    onLocationChange = position => {
        if (!this.state.detectLocation) {
            return;
        }

        this.setLocation(
            this.getCalibratedLatitude(position.coords.latitude),
            this.getCalibratedLongitude(position.coords.longitude),
            position.coords.accuracy
        );
    };

    setLocation(lat, lng, acc) {
        this.setState({
            lat: lat,
            lng: lng,
            acc: acc
        });
        const currentZone = this.getCurrentZone();
        if (!currentZone && this.props.currentZone) {
            this.props.onZoneLeave();
        } else if (currentZone && currentZone != this.props.currentZone) {
            this.props.onZoneEnter(currentZone);
        }
    }

    onLocationError = error => {
        console.log('Geolocation error: ' + error.code + ': ' + error.message);
        window.alert('Geolocation error: ' + error.code + ': ' + error.message);
    };

    onLocationMarkerClick = event => {
        if (!this.state.detectLocation) {
            this.setState({ detectLocation: true });
        }
    };

    onLocationMarkerDragStart = event => {
        this.setState({ detectLocation: false });
    };

    onLocationMarkerDragEnd = event => {
        const latlng = this.locationMarker.leafletElement.getLatLng();
        this.setLocation(latlng.lat, latlng.lng);
    };

    getZoneColor(zone) {
        if (zone === this.props.selectedZone) {
            return '#B81190';
        } else if (zone.done) {
            return '#999';
        } else if (zone === this.props.currentZone) {
            return '#3F88F0';
        } else {
            return 'gold';
        }
    }

    generateZoneFeatures() {
        return zones.map(zone => (
            <Circle
                key={zone.name}
                center={[zone.lat, zone.lng]}
                weight={0}
                fillColor={this.getZoneColor(zone)}
                fillOpacity={0.6}
                radius={zone.radius || defaultZoneRadius}
                onClick={e => this.onZoneClick(zone, e)}
            />
        ));
    }

    generateZonePolygons() {
        return zones.map(zone =>
            circle(
                [zone.lng, zone.lat],
                (zone.radius || defaultZoneRadius) * 0.001,
                { units: 'kilometers' }
            )
        );
    }

    onZoneClick = (zone, event) => {
        this.props.onZoneClick(zone);
    };

    getAreaColor(areaType) {
        // colors from http://www.colourlovers.com/palette/1473/Ocean_Five
        // actually from http://www.colourlovers.com/palette/932683/Compatible
        let color;
        switch (areaType) {
            case 'Meeting':
                color = '#8EBE94';
                break;
            case 'Phone':
                color = '#4E395D';
                break;
            case 'Lounge':
                color = '#DC5B3E';
                break;
            case 'Relax':
                color = '#827085';
                break;
            case 'Conference':
                color = '#CCFC8E';
                break;
            default:
                color = '#CCC';
                break;
        }
        return color;
    }

    styleArea = (feature, layer) => {
        return {
            fillColor: this.getAreaColor(feature.properties.type),
            weight: 0,
            opacity: 1.0,
            fillOpacity: 0.6
        };
    };

    configArea = (feature, layer) => {
        return {
            fillColor: this.getAreaColor(feature.properties.type),
            weight: 0,
            opacity: 1.0,
            fillOpacity: 0.6
        };
    };

    render() {
        const geolocationAccuracyCircle =
            this.state.detectLocation && this.state.lat && this.state.lng ? (
                <Circle
                    center={[this.state.lat, this.state.lng]}
                    weight={0}
                    fillColor="#3F88F0"
                    fillOpacity={0.1}
                    radius={this.state.acc || 0}
                    interactive={false}
                />
            ) : null;
        const geolocationMarker =
            this.state.lat && this.state.lng ? (
                <React.Fragment>
                    {geolocationAccuracyCircle}
                    <CircleMarker
                        center={[this.state.lat, this.state.lng]}
                        color="white"
                        weight={8}
                        fillColor={
                            this.state.detectLocation ? '#3F88F0' : '#B81190'
                        }
                        fillOpacity={0.9}
                        radius={18}
                        interactive={false}
                        draggable={true}
                        onClick={this.onLocationMarkerClick}
                        onDragstart={this.onLocationMarkerDragStart}
                        onDragend={this.onLocationMarkerDragEnd}
                        ref={el => {
                            this.locationMarker = el;
                        }}
                    />
                </React.Fragment>
            ) : null;

        const zoneFeatures = this.generateZoneFeatures();

        return (
            <Map
                className="the-map"
                center={initialMapCenter}
                zoom={initialZoom}
                zoomControl={false}
            >
                <TileLayer
                    url="https://990.azavea.com/floorplan/{z}/{x}/{y}.png"
                    minZoom={20}
                    maxZoom={22}
                />
                <GeoJSON
                    data={areas}
                    style={this.styleArea}
                    onEachFeature={this.configArea}
                />
                {zoneFeatures}
                {geolocationMarker}
            </Map>
        );
    }
}
