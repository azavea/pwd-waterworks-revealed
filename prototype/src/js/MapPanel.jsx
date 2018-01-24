import React from 'react';
import { Map, TileLayer, Circle, GeoJSON } from 'react-leaflet';
import { areas } from './areas';
import { zones } from './zones';

export default class MapPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: 39.96133,
            lng: -75.15416,
            zoom: 20
        };
    }

    generateZones() {
        return zones.map(zone => (
            <Circle
                key={zone.name}
                center={[zone.lat, zone.lng]}
                color=""
                fillColor="gold"
                fillOpacity={0.7}
                radius={zone.radius || 3}
                onClick={e => this.handleZoneClick(zone, e)}
            />
        ));
    }

    handleZoneClick = (zone, event) => {
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
        const mapPosition = [this.state.lat, this.state.lng];

        const zoneFeatures = this.generateZones();

        return (
            <Map
                className="the-map"
                center={mapPosition}
                zoom={this.state.zoom}
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
            </Map>
        );
    }
}
