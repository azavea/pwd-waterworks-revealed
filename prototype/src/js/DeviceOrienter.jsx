import React from 'react';
import AlphaOrienter from './AlphaOrienter';
import BetaOrienter from './BetaOrienter';
import { CSSTransition } from 'react-transition-group';
import {
    delay,
    calculateNormalizedAlphaOffset,
    calculateNormalizedBetaOffset
} from './utils';

export default class DeviceOrienter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            supportedEventName: null,
            betaOrientationComplete: false,
            betaTransionedOut: false,
            alphaOrientationComplete: false,
            alphaTransitionedOut: false,
            firstDeviceOrientationEventReceived: false,
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
                this.onDeviceOrientation,
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
                this.onDeviceOrientation,
                true
            );
        }
    }

    onFirstDeviceOrientationEvent(alpha, beta) {
        this.setState({ firstDeviceOrientationEventReceived: true });

        if (this.isBetaOriented(beta)) {
            this.setState({
                betaOrientationComplete: true,
                betaTransionedOut: true
            });

            if (this.isAlphaOriented(alpha)) {
                this.setState({
                    alphaOrientationComplete: true,
                    alphaTransionedOut: true
                });
                this.props.onOrientationComplete();
            }
        }
    }

    onDeviceOrientation = event => {
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

        if (!this.state.firstDeviceOrientationEventReceived) {
            this.onFirstDeviceOrientationEvent(alpha, event.beta);
        }

        this.setState({
            alpha: alpha,
            beta: event.beta
        });
    };

    onAlphaOrientationComplete = () => {
        this.setState({ alphaOrientationComplete: true });
    };

    onBetaOrientationComplete = () => {
        this.setState({ betaOrientationComplete: true });
    };

    onAlphaTransitionOutComplete = () => {
        this.setState({ alphaTransitionedOut: true });
        this.props.onOrientationComplete();
    };

    onBetaTransitionOutComplete = () => {
        this.setState({ betaTransionedOut: true });
    };

    isBetaOriented(beta) {
        return calculateNormalizedBetaOffset(beta) === 0;
    }

    isAlphaOriented(alpha) {
        return (
            calculateNormalizedAlphaOffset(this.props.zone.bearing, alpha) === 0
        );
    }

    render() {
        const { alpha, beta } = this.state;

        const alphaOrienter = (
            <CSSTransition
                in={
                    this.state.firstDeviceOrientationEventReceived &&
                    this.state.betaTransionedOut &&
                    !this.state.alphaOrientationComplete
                }
                key="alpha"
                classNames=""
                timeout={100}
                mountOnEnter={true}
                unmountOnExit={true}
                onExited={this.onAlphaTransitionOutComplete}
            >
                <AlphaOrienter
                    alpha={alpha}
                    target={this.props.zone.bearing}
                    onOrientationComplete={this.onAlphaOrientationComplete}
                />
            </CSSTransition>
        );

        const betaOrienter = (
            <CSSTransition
                in={
                    this.state.firstDeviceOrientationEventReceived &&
                    !this.state.betaOrientationComplete
                }
                key="beta"
                classNames=""
                timeout={100}
                mountOnEnter={true}
                unmountOnExit={true}
                onExited={this.onBetaTransitionOutComplete}
            >
                <BetaOrienter
                    beta={beta}
                    onOrientationComplete={this.onBetaOrientationComplete}
                />
            </CSSTransition>
        );

        return (
            <div className="device-orienter">
                {betaOrienter}
                {alphaOrienter}
            </div>
        );
    }
}
