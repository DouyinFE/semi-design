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
                d="M2.9685 14.1284L12 6L21.0315 14.1284C21.3721 14.4349 21.1553 15 20.697 15H16V22H8V15H3.30298C2.84474 15 2.62789 14.4349 2.9685 14.1284Z"
                fill="#4CC3FA"
            />
            <rect x={3} y={2} width={18} height={4} rx={1} fill="#AAB2BF" />
        </svg>
    );
}
const IconComponent = convertIcon(SvgComponent, 'back-top');
export default IconComponent;
