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
                d="M5 2.90101C5 2.09583 5.90303 1.62081 6.56653 2.07697L19.8014 11.1759C20.3794 11.5733 20.3794 12.4267 19.8014 12.824L6.56653 21.923C5.90303 22.3792 5 21.9041 5 21.0989V2.90101Z"
                fill="currentColor"
            />
        </svg>
    );
}

const IconComponent = convertIcon(SvgComponent, 'play');
export default IconComponent;
