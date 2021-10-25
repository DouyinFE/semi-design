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
                d="M19 19.5C19 20.3284 18.3284 21 17.5 21L4.5 21C3.67157 21 3 20.3284 3 19.5V6.5C3 5.67157 3.67157 5 4.5 5C5.32843 5 6 5.67157 6 6.5V15.8787L19.4393 2.43936C20.0251 1.85357 20.9749 1.85357 21.5607 2.43936C22.1465 3.02514 22.1465 3.97489 21.5607 4.56068L8.12132 18L17.5 18C18.3284 18 19 18.6716 19 19.5Z"
                fill="currentColor"
            />
        </svg>
    );
}

const IconComponent = convertIcon(SvgComponent, 'arrow_down_left');
export default IconComponent;
