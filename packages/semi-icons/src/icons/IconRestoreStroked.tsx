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
                d="M22 16a2 2 0 01-2 2V4H6c0-1.1.9-2 2-2h12a2 2 0 012 2v12ZM2 8c0-1.1.9-2 2-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V8ZM4 8V20H16V8H4Z"
                fill="currentColor"
            />
        </svg>
    );
}
const IconComponent = convertIcon(SvgComponent, 'restore_stroked');
export default IconComponent;
