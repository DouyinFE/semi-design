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
                d="M6 23h12c1.1 0 2.14-.9 2-2-.44-3.5-2.14-5.06-3.38-6.28-.9-.87-1.62-1.58-1.62-2.72 0-1.14.72-1.85 1.62-2.72C17.86 8.06 19.56 6.5 20 3c.14-1.1-.9-2-2-2H6c-1.1 0-2.17.9-2 2 .47 2.92 2.07 4.55 3.27 5.88C8.22 9.94 9 10.81 9 12c0 1.14-.72 1.85-1.62 2.72C6.14 15.94 4.44 17.5 4 21c-.14 1.1.9 2 2 2Zm9-16c0 .82-.74 1.49-1.5 2.17A4.93 4.93 0 0 0 12 11a4.93 4.93 0 0 0-1.5-1.83C9.74 8.49 9 7.82 9 7h6ZM7 20c0-1.51 1.02-2.14 2.16-2.83 1.11-.68 2.34-1.44 2.84-3.17.5 1.73 1.73 2.49 2.84 3.17 1.14.7 2.16 1.32 2.16 2.83H7Z"
                fill="currentColor"
            />
        </svg>
    );
}
const IconComponent = convertIcon(SvgComponent, 'hourglass');
export default IconComponent;
