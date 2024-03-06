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
                d="M20.5 13.9853L12.0147 5.5L12.7574 4.75736C15.1005 2.41421 18.8995 2.41421 21.2426 4.75736C23.5858 7.1005 23.5858 10.8995 21.2426 13.2426L20.5 13.9853Z"
                fill="#F82C2C"
            />
            <path
                d="M11.2426 4.75736C8.89949 2.41421 5.1005 2.41421 2.75736 4.75736C0.414214 7.1005 0.414214 10.8995 2.75736 13.2426L12 22.4853C12 22.4853 17.1834 17.3166 20.5 14C21.8 12.7471 22.34 12 22.66 11C20 14 18.5 12 12.0147 5.5C11.5079 4.99201 11.2426 4.75736 11.2426 4.75736Z"
                fill="#FF7D95"
            />
        </svg>
    );
}
const IconComponent = convertIcon(SvgComponent, 'heart');
export default IconComponent;
