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
                d="M6.95249 7.72265L17.084 7.72265C17.4833 7.72265 17.7215 8.16772 17.5 8.5L12.4343 16.0986C12.2363 16.3955 11.8001 16.3955 11.6022 16.0986L6.53647 8.5C6.31495 8.16772 6.55315 7.72265 6.95249 7.72265Z"
                fill="currentColor"
            />
        </svg>
    );
}

const IconComponent = convertIcon(SvgComponent, 'small_triangle_down');
export default IconComponent;
