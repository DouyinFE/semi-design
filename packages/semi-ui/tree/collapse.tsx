/* eslint-disable arrow-body-style */
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Transition } from '@douyinfe/semi-animation-react';
import PropTypes from 'prop-types';
import { noop } from 'lodash-es';
import { cssClasses } from '@douyinfe/semi-foundation/collapsible/constants';
import getMotionObjFromProps from '@douyinfe/semi-foundation/utils/getMotionObjFromProps';

export interface CollapseProps {
    [x: string]: any;
    motion?: boolean;
    children?: React.ReactNode[];
    duration?: number;
    onMotionEnd?: () => void;
    motionType?: string;
}

export interface TransitionStyle {
    [x: string]: any;
    maxHeight?: number;
}

const ease = 'cubicBezier(.25,.1,.25,1)';

const Collapse = (props: CollapseProps) => {
    const {
        motion,
        children,
        duration,
        onMotionEnd,
        motionType,
    } = props;

    const ref = useRef(null);
    const [maxHeight, setMaxHeight] = useState(0);
    // cache last state
    const [open, setOpen] = useState(true);
    const [left, setLeft] = useState(false);
    const [immediateAttr, setImmediateAttr] = useState(false);

    useEffect(() => {
        if (motionType === 'enter') {
            !open && setOpen(true);
            left && setLeft(false);
        } else if (motionType === 'leave') {
            !open && setOpen(true);
            !immediateAttr && setImmediateAttr(true);
            left && setLeft(false);
        }
    }, [motionType]);

    const setHeight = useCallback(node => {
        const currHeight = node && node.scrollHeight;
        if (currHeight && maxHeight !== currHeight) {
            setMaxHeight(currHeight);
        }
    }, [left]);

    const resetHeight = () => {
        ref.current.style.maxHeight = 'none';
    };

    const formatStyle = (style: TransitionStyle) => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const { maxHeight } = style;
        return { maxHeight };
    };

    const renderChildren = (transitionStyle: TransitionStyle) => {
        const transition =
            transitionStyle && typeof transitionStyle === 'object' ? formatStyle(transitionStyle) : {};

        const style = {
            overflow: 'hidden',
            maxHeight: open ? 'none' : 0,
            ...transition,
        };
        return (
            <div style={style} className={`${cssClasses.PREFIX}-wrapper`} ref={ref}>
                <div ref={setHeight}>{children}</div>
            </div>
        );
    };
    const didLeave = () => {
        setLeft(true);
        setMaxHeight(0);
        motionType === 'leave' && onMotionEnd();
    };

    const onImmediateEnter = () => {
        open && setOpen(false);
        setImmediateAttr(false);
    };

    const didEnter = () => {
        resetHeight();
        immediateAttr && onImmediateEnter();
        motionType === 'enter' && onMotionEnd();
    };

    const renderContent = () => {
        if (left) {
            return null;
        }

        const mergeMotion = getMotionObjFromProps({
            didEnter,
            didLeave,
            motion,
        });

        return motion ? (
            <Transition
                state={open ? 'enter' : 'leave'}
                immediate={immediateAttr}
                from={{ maxHeight: 0 }}
                enter={{ maxHeight: { val: maxHeight, easing: ease, duration } }}
                leave={{ maxHeight: { val: 0, easing: ease, duration } }}
                {...mergeMotion}
            >
                {(transitionStyle: TransitionStyle) => renderChildren(transitionStyle)}
            </Transition>
        ) : (
            renderChildren(null)
        );
    };

    return renderContent();
};

Collapse.propType = {
    motion: PropTypes.oneOfType([PropTypes.bool, PropTypes.func, PropTypes.object]),
    children: PropTypes.node,
    duration: PropTypes.number,
    onMotionEnd: PropTypes.func,
};

Collapse.defaultProps = {
    duration: 250,
    motion: true,
    onMotionEnd: noop,
};

export default Collapse;