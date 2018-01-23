import React from 'react';
import MapPanel from './MapPanel';
import DeviceOrienter from './DeviceOrienter';

export default class AppRoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showOrienter: false
        };
    }

    render() {
        const panel = this.state.showOrienter ? (
            <DeviceOrienter />
        ) : (
            <MapPanel />
        );

        return <div className="app-root">{panel}</div>;
    }
}
