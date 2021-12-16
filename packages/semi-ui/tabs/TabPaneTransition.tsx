/* eslint-disable react/destructuring-assignment */
import React, { FC, ReactNode } from 'react';
import { Transition } from '@douyinfe/semi-animation-react';
import { toInteger } from 'lodash';
import { TabPaneTransitionProps } from './interface';

const TabPaneTransition: FC<TabPaneTransitionProps> = (props = {}) => {
    const direction = props.direction ? 1 : -1;
    const { mode } = props;
    let { motion } = props;

    const ratio = 60;

    if (typeof motion === 'function') {
        motion = motion(props);
    } else if (!motion || typeof motion !== 'object') {
        motion = {};
    }

    if (mode === 'vertical') {
        return (
            <Transition
                {...props}
                config={{ tension: 612, friction: 32 }}
                from={{ translateY: direction * ratio, opacity: 0 }}
                enter={{ translateY: 0, opacity: { val: 1, duration: 200 } } as any}
                leave={{ translateY: -1 * direction * ratio, opacity: { val: 0, duration: 200 } } as any}
                {...motion}
            >
                {typeof props.children === 'function' ?
                    ({ translateY, opacity }: { translateY: number;opacity: number }): ReactNode => {
                        // delete translateX in 0 in case of zIndex problems.
                        const finalState = toInteger(translateY) === 0 ? { opacity } : {
                            transform: `translateY(${toInteger(translateY)}px)`,
                            opacity,
                        };
                        return props.children(finalState);
                    } :
                    props.children}
            </Transition>
        );
    }

    return (
        <Transition
            {...props}
            config={{ tension: 612, friction: 32 }}
            from={{ translateX: direction * ratio, opacity: 0 }}
            enter={{ translateX: 0, opacity: { val: 1, duration: 200 } } as any}
            leave={{ translateX: -1 * direction * ratio, opacity: { val: 0, duration: 200 } } as any}
            {...motion}
        >
            {typeof props.children === 'function' ?
                ({ translateX, opacity }: { translateX: number;opacity: number }): ReactNode => {
                    // delete translateX in 0 in case of zIndex problems.
                    const finalState = toInteger(translateX) === 0 ? { opacity } : {
                        transform: `translateX(${toInteger(translateX)}px)`,
                        opacity,
                    };
                    return props.children(finalState);
                } :
                props.children}
        </Transition>
    );
};

export default TabPaneTransition;