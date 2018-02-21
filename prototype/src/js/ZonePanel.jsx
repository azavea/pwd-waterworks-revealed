import React from 'react';
import DeviceOrienter from './DeviceOrienter';
import ZoneTour from './ZoneTour';
import { CSSTransition } from 'react-transition-group';
const classNames = require('classnames');

export default class ZonePanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            oriented: false
        };
    }

    onOrientationComplete = () => {
        this.setState({ oriented: true });
    };

    onTourComplete = () => {
        this.props.zone.done = true;
        this.props.closeZonePanel();
    };

    render() {
        const orienter = (
            <CSSTransition
                in={!this.state.oriented}
                classNames=""
                timeout={{ enter: 300, exit: 0 }}
                mountOnEnter={true}
                unmountOnExit={true}
            >
                <DeviceOrienter
                    zone={this.props.zone}
                    onOrientationComplete={this.onOrientationComplete}
                />
            </CSSTransition>
        );

        const tour = (
            <CSSTransition
                in={this.state.oriented}
                classNames=""
                timeout={{ enter: 300, exit: 0 }}
                mountOnEnter={true}
                unmountOnExit={true}
            >
                <ZoneTour
                    zone={this.props.zone}
                    onTourComplete={this.onTourComplete}
                />
            </CSSTransition>
        );

        const about = this.state.oriented ? null : (
            <React.Fragment>
                <h1 className="heading">{this.props.zone.name}</h1>
                <p className="desc">{this.props.zone.desc}</p>
            </React.Fragment>
        );

        const zonePanelClassName = classNames('zone-panel', {
            '-orienter': !this.state.oriented,
            '-tour': this.state.oriented
        });

        return (
            <div className={zonePanelClassName}>
                {orienter}
                {tour}
                {about}
            </div>
        );
    }
}
