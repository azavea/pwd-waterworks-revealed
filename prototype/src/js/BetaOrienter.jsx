import React from 'react';
import {
    betaConstants,
    cssOffsetPropertyName,
    hideOrienterDelay
} from './constants';
import { delay, cancelDelay } from './utils';
const classNames = require('classnames');

export default class BetaOrienter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: null
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setPosition(nextProps.beta);
        this.hideIfDone();
    }

    hideIfDone() {
        if (!this.delay && this.state.offset === 0) {
            this.delay = delay(hideOrienterDelay, () => {
                this.props.onOrientationComplete();
            });
        } else if (this.delay && this.state.offset !== 0) {
            cancelDelay(this.delay);
            this.delay = null;
        }
    }

    setPosition(reading) {
        let offset = this.calculateOffset(reading);

        this.setState({ offset: offset });

        this.deviceEl.style.setProperty(cssOffsetPropertyName, offset + 'px');
        this.targetEl.style.setProperty(cssOffsetPropertyName, -offset + 'px');
    }

    calculateOffset(reading) {
        const normalizedOffset = this.calculateNormalizedOffset(reading);
        const containerSize = this.containerEl.offsetHeight;
        const size = this.deviceEl.offsetHeight;
        const maxOffset = (containerSize - size) / 2;
        return normalizedOffset * maxOffset;
    }

    calculateNormalizedOffset(reading) {
        const { target, buffer, min, max } = betaConstants;
        const minThreshold = Math.max(target - buffer, min);
        const maxThreshold = Math.min(target + buffer, max);
        let normalizedOffset = 0;

        if (reading < min) {
            normalizedOffset = 1;
        } else if (reading < minThreshold) {
            normalizedOffset = 1 - (reading - min) / (minThreshold - min);
        } else if (reading >= minThreshold && reading <= maxThreshold) {
            normalizedOffset = 0;
        } else if (reading < max) {
            normalizedOffset =
                0 - (reading - maxThreshold) / (max - maxThreshold);
        } else {
            normalizedOffset = -1;
        }

        return normalizedOffset;
    }

    render() {
        const { offset } = this.state;

        const orienterClassName = classNames('axis-orienter -beta', {
            '-done': offset === 0
        });

        const headingText =
            offset === 0 ? 'Nice!' : 'Raise your phone until almost upright';

        const deviceClassName = classNames('device', {
            '-on': offset === 0,
            '-hide': offset === null
        });

        const targetClassName = classNames('target', {
            '-hide': offset === null
        });

        return (
            <div className={orienterClassName}>
                <h1 className="heading">{headingText}</h1>
                <div
                    className="canvas"
                    ref={el => {
                        this.containerEl = el;
                    }}
                >
                    <div
                        className={targetClassName}
                        ref={el => {
                            this.targetEl = el;
                        }}
                    />
                    <div
                        className={deviceClassName}
                        ref={el => {
                            this.deviceEl = el;
                        }}
                    />
                </div>
            </div>
        );
    }
}
