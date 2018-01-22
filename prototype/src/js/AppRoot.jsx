import React from 'react';
import DeviceOrienter from './DeviceOrienter';

export default class AppRoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showOrienter: true
        };
    }

    render() {
        const orienter = this.state.showOrienter ? <DeviceOrienter /> : null;

        return <div className="app-root">{orienter}</div>;
    }
}
