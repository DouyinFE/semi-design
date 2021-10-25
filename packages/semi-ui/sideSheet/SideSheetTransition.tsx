// @ts-ignore  Currently there is no types definition for semi-animation-react;
import { Transition } from '@douyinfe/semi-animation-react';
import React, { CSSProperties } from 'react';
import { Motion } from '../_base/base';

export interface SideSheetTransitionProps{
    children?: React.ReactChildren | React.JSXElementConstructor<any>;
    motion?: Motion<SideSheetTransitionProps>;
    controlled?: boolean;
    visible?: boolean;
    placement?: 'left' | 'top' | 'right' | 'bottom';
}

// eslint-disable-next-line max-len
const formatStyles = function formatStyles(styles: CSSProperties = {}, props: SideSheetTransitionProps = {}): CSSProperties {
    const { placement } = props;
    const { translate } = styles;
    const { opacity } = styles;

    let transform = '';

    switch (placement) {
        case 'left':
            transform = `translateX(-${translate}%)`;
            break;
        case 'top':
            transform = `translateY(-${translate}%)`;
            break;
        case 'right':
            transform = `translateX(${translate}%)`;
            break;
        case 'bottom':
            transform = `translateY(${translate}%)`;
            break;
        default:
            break;
    }

    return {
        transform,
        opacity,
    };
};

export default class SideSheetTransition extends React.PureComponent<SideSheetTransitionProps> {
    render() {

        let { motion = {} } = this.props;
        const {
            children,
            controlled = false,
            visible,
        } = this.props;

        if (typeof motion === 'function') {
            motion = motion(this.props);
        } else if (!motion || typeof motion !== 'object') {
            motion = {};
        }
        let extra = {};
        if (controlled) {
            extra = {
                state: visible ? 'enter' : 'leave',
            };
        }

        return (
            <Transition
                config={{
                    tension: 170,
                    friction: 14,
                    easing: 'linear',
                    duration: 200,
                }}
                from={{
                    translate: 100,
                    opacity: {
                        val: 0,
                        duration: 180,
                    },
                }}
                enter={{
                    translate: 0,
                    opacity: {
                        val: 1,
                        duration: 180,
                    },
                } as any}
                leave={{
                    translate: 100,
                    opacity: {
                        val: 0,
                        duration: 180,
                    },
                } as any}
                {...extra}
                {...motion}
            >
                {/* eslint-disable-next-line max-len */}
                {typeof children === 'function' ? (styles: CSSProperties) => (children as (styles: CSSProperties) => any)(formatStyles(styles, this.props)) : children}
            </Transition>
        );
    }
}
