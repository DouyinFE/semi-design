// @ts-ignore  Currently there is no types for semi-animation-react
import { Transition } from '@douyinfe/semi-animation-react';
import { Motion } from '../_base/base';
import React, { CSSProperties } from 'react';


export interface ToastTransitionProps{
    motion?: Motion<ToastTransitionProps>;
    children?: React.ReactChildren | React.JSXElementConstructor<any>;
}


export default function ToastTransition(props: ToastTransitionProps = {}) {
    let { motion = {} } = props;

    if (typeof motion === 'function') {
        motion = motion(props);
    } else if (!motion || typeof motion !== 'object') {
        motion = {};
    }

    return (
        <Transition
            // onFrame={style => console.log(style)}
            from={{ translateY: -100, opacity: 0 }}
            enter={{ translateY: { val: 0, tension: 560, friction: 32 }, opacity: { val: 1, duration: 300 } } as any}
            leave={{
                translateY: { val: -100, easing: 'easeOutCubic', duration: 300 },
                opacity: { val: 0, duration: 200 },
            } as any}
            {...motion}
        >
            {typeof props.children === 'function' ?
                ({ translateY, opacity }: { translateY: string | number; opacity: string | number }) =>
                    (props.children as
                        (styles: { transform: CSSProperties['transform']; opacity: string | number }) => any)({
                        transform: `translateY(${translateY}%)`,
                        opacity,
                    }) :
                props.children}
        </Transition>
    );
}
