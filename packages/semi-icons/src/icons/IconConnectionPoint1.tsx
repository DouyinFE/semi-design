import * as React from 'react';
import { convertIcon } from '../components/Icon';

function SvgComponent(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            focusable={false}
            aria-hidden={true}
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1 3C1 1.89543 1.89543 1 3 1H21C22.1045 1 23 1.89543 23 3V9C23 10.1046 22.1045 11 21 11H7.5V15C7.5 15.8284 8.17157 16.5 9 16.5H13V15C13 13.8954 13.8954 13 15 13H21C22.1046 13 23 13.8954 23 15V21C23 22.1046 22.1046 23 21 23H15C13.8954 23 13 22.1046 13 21V19.5H9C6.51472 19.5 4.5 17.4853 4.5 15V11H3C1.89543 11 1 10.1046 1 9V3Z"
                fill="currentColor"
            />
        </svg>
    );
}

const IconComponent = convertIcon(SvgComponent, 'connection_point_1');
export default IconComponent;
