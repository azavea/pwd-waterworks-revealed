import React from 'react';
import DeviceOrienter from './DeviceOrienter';
import ZoneTour from './ZoneTour';
const classNames = require('classnames');

export default class ZonePanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            oriented: false,
            hide: false
        };
    }

    handleOrientationComplete = () => {
        this.setState({ oriented: true });
    };

    handleTourComplete = () => {
        this.props.zone.done = true;
        this.setState({ hide: true });
        this.props.closeZonePanel();
    };

    render() {
        const content = this.state.oriented ? (
            <ZoneTour
                zone={this.props.zone}
                onTourComplete={this.handleTourComplete}
            />
        ) : (
            <React.Fragment>
                <DeviceOrienter
                    zone={this.props.zone}
                    onOrientationComplete={this.handleOrientationComplete}
                />
                <h1 className="heading">{this.props.zone.name}</h1>
                <p className="desc">{this.props.zone.desc}</p>
            </React.Fragment>
        );

        const zonePanelClassName = classNames('zone-panel', {
            '-orienter': !this.state.oriented,
            '-tour': this.state.oriented,
            '-hide': this.props.hide || this.state.hide
        });

        return <div className={zonePanelClassName}>{content}</div>;
    }
}
