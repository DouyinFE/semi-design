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
                d="M16.3176 6.95628V17.0878C16.3176 17.4871 15.8725 17.7253 15.5402 17.5038L7.94161 12.438C7.64474 12.2401 7.64474 11.8039 7.94161 11.606L15.5402 6.54025C15.8725 6.31873 16.3176 6.55693 16.3176 6.95628Z"
                fill="currentColor"
            />
        </svg>
    );
}

const IconComponent = convertIcon(SvgComponent, 'small_triangle_left');
export default IconComponent;
