import * as React from 'react';
import { convertIcon } from '../components/Icon';

function SvgComponent(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            focusable={false}
            aria-hidden={true}
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.125 3.125V20.1518L11.4833 16.8643C11.8074 16.6968 12.1926 16.6968 12.5167 16.8643L18.875 20.1518V3.125H5.125ZM2.875 3C2.875 1.82639 3.82639 0.875 5 0.875H19C20.1736 0.875 21.125 1.82641 21.125 3V22C21.125 22.3926 20.9203 22.7568 20.585 22.961C20.2496 23.1651 19.8321 23.1796 19.4833 22.9993L12 19.1301L4.5167 22.9993C4.16794 23.1796 3.75041 23.1651 3.41505 22.961C3.07968 22.7568 2.875 22.3926 2.875 22V3Z"
                fill="currentColor"
            />
        </svg>
    );
}

const IconComponent = convertIcon(SvgComponent, 'version_stroked');
export default IconComponent;
