import React from 'react';
import {
    alphaConstants,
    cssOffsetPropertyName,
    hideOrienterDelay
} from './constants';
import { delay, cancelDelay, calculateNormalizedAlphaOffset } from './utils';
import DeviceSVG from './DeviceSVG';
import TargetSVG from './TargetSVG';
import ArrowLeftSVG from './ArrowLeftSVG';
import ArrowRightSVG from './ArrowRightSVG';

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

        this.deviceEl.style.setProperty(cssOffsetPropertyName, -offset + 'px');
        this.targetEl.style.setProperty(cssOffsetPropertyName, offset + 'px');
        this.arrowEl &&
            this.arrowEl.style.setProperty(
                cssOffsetPropertyName,
                -offset + 'px'
            );
    }

    calculateOffset(reading) {
        const normalizedOffset = calculateNormalizedAlphaOffset(
            this.props.target,
            reading
        );
        const containerSize = this.containerEl.offsetWidth;
        const size = this.deviceEl.offsetWidth;
        const maxOffset = (containerSize - size) / 2;
        const sign = normalizedOffset < 0 ? -1 : 1;
        return sign * Math.sqrt(sign * normalizedOffset) * maxOffset;
    }

    render() {
        const { offset } = this.state;

        let headingText, arrowSVG;
        if (offset < 0) {
            headingText = 'Turn left until the boxes align';
            arrowSVG = <ArrowLeftSVG />;
        } else if (offset > 0) {
            headingText = 'Turn right until the boxes align';
            arrowSVG = <ArrowRightSVG />;
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
            <div className="axis-orienter -alpha">
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
