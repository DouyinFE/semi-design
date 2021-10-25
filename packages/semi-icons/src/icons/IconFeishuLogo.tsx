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
                d="M10.396 12.9586L15.7149 7.59084C15.5779 7.34131 15.5 7.05475 15.5 6.75C15.5 5.78351 16.2835 5 17.25 5C17.549 5 17.8305 5.07501 18.0768 5.20723L22.2456 1L0 7.44405L5.28847 12.6722L10.396 12.9586ZM11.1685 13.7194L11.5483 18.9896L16.6209 24L23.0001 1.77899L18.827 5.99044C18.9379 6.22018 19 6.47784 19 6.75C19 7.7165 18.2165 8.5 17.25 8.5C16.9835 8.5 16.731 8.44045 16.5049 8.33391L11.1685 13.7194Z"
                fill="currentColor"
            />
        </svg>
    );
}

const IconComponent = convertIcon(SvgComponent, 'feishu_logo');
export default IconComponent;
