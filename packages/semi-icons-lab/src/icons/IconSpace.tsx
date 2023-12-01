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
            <rect x={1} y={2} width={2} height={20} rx={1} fill="#DDE3E8" />
            <rect x={21} y={2} width={2} height={20} rx={1} fill="#DDE3E8" />
            <path d="M6 12L18 12" stroke="#4CC3FA" strokeWidth={2} strokeLinecap="round" />
            <path d="M15 9L18 12L15 15" stroke="#4CC3FA" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 9L6 12L9 15" stroke="#4CC3FA" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
const IconComponent = convertIcon(SvgComponent, 'space');
export default IconComponent;
