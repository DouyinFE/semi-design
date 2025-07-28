/* eslint-disable no-unused-vars */
import React from 'react';

export interface IconProps {
    id?: number;
    component?: React.ReactNode;
    size?: number;
    className?: string;
    type?: string
}

function Icon(props: IconProps = {}) {
    const { id, className, ...rest } = props;
    return (
        <svg
            {...rest}
            className={className}
            width="100%" 
            height="100%" 
            viewBox="0 0 100 100"
        >
            <circle 
                cx="50" 
                cy="50" 
                r="35" 
                stroke="currentColor"
                strokeWidth="11" 
                strokeLinecap="round" 
                strokeMiterlimit="10" 
                fill="none"
            >
            </circle>
        </svg>
    );
}

export default Icon;