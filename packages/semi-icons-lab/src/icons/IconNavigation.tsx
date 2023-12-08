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
            <g clipPath="url(#clip0_1_3057)">
                <circle cx={12} cy={12} r={11} transform="rotate(-45 12 12)" fill="#DDE3E8" />
                <path
                    d="M4.95413 12.237L16.8183 6.92269L12.2377 19.089L10.5096 13.6288L4.95413 12.237Z"
                    fill="#324350"
                />
            </g>
            <defs>
                <clipPath id="clip0_1_3057">
                    <rect width={24} height={24} fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}
const IconComponent = convertIcon(SvgComponent, 'navigation');
export default IconComponent;
