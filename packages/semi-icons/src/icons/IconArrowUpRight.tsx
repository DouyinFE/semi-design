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
                d="M5 4.5C5 3.67157 5.67157 3 6.5 3H19.5C20.3284 3 21 3.67157 21 4.5V17.5C21 18.3284 20.3284 19 19.5 19C18.6716 19 18 18.3284 18 17.5V8.12132L4.56066 21.5606C3.97487 22.1464 3.02513 22.1464 2.43934 21.5606C1.85355 20.9749 1.85355 20.0251 2.43934 19.4393L15.8787 6H6.5C5.67157 6 5 5.32843 5 4.5Z"
                fill="currentColor"
            />
        </svg>
    );
}

const IconComponent = convertIcon(SvgComponent, 'arrow_up_right');
export default IconComponent;
