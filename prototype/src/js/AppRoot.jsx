import React from 'react';
import MapPanel from './MapPanel';
import ZonePanel from './ZonePanel';
import { CSSTransition } from 'react-transition-group';
import { geolocationAccuracyThreshold } from './constants';

export default class AppRoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedZone: null,
            currentZone: null,
            showZonePanel: false,
            geolocationAccuracyThreshold: geolocationAccuracyThreshold
        };
    }

    onZoneClick = (zone, event) => {
        this.setState({
            selectedZone: zone,
            showZonePanel: true
        });
    };

    onZoneEnter = zone => {
        this.setState({
            currentZone: zone,
            showZonePanel: true
        });
    };

    onZoneLeave = () => {
        // This assumes the zonePanel is open and showing the currentZone.
        // Upon leaving, change make the currentZone the selectedZone
        // so that the panel doesn't automatically close.
        // Functionally equivalent to leaving the zone then tapping it.
        const current = this.state.currentZone;
        this.setState({
            currentZone: null,
            selectedZone: current
        });
    };

    onScrimClick = event => {
        if (event.target === event.currentTarget) {
            this.closeZonePanel();
        }
    };

    onZonePanelClosed = () => {
        this.setState({
            selectedZone: null,
            currentZone: null
        });
    };

    closeZonePanel = () => {
        this.setState({ showZonePanel: false });
    };

    onSliderChange = () => {
        this.setState({ geolocationAccuracyThreshold: this.sliderEl.value });
    };

    onSliderValueClick = () => {
        this.setState({
            geolocationAccuracyThreshold: geolocationAccuracyThreshold
        });
    };

    render() {
        let zone;
        if (this.state.selectedZone) {
            zone = this.state.selectedZone;
        } else if (this.state.currentZone && !this.state.currentZone.done) {
            zone = this.state.currentZone;
        } else {
            zone = null;
        }

        const mapPanel = (
            <MapPanel
                onZoneClick={this.onZoneClick}
                onZoneEnter={this.onZoneEnter}
                onZoneLeave={this.onZoneLeave}
                currentZone={this.state.currentZone}
                selectedZone={
                    this.state.showZonePanel && this.state.selectedZone
                }
                geolocationAccuracyThreshold={
                    this.state.geolocationAccuracyThreshold
                }
            />
        );

        const slider = this.props.dev ? (
            <div className="accuracy-slider">
                <output className="output" onClick={this.onSliderValueClick}>
                    {this.state.geolocationAccuracyThreshold}m
                </output>
                <input
                    className="slider"
                    type="range"
                    value={this.state.geolocationAccuracyThreshold}
                    min="0"
                    max="80"
                    onChange={this.onSliderChange}
                    ref={el => {
                        this.sliderEl = el;
                    }}
                />
            </div>
        ) : null;

        const zonePanel = (
            <CSSTransition
                in={this.state.showZonePanel}
                classNames=""
                timeout={300}
                mountOnEnter={true}
                unmountOnExit={true}
                onExited={this.onZonePanelClosed}
            >
                <div className="modal-scrim" onClick={this.onScrimClick}>
                    <ZonePanel
                        zone={zone}
                        closeZonePanel={this.closeZonePanel}
                    />
                </div>
            </CSSTransition>
        );

        return (
            <div className="app-root">
                {mapPanel}
                {slider}
                {zonePanel}
            </div>
        );
    }
}
