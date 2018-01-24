import React from 'react';
import DeviceOrienter from './DeviceOrienter';
import ZoneTour from './ZoneTour';
const classNames = require('classnames');

export default class ZonePanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            oriented: false
        };
    }

    render() {
        const content = this.state.oriented ? (
            <ZoneTour zone={this.props.zone} />
        ) : (
            <DeviceOrienter zone={this.props.zone} />
        );

        const zonePanelClassName = classNames('zone-panel', {
            '-orienter': !this.state.oriented,
            '-tour': this.state.oriented,
            '-hide': this.props.hide
        });

        return (
            <div className={zonePanelClassName}>
                {content}
                <h1 className="heading">{this.props.zone.name}</h1>
                <p className="desc">{this.props.zone.desc}</p>
            </div>
        );
    }
}
