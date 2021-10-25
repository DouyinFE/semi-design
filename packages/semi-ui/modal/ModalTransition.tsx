// @ts-ignore Temporarily do not proceed  the action package ts
import { Transition } from '@douyinfe/semi-animation-react';
import React, { JSXElementConstructor, ReactChildren } from 'react';
import { Motion } from '../_base/base';

interface ContentTransitionProps {
    // eslint-disable-next-line max-len
    motion?: Motion<ContentTransitionProps>;
    children?: ReactChildren | JSXElementConstructor<any>;
    controlled?: boolean;
    visible?: boolean;
}

export default function ContentTransition(props: ContentTransitionProps = {}) {
    const { motion: motionFromProps, children, controlled, visible } = props;
    let motion = motionFromProps;
    let extra = {};
    if (typeof motion === 'function') {
        motion = motion(props);
    } else if (!motion || typeof motion !== 'object') {
        motion = {};
    }

    if (controlled) {
        extra = {
            // immediate: true,
            state: visible ? 'enter' : 'leave',
        };
    }

    return (
        <Transition
            config={{ tension: 600, friction: 30 } as any}
            from={{ scale: 0.7, opacity: { val: 0, duration: 180 } }}
            enter={{ scale: { val: 1 }, opacity: { val: 1, duration: 90 } } as any}
            leave={{ scale: { val: 0.7 }, opacity: { val: 0, duration: 75 } } as any}
            {...extra}
            {...motion}
        >
            {children}
        </Transition>
    );
}
