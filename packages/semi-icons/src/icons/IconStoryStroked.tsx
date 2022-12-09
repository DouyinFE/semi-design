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
                d="M20.36 12C20.36 16.6171 16.6171 20.36 12 20.36C7.3829 20.36 3.64 16.6171 3.64 12C3.64 7.3829 7.3829 3.64 12 3.64C16.6171 3.64 20.36 7.3829 20.36 12ZM23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM17.5534 9.85334C18.0689 9.33784 18.0689 8.50207 17.5534 7.98657C17.0379 7.47108 16.2021 7.47108 15.6866 7.98657L10.02 13.6532L7.65338 11.2866C7.13789 10.7711 6.30211 10.7711 5.78662 11.2866C5.27113 11.8021 5.27113 12.6378 5.78662 13.1533L9.08662 16.4533C9.33417 16.7009 9.66992 16.84 10.02 16.84C10.3701 16.84 10.7058 16.7009 10.9534 16.4533L17.5534 9.85334Z"
                fill="currentColor"
            />
        </svg>
    );
}

const IconComponent = convertIcon(SvgComponent, 'story_stroked');
export default IconComponent;
