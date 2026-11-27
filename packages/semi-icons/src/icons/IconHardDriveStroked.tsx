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
                d="M6 1h12a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Zm0 2a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H6Zm10.92 10.44a6 6 0 1 0-5.63 2.52l2.66 3.63a1 1 0 0 0 .8.41h2.5a1 1 0 0 0 .98-1.24l-1.43-5.79.12.47Zm-2.2-.52.14.53L15.98 18h-.72l-2.93-4.01a4 4 0 1 1 2.4-1.07ZM13.26 10a1.25 1.25 0 0 1-2.5 0 1.25 1.25 0 0 1 2.5 0Zm-5 9a1.25 1.25 0 0 1-2.5 0 1.25 1.25 0 0 1 2.5 0Z"
                fill="currentColor"
            />
        </svg>
    );
}
const IconComponent = convertIcon(SvgComponent, 'hard_drive_stroked');
export default IconComponent;
