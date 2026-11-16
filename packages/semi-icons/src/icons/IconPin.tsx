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
                d="M9 2h6a3 3 0 0 1 0 6h-1l2.5 6a1.5 1.5 0 0 1 0 3H7.5a1.5 1.5 0 0 1 0-3l2.5-6H9a3 3 0 0 1 0-6ZM11 17h2v4a1 1 0 0 1-2 0v-4Z"
                fill="currentColor"
            />
        </svg>
    );
}
const IconComponent = convertIcon(SvgComponent, 'pin');
export default IconComponent;
