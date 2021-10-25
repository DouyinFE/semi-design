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
                d="M4 5C4 3.89543 4.89543 3 6 3H9C10.1046 3 11 3.89543 11 5V19C11 20.1046 10.1046 21 9 21H6C4.89543 21 4 20.1046 4 19V5ZM9 5H6V19H9V5Z"
                fill="currentColor"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13 5C13 3.89543 13.8954 3 15 3H18C19.1046 3 20 3.89543 20 5V19C20 20.1046 19.1046 21 18 21H15C13.8954 21 13 20.1046 13 19V5ZM18 5H15V19H18V5Z"
                fill="currentColor"
            />
        </svg>
    );
}

const IconComponent = convertIcon(SvgComponent, 'columus_stroked');
export default IconComponent;
