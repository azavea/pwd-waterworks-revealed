import React from 'react';
import { Map, TileLayer, Circle, GeoJSON } from 'react-leaflet';
import { areas } from './areas.geojson';
import { zone } from './constants';

export default class MapPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: 39.961347,
            lng: -75.154108,
            zoom: 21
        };
        // this.addRooms();
    }

    // addRooms() {
    //     const geojson = GeoJSON(areas, {});
    // }

    handleZoneClick = (zone, event) => {
        this.props.onZoneClick(zone);
    };

    render() {
        const mapPosition = [this.state.lat, this.state.lng];

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
                <Circle
                    center={[zone.lat, zone.lng]}
                    color=""
                    fillColor="gold"
                    fillOpacity={0.7}
                    radius={zone.radius}
                    onClick={e => this.handleZoneClick(zone, e)}
                />
            </Map>
        );
    }
}
