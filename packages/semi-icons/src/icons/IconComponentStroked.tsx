import * as React from 'react';
import { convertIcon } from '../components/Icon';

function SvgComponent(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            focusable={false}
            aria-hidden={true}
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1 9C1 8.44772 1.44772 8 2 8H22C22.5523 8 23 8.44772 23 9V15C23 15.5523 22.5523 16 22 16H2C1.44772 16 1 15.5523 1 15V9ZM3 10V14H21V10H3Z"
                fill="currentColor"
            />
        </svg>
    );
}

const IconComponent = convertIcon(SvgComponent, 'component_stroked');
export default IconComponent;
