import React from 'react';
import {
    betaConstants,
    cssOffsetPropertyName,
    hideOrienterDelay
} from './constants';
import { delay, cancelDelay, calculateNormalizedBetaOffset } from './utils';
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
        const normalizedOffset = calculateNormalizedBetaOffset(reading);
        const containerSize = this.containerEl.offsetHeight;
        const size = this.deviceEl.offsetHeight;
        const maxOffset = (containerSize - size) / 2;
        return normalizedOffset * maxOffset;
    }

    render() {
        const { offset } = this.state;

        const orienterClassName = classNames('axis-orienter -beta', {
            '-done': offset === 0
        });

        let headingText;
        if (offset < 0) {
            headingText = 'Tile your phone away from you';
        } else if (offset > 0) {
            headingText = 'Raise your phone until almost upright';
        } else {
            headingText = 'Nice!';
        }

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
