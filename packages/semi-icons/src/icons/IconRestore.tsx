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
                d="M3 9A2 2 0 015 7H15a2 2 0 012 2V19a2 2 0 01-2 2H5A2 2 0 013 19V9Zm3 1v8h8V10H6ZM7 4c0-1.1.9-2 2-2h11a2 2 0 012 2v11a2 2 0 01-2 2h-1V5H7V4Z"
                fill="currentColor"
            />
        </svg>
    );
}
const IconComponent = convertIcon(SvgComponent, 'restore');
export default IconComponent;
