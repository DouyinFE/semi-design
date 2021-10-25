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
                d="M7.89944 20.166C7.39355 19.6962 7.36426 18.9053 7.83401 18.3994L13.5442 12.25L7.83401 6.10056C7.36426 5.59467 7.39355 4.80376 7.89944 4.334C8.40533 3.86425 9.19624 3.89354 9.666 4.39943L16.166 11.3994C16.6113 11.879 16.6113 12.621 16.166 13.1006L9.666 20.1006C9.19624 20.6064 8.40533 20.6357 7.89944 20.166Z"
                fill="currentColor"
            />
        </svg>
    );
}

const IconComponent = convertIcon(SvgComponent, 'chevron_right_stroked');
export default IconComponent;
