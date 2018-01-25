import React from 'react';
import AlphaOrienter from './AlphaOrienter';
import BetaOrienter from './BetaOrienter';
import {
    delay,
    calculateNormalizedAlphaOffset,
    calculateNormalizedBetaOffset
} from './utils';
const classNames = require('classnames');

export default class DeviceOrienter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            supportedEventName: null,
            betaOrientationComplete: false,
            alpha: NaN,
            beta: NaN
        };
    }

    componentDidMount() {
        this.initOrientationListener();
    }

    componentWillUnmount() {
        this.removeOrientationListener();
    }

    initOrientationListener() {
        let supportedEventName;

        if ('ondeviceorientationabsolute' in window) {
            // Chrome 50+
            supportedEventName = 'deviceorientationabsolute';
        } else if ('ondeviceorientation' in window) {
            // Chrome <50 or iOS
            // For iOS, use event.webkitCompassHeading instead of event.alpha
            // For Chrome < 50, use event.alpha, which *should* always be absolute
            // but check for event.absolute just in case
            supportedEventName = 'deviceorientation';
        }

        if (supportedEventName) {
            this.setState({ supportedEventName: supportedEventName });
            window.addEventListener(
                supportedEventName,
                this.handleDeviceOrientation,
                true
            );
        } else {
            console.log('Device orientation not supported');
        }
    }

    removeOrientationListener() {
        if (this.state.supportedEventName) {
            window.removeEventListener(
                this.state.supportedEventName,
                this.handleDeviceOrientation,
                true
            );
        }
    }

    handleDeviceOrientation = event => {
        let alpha;

        if (event.webkitCompassHeading) {
            // iOS
            alpha = event.webkitCompassHeading;
        } else if (event.absolute) {
            // Chrome, etc
            alpha = event.alpha;
        } else {
            // alpha not absolute
            alpha = NaN;
        }

        this.setState({
            alpha: alpha,
            beta: event.beta
        });
    };

    onAlphaOrientationComplete = () => {
        this.props.onOrientationComplete();
    };

    onBetaOrientationComplete = () => {
        this.setState({ betaOrientationComplete: true });
    };

    isBetaOriented() {
        return calculateNormalizedBetaOffset(this.state.beta) === 0;
    }

    isAlphaOriented() {
        return (
            calculateNormalizedAlphaOffset(
                this.props.zone.bearing,
                this.state.alpha
            ) === 0
        );
    }

    determineOrienter() {
        const { alpha, beta } = this.state;

        const alphaOrienter = (
            <AlphaOrienter
                alpha={alpha}
                target={this.props.zone.bearing}
                onOrientationComplete={this.onAlphaOrientationComplete}
            />
        );

        const betaOrienter = (
            <BetaOrienter
                beta={beta}
                onOrientationComplete={this.onBetaOrientationComplete}
            />
        );

        if (!this.state.betaOrientationComplete) {
            if (this.isBetaOriented()) {
                this.setState({ betaOrientationComplete: true });
                return alphaOrienter;
            } else {
                return betaOrienter;
            }
        } else {
            if (this.isAlphaOriented()) {
                this.onAlphaOrientationComplete();
                return null;
            } else {
                return alphaOrienter;
            }
        }
    }

    render() {
        const orienter = this.determineOrienter();
        return <div className="device-orienter">{orienter}</div>;
    }
}
