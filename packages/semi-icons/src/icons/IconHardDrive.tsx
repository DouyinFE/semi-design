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
                d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm7.53 13.8-.89-2.69a1.05 1.05 0 0 1 1.8-1.08l1.96 2.05a6 6 0 1 0-2.87 1.72Zm-.28-5.8a1.25 1.25 0 0 1-2.5 0 1.25 1.25 0 0 1 2.5 0ZM8 19a1 1 0 0 0-2 0 1 1 0 0 0 2 0Z"
                fill="currentColor"
            />
        </svg>
    );
}
const IconComponent = convertIcon(SvgComponent, 'hard_drive');
export default IconComponent;
