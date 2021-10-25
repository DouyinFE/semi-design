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
                d="M9 0H10C10 4 11 5.5 13 7.5C15 9.5 16 10 16 12C16 14 15 14.5 13 16.5C11 18.5 10 20 10 24H9V0Z"
                fill="currentColor"
            />
        </svg>
    );
}

const IconComponent = convertIcon(SvgComponent, 'triangle_arrow_vertical');
export default IconComponent;
