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
                d="M12.6185 4.39653C13.1272 4.92524 13.1272 5.78245 12.6185 6.31116L7.14483 12L12.6185 17.6888C13.1272 18.2176 13.1272 19.0748 12.6185 19.6035C12.1098 20.1322 11.285 20.1322 10.7763 19.6035L4.38153 12.9573C3.87282 12.4286 3.87282 11.5714 4.38153 11.0427L10.7763 4.39653C11.285 3.86782 12.1098 3.86782 12.6185 4.39653Z"
                fill="currentColor"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.6185 4.39653C20.1272 4.92524 20.1272 5.78245 19.6185 6.31116L14.1448 12L19.6185 17.6888C20.1272 18.2176 20.1272 19.0748 19.6185 19.6035C19.1098 20.1322 18.285 20.1322 17.7763 19.6035L11.3815 12.9573C10.8728 12.4286 10.8728 11.5714 11.3815 11.0427L17.7763 4.39653C18.285 3.86782 19.1098 3.86782 19.6185 4.39653Z"
                fill="currentColor"
            />
        </svg>
    );
}

const IconComponent = convertIcon(SvgComponent, 'double_chevron_left');
export default IconComponent;
