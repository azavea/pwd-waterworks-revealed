import React from 'react';
import {
    alphaConstants,
    cssOffsetPropertyName,
    hideOrienterDelay
} from './constants';
import { delay, cancelDelay } from './utils';

const classNames = require('classnames');

export default class AlphaOrienter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: 1
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setPosition(nextProps.alpha);
        this.hideIfDone();
    }

    hideIfDone() {
        if (!this.delay && this.state.offset === 0) {
            this.delay = delay(
                hideOrienterDelay,
                this.props.onAlignmentComplete
            );
        } else if (this.delay && this.state.offset !== 0) {
            cancelDelay(this.delay);
            this.delay = null;
        }
    }

    setPosition(reading) {
        let offset = this.calculateOffset(reading);

        this.setState({ offset: offset });

        this.deviceEl.style.setProperty(cssOffsetPropertyName, -offset + 'px');
        this.targetEl.style.setProperty(cssOffsetPropertyName, offset + 'px');
    }

    calculateOffset(reading) {
        const normalizedOffset = this.calculateNormalizedOffset(reading);
        const containerSize = this.containerEl.offsetWidth;
        const size = this.deviceEl.offsetWidth;
        const maxOffset = (containerSize - size) / 2;
        return normalizedOffset * maxOffset;
    }

    calculateNormalizedOffset(reading) {
        const { target, slack } = alphaConstants;
        let minThreshold = target - slack;
        if (minThreshold < 0) {
            minThreshold += 360;
        }
        const maxThreshold = (target + slack) % 360;
        const opposite = (target + 180) % 360;

        let normalizedOffset = 0,
            numerator = 0,
            denominator = 0;

        if (this.inRangeModulo(reading, minThreshold, maxThreshold, 360)) {
            // within range
            normalizedOffset = 0;
        } else if (this.inRangeModulo(reading, opposite, minThreshold, 360)) {
            // below range
            numerator = reading - opposite;
            if (numerator < 0) {
                numerator += 360;
            }
            denominator = minThreshold - opposite;
            if (denominator < 0) {
                denominator += 360;
            }
            normalizedOffset = 1 - numerator / denominator;
        } else if (this.inRangeModulo(reading, maxThreshold, opposite, 360)) {
            // above range
            numerator = reading - maxThreshold;
            if (numerator < 0) {
                numerator += 360;
            }
            denominator = opposite - maxThreshold;
            if (denominator < 0) {
                denominator += 360;
            }
            normalizedOffset = 0 - numerator / denominator;
        } else {
            // reading === opposite
            normalizedOffset = 1;
        }

        return normalizedOffset;
    }

    inRangeModulo(x, min, max, modulo) {
        if (max > min) {
            // range does not span the MODULO
            return x >= min && x <= max;
        } else if (min === max) {
            // just in case
            return x === min;
        } else {
            // range spans the modulo
            return (x >= min && x <= modulo) || (x >= 0 && x <= max);
        }
    }

    render() {
        const { offset } = this.state;

        const orienterClassName = classNames('axis-orienter -alpha', {
            '-done': offset === 0
        });

        const headingText = offset === 0 ? '✅' : 'Turn until the boxes align';

        const deviceClassName = classNames('device', {
            '-on': offset === 0
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
                        className="target"
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
