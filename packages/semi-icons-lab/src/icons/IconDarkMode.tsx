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
            <circle cx={12} cy={12} r={11} fill="#324350" />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18 15.9519C17.5859 16.025 17.1597 16.0631 16.7246 16.0631C12.6984 16.0631 9.43457 12.7992 9.43457 8.77305C9.43457 7.32204 9.85849 5.97005 10.5892 4.83416C7.17112 5.43727 4.57452 8.42192 4.57452 12.013C4.57452 16.0392 7.8384 19.3031 11.8646 19.3031C14.4398 19.3031 16.7031 17.9679 18 15.9519Z"
                fill="#FBCD2C"
            />
        </svg>
    );
}
const IconComponent = convertIcon(SvgComponent, 'dark-mode');
export default IconComponent;
