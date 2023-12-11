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
            <g clipPath="url(#clip0_1_3028)">
                <rect
                    x={3.051}
                    y={2.888}
                    width={16}
                    height={21}
                    rx={2}
                    transform="rotate(-6 3.05081 2.88827)"
                    fill="#FF7D95"
                />
                <rect
                    x={5.249}
                    y={4.668}
                    width={12}
                    height={17}
                    rx={1}
                    transform="rotate(-6 5.2489 4.66825)"
                    fill="white"
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.3094 0.909647L13.886 0.743932C14.4353 0.686203 14.9273 1.08467 14.9851 1.63393L15.2987 4.61749L7.34248 5.45372L7.0289 2.47015C6.97117 1.92089 7.36963 1.42883 7.91889 1.3711L9.49556 1.20539C9.63945 0.60446 10.1484 0.131264 10.7979 0.0629958C11.4475 -0.00527278 12.0437 0.351766 12.3094 0.909647Z"
                    fill="#AAB2BF"
                />
                <rect x={7.656} y={8.437} width={8} height={2} transform="rotate(-6 7.65607 8.43729)" fill="#DDE3E8" />
                <rect x={8.074} y={12.415} width={8} height={2} transform="rotate(-6 8.07417 12.4154)" fill="#DDE3E8" />
                <rect
                    x={8.492}
                    y={16.393}
                    width={3.35025}
                    height={2}
                    transform="rotate(-6 8.49229 16.3935)"
                    fill="#DDE3E8"
                />
                <path
                    d="M20.0336 9.94762L15.1077 14.9076C15.0165 14.9977 14.9448 15.1053 14.8969 15.2237L14.0353 17.3532C13.8798 17.7375 14.2655 18.1188 14.6542 17.9651L16.8082 17.1133C16.9279 17.0659 17.0367 16.995 17.1279 16.9049L22.0538 11.9449L20.0336 9.94762Z"
                    fill="#6A6F7F"
                />
                <path
                    d="M22.0538 11.9449L22.7211 11.2731C23.093 10.9054 23.093 10.3092 22.7211 9.94153L22.0477 9.27577C21.6758 8.90808 21.0728 8.90808 20.7009 9.27577L20.0336 9.94762L22.0538 11.9449Z"
                    fill="#6A6F7F"
                />
            </g>
            <defs>
                <clipPath id="clip0_1_3028">
                    <rect width={24} height={24} fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}
const IconComponent = convertIcon(SvgComponent, 'form');
export default IconComponent;
