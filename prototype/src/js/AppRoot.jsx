import React from 'react';
import MapPanel from './MapPanel';
import ZonePanel from './ZonePanel';
import { delay } from './utils';

export default class AppRoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedZone: null,
            currentZone: null,
            hidingZonePanel: false
        };
    }

    handleZoneClick = (zone, event) => {
        this.setState({ selectedZone: zone });
    };

    handleZoneEnter = zone => {
        this.setState({ currentZone: zone });
    };

    handleZoneLeave = () => {
        this.setState({ currentZone: null });
    };

    handleScrimClick = event => {
        if (event.target === event.currentTarget) {
            this.closeZonePanel();
        }
    };

    closeZonePanel = () => {
        this.setState({ hidingZonePanel: true });
        delay(500, () => {
            this.setState({
                selectedZone: null,
                currentZone: null,
                hidingZonePanel: false
            });
        });
    };

    render() {
        const zone =
            (this.state.currentZone && !this.state.currentZone.done) ||
            this.state.selectedZone ||
            null;

        const zonePanel = zone ? (
            <div className="modal-scrim" onClick={this.handleScrimClick}>
                <ZonePanel
                    zone={zone}
                    hide={this.state.hidingZonePanel}
                    closeZonePanel={this.closeZonePanel}
                />
            </div>
        ) : null;

        return (
            <div className="app-root">
                <MapPanel
                    onZoneClick={this.handleZoneClick}
                    onZoneEnter={this.handleZoneEnter}
                    onZoneLeave={this.handleZoneLeave}
                    currentZone={this.state.currentZone}
                    selectedZone={this.state.selectedZone}
                />
                {zonePanel}
            </div>
        );
    }
}
