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
            <g clipPath="url(#clip_spin)">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.2 3.78966C9.66551 2.57466 5.00465 5.26561 3.78964 9.80007C3.12066 12.2967 3.63433 14.8301 4.99177 16.8102C5.46019 17.4935 5.28601 18.4271 4.60273 18.8955C3.91945 19.364 2.98581 19.1898 2.51739 18.5065C0.685557 15.8344 -0.0134454 12.4023 0.891867 9.02361C2.5357 2.88875 8.84157 -0.751945 14.9764 0.891885C21.1113 2.53572 24.752 8.84159 23.1082 14.9765C22.8937 15.7767 22.0712 16.2515 21.271 16.0371C20.4708 15.8227 19.996 15.0002 20.2104 14.2C21.4254 9.66553 18.7344 5.00467 14.2 3.78966Z"
                    fill="url(#paint0_angular)"
                />
            </g>
            <defs>
                <radialGradient
                    id="paint0_angular"
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(12 12) rotate(15) scale(9.5 9.51825)"
                >
                    <stop />
                    <stop offset={0.301257} stopOpacity={0} stopColor="currentColor" />
                    <stop offset={0.466753} stopOpacity={1} stopColor="currentColor" />
                </radialGradient>
                <clipPath id="clip_spin">
                    <rect width={24} height={24} fill="currentColor" />
                </clipPath>
            </defs>
        </svg>
    );
}

const IconComponent = convertIcon(SvgComponent, 'spin');
export default IconComponent;
