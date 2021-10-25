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
                d="M2.50009 14.5V5.5C2.50009 4.39543 3.39552 3.5 4.50009 3.5H19.5001C20.6047 3.5 21.5001 4.39543 21.5001 5.5V14.5C21.5001 15.6046 20.6047 16.5 19.5001 16.5H4.50009C3.39552 16.5 2.50009 15.6046 2.50009 14.5Z"
                stroke="currentColor"
                strokeWidth={3}
            />
            <path d="M7.5 21.5H16.5" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
            <path d="M12 15.5V20.5" stroke="currentColor" strokeWidth={4} />
        </svg>
    );
}

const IconComponent = convertIcon(SvgComponent, 'desktop');
export default IconComponent;
