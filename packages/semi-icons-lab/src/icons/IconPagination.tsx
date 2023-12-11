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
            <path d="M1 8C1 6.34315 2.34315 5 4 5H12V19H4C2.34315 19 1 17.6569 1 16V8Z" fill="#6A6F7F" />
            <path d="M8 9L5 12L8 15" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 5H20C21.6569 5 23 6.34315 23 8V16C23 17.6569 21.6569 19 20 19H12V5Z" fill="#DDE3E8" />
            <path d="M16 9L19 12L16 15" stroke="#AAB2BF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
const IconComponent = convertIcon(SvgComponent, 'pagination');
export default IconComponent;
