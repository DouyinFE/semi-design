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
                d="M6.45096 8.34102L11.247 2.86102C11.3408 2.75361 11.4566 2.66753 11.5865 2.60854C11.7163 2.54956 11.8573 2.51904 12 2.51904C12.1426 2.51904 12.2836 2.54956 12.4135 2.60854C12.5433 2.66753 12.6591 2.75361 12.753 2.86102L17.549 8.34102C18.115 8.98802 17.655 10 16.796 10H7.20396C6.34396 10 5.88496 8.98802 6.45096 8.34102Z"
                fill="currentColor"
            />
        </svg>
    );
}

const IconComponent = convertIcon(SvgComponent, 'caretup');
export default IconComponent;
