import React from 'react';

export default function ArrowUpSVG(props) {
    return (
        <svg
            height={24}
            viewBox="0 0 24 24"
            width={24}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
            <path d="M0 0h24v24H0z" fill="none" />
        </svg>
    );
}