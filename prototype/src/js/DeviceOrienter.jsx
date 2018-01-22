import React from 'react';
import AlphaOrienter from './AlphaOrienter';
import BetaOrienter from './BetaOrienter';
import { orienterStates } from './constants';

export default class DeviceOrienter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            supportedEventName: null,
            orienterState: orienterStates.start,
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

    onAlphaAlignmentComplete = () => {
        this.setState({ orienterState: orienterStates.alphaAligned });
    };

    onBetaAlignmentComplete = () => {
        this.setState({ orienterState: orienterStates.betaAligned });
    };

    render() {
        const { alpha, beta } = this.state;

        let orienter;
        switch (this.state.orienterState) {
            case orienterStates.start:
                orienter = (
                    <BetaOrienter
                        beta={beta}
                        onAlignmentComplete={this.onBetaAlignmentComplete}
                    />
                );
                break;
            case orienterStates.betaAligned:
                orienter = (
                    <AlphaOrienter
                        alpha={alpha}
                        onAlignmentComplete={this.onAlphaAlignmentComplete}
                    />
                );
                break;
            case orienterStates.alphaAligned:
                orienter = (
                    <div className="success">
                        <h1>:)</h1>
                    </div>
                );
                break;
            default:
                orienter = null;
        }

        return <div className="device-orienter">{orienter}</div>;
    }
}
