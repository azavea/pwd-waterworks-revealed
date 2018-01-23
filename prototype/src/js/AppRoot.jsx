import React from 'react';
import MapPanel from './MapPanel';
import ZonePanel from './ZonePanel';

export default class AppRoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedZone: null
        };
    }

    handleZoneClick = (zone, event) => {
        this.setState({ selectedZone: zone });
    };

    render() {
        const zonePanel = this.state.selectedZone ? (
            <ZonePanel zone={this.state.selectedZone} />
        ) : null;

        return (
            <div className="app-root">
                <MapPanel onZoneClick={this.handleZoneClick} />
                {zonePanel}
            </div>
        );
    }
}
