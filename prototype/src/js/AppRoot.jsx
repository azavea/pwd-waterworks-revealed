import React from 'react';
import MapPanel from './MapPanel';
import ZonePanel from './ZonePanel';
import { delay } from './utils';

export default class AppRoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedZone: null,
            hidingZonePanel: false
        };
    }

    handleZoneClick = (zone, event) => {
        this.setState({ selectedZone: zone });
    };

    handleScrimClick = event => {
        if (event.target === event.currentTarget) {
            this.closeZonePanel();
        }
    };

    closeZonePanel = () => {
        this.setState({ hidingZonePanel: true });
        delay(500, () => {
            this.setState({ selectedZone: null });
            this.setState({ hidingZonePanel: false });
        });
    };

    render() {
        const zonePanel = this.state.selectedZone ? (
            <div className="modal-scrim" onClick={this.handleScrimClick}>
                <ZonePanel
                    zone={this.state.selectedZone}
                    hide={this.state.hidingZonePanel}
                    closeZonePanel={this.closeZonePanel}
                />
            </div>
        ) : null;

        return (
            <div className="app-root">
                <MapPanel onZoneClick={this.handleZoneClick} />
                {zonePanel}
            </div>
        );
    }
}
