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
                d="M17.72 3.73a3 3 0 0 0-2.72-1.73H9a3 3 0 0 0 0 6h1l-2.46 5.91ZM21.68 2.61a1 1 0 0 0-1.42-1.42L1.19 20.26a1 1 0 0 0 1.42 1.42ZM15.26 11.03l1.24 2.97a1.5 1.5 0 0 1 0 3H9.3ZM11 17h2v4a1 1 0 0 1-2 0v-4Z"
                fill="currentColor"
            />
        </svg>
    );
}
const IconComponent = convertIcon(SvgComponent, 'pin_off');
export default IconComponent;
