import React from 'react';
import { Map, TileLayer, Marker, GeoJSON } from 'react-leaflet';
import { areas } from './areas.geojson';

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

    render() {
        const position = [this.state.lat, this.state.lng];
        return (
            <Map className="the-map" center={position} zoom={this.state.zoom}>
                <TileLayer
                    url="https://990.azavea.com/floorplan/{z}/{x}/{y}.png"
                    minZoom={20}
                    maxZoom={22}
                />
                <Marker position={position} />
            </Map>
        );
    }
}
