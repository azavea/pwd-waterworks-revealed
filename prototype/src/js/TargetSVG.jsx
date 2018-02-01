import React from 'react';

export default function TargetSVG(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={108}
            height={222}
            viewBox="0 0 108 222"
            {...props}
        >
            <g fill="none" fillRule="evenodd">
                <path
                    className="outer"
                    fill="#000"
                    d="M13.58 0h80.84C101.92 0 108 6.085 108 13.592v194.816c0 7.507-6.08 13.592-13.58 13.592H13.58C6.08 222 0 215.915 0 208.408V13.592C0 6.085 6.08 0 13.58 0z"
                />
                <path className="inner" fill="#F00" d="M6 26v168h96V26z" />
            </g>
        </svg>
    );
}
