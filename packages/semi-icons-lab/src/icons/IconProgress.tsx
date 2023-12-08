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
            <circle cx={12} cy={12} r={8} stroke="#3BCE4A" strokeWidth={6} />
            <path
                d="M12.1378 4C16.48 4 20 7.58172 20 12C20 16.4183 16.48 20 12.1378 20C9.65493 20 7.44087 18.8289 6 17"
                stroke="#3BCE4A"
                strokeWidth={6}
                strokeLinecap="round"
            />
        </svg>
    );
}
const IconComponent = convertIcon(SvgComponent, 'progress');
export default IconComponent;
