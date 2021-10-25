// @ts-ignore  Currently there is no types for semi-animation-react
import { Transition } from '@douyinfe/semi-animation-react';
import React, { CSSProperties, JSXElementConstructor } from 'react';
import { NoticePosition } from '@douyinfe/semi-foundation/notification/notificationFoundation';
import { Motion } from '../_base/base';

export type ArgsType<T> = T extends (...args: infer A) => any ? A : never;

export interface NoticeTransitionProps{
    position?: NoticePosition;
    motion?: Motion<NoticeTransitionProps>;
    children?: JSXElementConstructor<any> | React.ReactChildren;
}

type NoticeTransitionFormatFuncType = (styles: { translate: string;opacity: string | number }) => any;

export default function NoticeTransition(props: NoticeTransitionProps = {}) {
    let { motion = {} } = props;
    const { position = 'topRight' } = props;

    const formatStyle = function formatStyle({ translate, opacity }: ArgsType<NoticeTransitionFormatFuncType>[0]) {
        let transform = `translateX(${translate}%)`;

        if (position && typeof position === 'string') {
            if (/left/i.test(position)) {
                transform = `translateX(${-translate}%)`;
            } else if (/right/i.test(position)) {
                transform = `translateX(${translate}%)`;
            } else if (/top/i.test(position)) {
                transform = `translateY(${-translate}%)`;
            } else {
                transform = `translateY(${translate}%)`;
            }
        }

        return {
            transform,
            opacity,
        };
    };

    if (typeof motion === 'function') {
        motion = motion(props);
    } else if (!motion || typeof motion !== 'object') {
        motion = {};
    }

    return (
        <Transition
            // onFrame={style => console.log(formatStyle(style))}
            from={{ translate: 100, opacity: 0 }}
            enter={{ translate: { val: 0, tension: 560, friction: 32 }, opacity: { val: 1, duration: 200 } } as any}
            leave={{
                translate: { val: 100, easing: 'easeOutCubic', duration: 300 },
                opacity: { val: 0, duration: 200 },
            } as any}
            {...motion}
        >
            {typeof props.children === 'function' ?
                (transitionStyle: ArgsType<NoticeTransitionFormatFuncType>[0]) =>
                    (props.children as ({ transform, opacity }:
                    { transform: CSSProperties['transform'];opacity: number | string }) => any)(
                        formatStyle(transitionStyle)
                    ) :
                props.children}
        </Transition>
    );
}
