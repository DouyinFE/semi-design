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
            <g opacity={0.99}>
                <path
                    d="M2 19.5C2 18.6716 2.67157 18 3.5 18H9.5C10.3284 18 11 18.6716 11 19.5C11 20.3284 10.3284 21 9.5 21H3.5C2.67157 21 2 20.3284 2 19.5Z"
                    fill="currentColor"
                />
                <path
                    d="M2 12C2 11.1716 2.67157 10.5 3.5 10.5H14.5C15.3284 10.5 16 11.1716 16 12C16 12.8284 15.3284 13.5 14.5 13.5H3.5C2.67157 13.5 2 12.8284 2 12Z"
                    fill="currentColor"
                />
                <path
                    d="M2 4.5C2 3.67157 2.67157 3 3.5 3H20.5C21.3284 3 22 3.67157 22 4.5C22 5.32843 21.3284 6 20.5 6H3.5C2.67157 6 2 5.32843 2 4.5Z"
                    fill="currentColor"
                />
            </g>
        </svg>
    );
}

const IconComponent = convertIcon(SvgComponent, 'descend');
export default IconComponent;
