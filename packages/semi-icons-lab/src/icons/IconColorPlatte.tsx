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
                d="M12 2C6.47778 2 2 6.47778 2 12C2 17.5222 6.47778 22 12 22C12.9222 22 13.6667 21.2556 13.6667 20.3333C13.6667 19.9 13.5056 19.5111 13.2333 19.2167C12.9722 18.9222 12.8167 18.5389 12.8167 18.1111C12.8167 17.1889 13.5611 16.4444 14.4833 16.4444H16.4444C19.5111 16.4444 22 13.9556 22 10.8889C22 5.97778 17.5222 2 12 2Z"
                fill="#DDE3E8"
                stroke="#DDE3E8"
                strokeWidth={1.5}
            />
            <circle cx={6} cy={12} r={2} fill="#F82C2C" />
            <circle cx={10.5} cy={7} r={2} fill="#4CC3FA" />
            <circle cx={17} cy={9} r={2} fill="#3BCE4A" />
        </svg>
    );
}
const IconComponent = convertIcon(SvgComponent, 'color-platte');
export default IconComponent;
