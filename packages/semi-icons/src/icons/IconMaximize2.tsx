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
                d="M5 5.5A.5.5 0 015.5 5h13a.5.5 0 01.5.5v13a.5.5 0 01-.5.5H5.5A.5.5 0 015 18.5V5.5Zm-3 0v13A3.5 3.5 0 005.5 22h13A3.5 3.5 0 0022 18.5V5A3.5 3.5 0 0018.5 2H5.5A3.5 3.5 0 002 5.5Z"
                fill="currentColor"
            />
        </svg>
    );
}
const IconComponent = convertIcon(SvgComponent, 'maximize_2');
export default IconComponent;
