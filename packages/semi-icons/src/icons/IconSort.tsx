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
                d="M6.45127 8.34152L11.2475 1.86011C11.6459 1.40478 12.3542 1.40478 12.7527 1.86011L17.5489 8.34152C18.1147 8.9881 17.6555 10 16.7963 10H7.20385C6.34469 10 5.88551 8.9881 6.45127 8.34152Z"
                fill="currentColor"
            />
            <path
                d="M17.5489 15.6585L12.7527 22.1399C12.3542 22.5952 11.6459 22.5952 11.2475 22.1399L6.45127 15.6585C5.88551 15.0119 6.34469 14 7.20385 14H16.7963C17.6555 14 18.1147 15.0119 17.5489 15.6585Z"
                fill="currentColor"
            />
        </svg>
    );
}

const IconComponent = convertIcon(SvgComponent, 'sort');
export default IconComponent;
