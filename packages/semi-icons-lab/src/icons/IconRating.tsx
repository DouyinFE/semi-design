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
            <g clipPath="url(#clip0_1_3049)">
                <path
                    d="M7.92633 5.50269C8.1449 4.94209 8.8675 4.79102 9.29235 5.21711L12.9092 8.84444L18.04 9.10898C18.6461 9.14023 19.0164 9.78822 18.7357 10.3262L16.3729 14.8549L17.6749 19.73C17.8341 20.3259 17.313 20.8821 16.708 20.7621L11.6182 19.7524L7.35916 22.7165C6.85292 23.0688 6.15267 22.768 6.05977 22.1582L5.29971 17.1698L1.32061 13.967C0.847879 13.5865 0.927602 12.8444 1.47037 12.573L6.06555 10.2752L7.92633 5.50269Z"
                    fill="#FBCD2C"
                />
                <path
                    d="M19.9373 1.13616C20.1413 0.97521 20.4435 1.07701 20.5085 1.32861L21.0619 3.47049L22.9147 4.69129C23.1335 4.83549 23.1297 5.1578 22.9075 5.29675L21.0371 6.46633L20.4556 8.56653C20.3845 8.82324 20.0688 8.91638 19.8697 8.73936L18.1952 7.25006L15.9609 7.42226C15.6953 7.44273 15.5003 7.17753 15.5991 6.93015L16.4072 4.9063L15.626 2.84325C15.5332 2.59816 15.7252 2.33925 15.9867 2.3569L18.2005 2.50634L19.9373 1.13616Z"
                    fill="#DDE3E8"
                />
            </g>
            <defs>
                <clipPath id="clip0_1_3049">
                    <rect width={24} height={24} fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}
const IconComponent = convertIcon(SvgComponent, 'rating');
export default IconComponent;
