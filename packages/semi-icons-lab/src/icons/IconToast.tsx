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
            <g clipPath="url(#clip0_1_3058)">
                <path
                    d="M0.817818 4.5455C0.412129 5.00207 0.353969 5.92994 0.42002 6.55837L0.759737 9.79057C0.86798 10.8204 1.74149 11.5727 2.71077 11.4708L2.94477 11.4462L3.84633 20.024C4.04232 21.8887 5.14137 22.7787 7.13041 22.5697L18.0702 21.4198C21.0537 21.1063 21.9437 20.0072 21.7477 18.1425L20.8462 9.56472C21.8154 9.46285 22.7475 8.5208 22.6392 7.49094L22.2995 4.25874C22.2147 3.4518 21.8898 2.79537 21.2172 2.40144C19.8694 1.61209 16.2497 0.495504 10.9024 1.05752C5.34314 1.64183 1.72654 3.52281 0.817818 4.5455Z"
                    fill="#FBCD2C"
                />
                <circle cx={7.21108} cy={8.98682} r={1.5} transform="rotate(-6 7.21108 8.98682)" fill="#324350" />
                <circle cx={16.1618} cy={8.04605} r={1.5} transform="rotate(-6 16.1618 8.04605)" fill="#324350" />
                <path
                    d="M12.4704 15.9754C14.6674 15.7444 16.2613 13.7762 16.0304 11.5792C16.0304 11.5792 14.9836 11.1864 12 11.5C9.01643 11.8136 8.07418 12.4154 8.07418 12.4154C8.30509 14.6124 10.2733 16.2063 12.4704 15.9754Z"
                    fill="#324350"
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.6727 15.0199C14.0749 15.539 13.3175 15.8863 12.4704 15.9753C11.6232 16.0644 10.8101 15.8821 10.1175 15.4986C10.3199 14.4983 11.1508 13.7008 12.2195 13.5885C13.2882 13.4762 14.2667 14.0835 14.6727 15.0199Z"
                    fill="#FF2969"
                />
            </g>
            <defs>
                <clipPath id="clip0_1_3058">
                    <rect width={24} height={24} fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}
const IconComponent = convertIcon(SvgComponent, 'toast');
export default IconComponent;
