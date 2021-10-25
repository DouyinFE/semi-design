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
                d="M2.16707 17.4086L11.1937 5.09962C11.5932 4.55477 12.4069 4.55477 12.8065 5.09962L21.8331 17.4086C22.3175 18.0691 21.8458 19 21.0267 19H2.97347C2.15437 19 1.68268 18.0691 2.16707 17.4086Z"
                fill="currentColor"
            />
        </svg>
    );
}

const IconComponent = convertIcon(SvgComponent, 'triangle_up');
export default IconComponent;
