import React from 'react';
const images = require('../img/*');
const classNames = require('classnames');

export default class ZoneTour extends React.Component {
    render() {
        const { zone } = this.props;
        const imageName = zone && zone.tour[0].image;
        const imageUrl = images[imageName];
        const caption = zone && zone.tour[0].caption;

        return (
            <div className="zone-tour" onClick={this.props.onTourComplete}>
                <figure className="tour-figure">
                    <img className="image" src={imageUrl} />
                    <figcaption className="caption">{caption}</figcaption>
                </figure>
            </div>
        );
    }
}
