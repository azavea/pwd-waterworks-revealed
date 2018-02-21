import React from 'react';
import {
    betaConstants,
    cssOffsetPropertyName,
    hideOrienterDelay
} from './constants';
import { delay, cancelDelay, calculateNormalizedBetaOffset } from './utils';
import DeviceSVG from './svg/DeviceSVG';
import TargetSVG from './svg/TargetSVG';
import ArrowUpSVG from './svg/ArrowUpSVG';
import ArrowDownSVG from './svg/ArrowDownSVG';

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
        this.arrowEl &&
            this.arrowEl.style.setProperty(
                cssOffsetPropertyName,
                offset + 'px'
            );
    }

    calculateOffset(reading) {
        const normalizedOffset = calculateNormalizedBetaOffset(reading);
        const containerSize = this.containerEl.offsetHeight;
        const size = this.deviceEl.offsetHeight;
        const maxOffset = (containerSize - size) / 2;
        return Math.sqrt(normalizedOffset) * maxOffset;
    }

    render() {
        const { offset } = this.state;

        let headingText, arrowSVG;
        if (offset < 0) {
            headingText = 'Tile your phone away from you';
            arrowSVG = <ArrowDownSVG />;
        } else if (offset > 0) {
            headingText = 'Raise your phone until almost upright';
            arrowSVG = <ArrowUpSVG />;
        } else {
            headingText = 'Nice!';
            arrowSVG = null;
        }

        const deviceClassName = classNames('illustration -device', {
            '-on': offset === 0,
            '-hide': offset === null
        });

        const targetClassName = classNames('illustration -target', {
            '-on': offset === 0,
            '-hide': offset === null
        });

        const arrowClassName = classNames('arrow', {
            '-hide': offset === null
        });

        return (
            <div className="axis-orienter -beta">
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
                    >
                        <TargetSVG />
                    </div>
                    <div
                        className={deviceClassName}
                        ref={el => {
                            this.deviceEl = el;
                        }}
                    >
                        <DeviceSVG />
                    </div>
                    <div
                        className={arrowClassName}
                        ref={el => {
                            this.arrowEl = el;
                        }}
                    >
                        {arrowSVG}
                    </div>
                </div>
            </div>
        );
    }
}
