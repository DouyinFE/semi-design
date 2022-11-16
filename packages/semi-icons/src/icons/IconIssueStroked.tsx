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
            <g clipPath="url(#clip0_1477_35)">
                <path fillRule="evenodd" clipRule="evenodd" d="M4.13344 4.13343C6.14546 2.12144 8.92825 0.875 12 0.875C15.0718 0.875 17.8545 2.12144 19.8665 4.13343C21.8785 6.14545 23.125 8.92825 23.125 12C23.125 15.0718 21.8785 17.8545 19.8665 19.8665C17.8545 21.8785 15.0718 23.125 12 23.125C8.92825 23.125 6.14546 21.8785 4.13344 19.8666C2.12145 17.8545 0.875 15.0718 0.875 12C0.875 8.92825 2.12146 6.14545 4.13344 4.13343ZM5.72442 5.72443C5.72441 5.72444 5.72442 5.72443 5.72442 5.72443C7.33174 4.11714 9.54896 3.125 12 3.125C14.451 3.125 16.6683 4.11714 18.2756 5.72443C19.8829 7.33174 20.875 9.54896 20.875 12C20.875 14.451 19.8829 16.6683 18.2756 18.2756C16.6683 19.8829 14.451 20.875 12 20.875C9.54896 20.875 7.33174 19.8829 5.72443 18.2756C4.11714 16.6683 3.125 14.451 3.125 12C3.125 9.54896 4.11713 7.33175 5.72442 5.72443Z" fill="currentColor" />
                <path fillRule="evenodd" clipRule="evenodd" d="M12 18.5C12.6904 18.5 13.25 17.9404 13.25 17.25C13.25 16.5597 12.6904 16 12 16C11.3097 16 10.75 16.5597 10.75 17.25C10.75 17.9404 11.3097 18.5 12 18.5Z" fill="currentColor" />
                <path fillRule="evenodd" clipRule="evenodd" d="M12 4.875C12.6213 4.875 13.125 5.37868 13.125 6V14C13.125 14.6213 12.6213 15.125 12 15.125C11.3787 15.125 10.875 14.6213 10.875 14V6C10.875 5.37868 11.3787 4.875 12 4.875Z" fill="currentColor" />
            </g>
            <defs>
                <clipPath id="clip0_1477_35">
                    <rect width="24" height="24" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}

const IconComponent = convertIcon(SvgComponent, 'issue_stroked');
export default IconComponent;
