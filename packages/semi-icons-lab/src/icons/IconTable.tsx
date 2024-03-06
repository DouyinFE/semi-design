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
                d="M2.00001 5.00003C2.00001 3.89546 2.89544 3.00003 4.00001 3.00003H11V8.00003H2.00001V5.00003Z"
                fill="#3BCE4A"
            />
            <path d="M13 3.00003H20C21.1046 3.00003 22 3.89546 22 5.00003V8.00003H13V3.00003Z" fill="#3BCE4A" />
            <rect x={2} y={10} width={9} height={5} fill="#AAB2BF" />
            <rect x={13} y={10} width={9} height={5} fill="#DDE3E8" />
            <path d="M2.00001 17H11V22H4.00001C2.89544 22 2.00001 21.1046 2.00001 20V17Z" fill="#DDE3E8" />
            <path d="M13 17H22V20C22 21.1046 21.1046 22 20 22H13V17Z" fill="#AAB2BF" />
        </svg>
    );
}
const IconComponent = convertIcon(SvgComponent, 'table');
export default IconComponent;
