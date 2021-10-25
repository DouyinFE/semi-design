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
                d="M11.937 2C12.7655 2 13.437 2.67157 13.437 3.5L13.437 12.8787L15.8157 10.5C16.4015 9.91422 17.3512 9.91422 17.937 10.5C18.5228 11.0858 18.5228 12.0355 17.937 12.6213L12.9977 17.5607C12.4119 18.1464 11.4622 18.1464 10.8764 17.5607L5.8157 12.5C5.22991 11.9142 5.22991 10.9645 5.8157 10.3787C6.40148 9.79289 7.35123 9.79289 7.93702 10.3787L10.437 12.8787L10.437 3.5C10.437 2.67157 11.1086 2 11.937 2Z"
                fill="currentColor"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.43823 22C3.60981 22 2.93823 21.3284 2.93823 20.5C2.93823 19.6716 3.60981 19 4.43823 19L19.4382 19C20.2667 19 20.9382 19.6716 20.9382 20.5C20.9382 21.3284 20.2667 22 19.4382 22L4.43823 22Z"
                fill="currentColor"
            />
        </svg>
    );
}

const IconComponent = convertIcon(SvgComponent, 'align_bottom');
export default IconComponent;
