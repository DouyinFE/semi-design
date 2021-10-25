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
                d="M14.4999 4.49994L19.4999 9.49994L21.5857 7.41416C22.3667 6.63311 22.3667 5.36678 21.5857 4.58573L19.4141 2.41415C18.6331 1.63311 17.3667 1.63311 16.5857 2.41416L14.4999 4.49994Z"
                fill="currentColor"
            />
            <path
                d="M2.24715 21.1346L3.92871 15.2491C3.9754 15.0857 4.06296 14.9369 4.18313 14.8167L12.9999 5.99994L17.9999 10.9999L9.18313 19.8167C9.06296 19.9369 8.91415 20.0244 8.75074 20.0711L2.86527 21.7527C2.48809 21.8605 2.13938 21.5117 2.24715 21.1346Z"
                fill="currentColor"
            />
        </svg>
    );
}

const IconComponent = convertIcon(SvgComponent, 'edit');
export default IconComponent;
