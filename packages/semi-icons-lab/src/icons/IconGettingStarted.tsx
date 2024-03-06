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
            <circle cx={12} cy={12} r={11} fill="#4CC3FA" />
            <path
                d="M16.8983 11.3349C17.2744 11.7121 17.2744 12.2881 16.8983 12.6653C16.3205 13.2449 15.298 14.1515 13.7106 15.1755C12.2711 16.1041 11.033 16.6996 10.1839 17.0552C9.54099 17.3245 8.86333 16.9178 8.77288 16.2267C8.64377 15.2402 8.50004 13.7492 8.50004 12.0001C8.50004 10.251 8.64376 8.76006 8.77287 7.77356C8.86333 7.08239 9.54101 6.67574 10.1839 6.94502C11.033 7.30064 12.2712 7.89619 13.7106 8.82469C15.298 9.84867 16.3204 10.7553 16.8983 11.3349Z"
                fill="white"
            />
        </svg>
    );
}
const IconComponent = convertIcon(SvgComponent, 'getting-started');
export default IconComponent;
