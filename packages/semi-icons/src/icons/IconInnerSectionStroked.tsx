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
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5 2C4.44772 2 4 2.44772 4 3V21C4 21.5523 4.44772 22 5 22H10C10.5523 22 11 21.5523 11 21V3C11 2.44772 10.5523 2 10 2H5ZM6 20V4H9V20H6ZM14 2C13.4477 2 13 2.44772 13 3V21C13 21.5523 13.4477 22 14 22H19C19.5523 22 20 21.5523 20 21V3C20 2.44772 19.5523 2 19 2H14ZM15 20V4H18V20H15Z"
                fill="currentColor"
            />
        </svg>
    );
}

const IconComponent = convertIcon(SvgComponent, 'inner_section_stroked');
export default IconComponent;
