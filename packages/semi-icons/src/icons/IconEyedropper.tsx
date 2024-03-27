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
                d="M6.41535 17.476C5.53266 16.5933 5.53729 15.1608 6.42567 14.2838L11.4474 9.32663L10.9388 8.81803C10.6459 8.52514 10.6459 8.05026 10.9388 7.75737C11.2317 7.46448 11.7066 7.46448 11.9995 7.75737L12.5149 8.27283L13.7709 7.03302C14.6512 6.16404 16.0679 6.16863 16.9425 7.04328C17.8252 7.92597 17.8206 9.35852 16.9322 10.2355L15.6969 11.4548L16.2421 12C16.535 12.2929 16.535 12.7678 16.2421 13.0607C15.9492 13.3536 15.4743 13.3536 15.1815 13.0607L14.6294 12.5086L9.58696 17.4863C8.70667 18.3552 7.29 18.3507 6.41535 17.476ZM12.5081 10.3873L13.5687 11.448L8.53318 16.4188C8.23976 16.7084 7.76755 16.7069 7.47601 16.4154C7.18179 16.1211 7.18333 15.6436 7.47945 15.3513L12.5081 10.3873Z"
                fill="currentColor"
            />
        </svg>
    );
}
const IconComponent = convertIcon(SvgComponent, 'eyedropper');
export default IconComponent;
