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
                d="M2 4.00003C2 3.44775 2.44772 3.00003 3 3.00003H6V8.00003H3C2.44772 8.00003 2 7.55232 2 7.00003V4.00003Z"
                fill="#0077FA"
            />
            <path
                d="M8 3.00003H21C21.5523 3.00003 22 3.44775 22 4.00003V7.00003C22 7.55232 21.5523 8.00003 21 8.00003H8V3.00003Z"
                fill="#4CC3FA"
            />
            <path d="M2 11C2 10.4477 2.44772 10 3 10H6V15H3C2.44772 15 2 14.5523 2 14V11Z" fill="#AAB2BF" />
            <path d="M8 10H21C21.5523 10 22 10.4477 22 11V14C22 14.5523 21.5523 15 21 15H8V10Z" fill="#DDE3E8" />
            <path d="M2 18C2 17.4477 2.44772 17 3 17H6V22H3C2.44772 22 2 21.5523 2 21V18Z" fill="#AAB2BF" />
            <path d="M8 17H21C21.5523 17 22 17.4477 22 18V21C22 21.5523 21.5523 22 21 22H8V17Z" fill="#DDE3E8" />
        </svg>
    );
}
const IconComponent = convertIcon(SvgComponent, 'list');
export default IconComponent;
