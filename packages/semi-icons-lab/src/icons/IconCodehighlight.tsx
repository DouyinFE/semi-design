import * as React from 'react';
import { convertIcon } from '../components/Icon';
function SvgComponent(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 22 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            focusable={false}
            aria-hidden={true}
            {...props}
        >
            <rect y={0.406} width={22} height={10} rx={2} fill="#49C4FD" />
            <path d="M0 4.59375H11V17.5938H2C0.895431 17.5938 0 16.6983 0 15.5938V4.59375Z" fill="#F9FCFF" />
            <path d="M11 4.59375H22V15.5938C22 16.6983 21.1046 17.5938 20 17.5938H11V4.59375Z" fill="#F9FCFF" />
            <path d="M7 8L4 11L7 14" stroke="#F8CE27" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            <path
                d="M15 8L18 11L15 14"
                stroke="#49C4FD"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M12 8L10 14.5" stroke="#E0E4E7" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
    );
}
const IconComponent = convertIcon(SvgComponent, 'codehighlight');
export default IconComponent;
