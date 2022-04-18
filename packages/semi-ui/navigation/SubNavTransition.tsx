import { Transition } from '@douyinfe/semi-animation-react';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Motion } from '@douyinfe/semi-foundation/utils/type';

const ease = 'cubicBezier(.25,.1,.25,1)';

const formatStyle = function formatStyle({ maxHeight, opacity }: { maxHeight: number; opacity: number }) {
    return {
        maxHeight,
        opacity,
    };
};

export interface SubNavTransitionProps {
    children?: React.ReactNode | ((transitionProps?: any) => React.ReactNode);
    isCollapsed?: boolean;
    maxHeight?: number;
    motion?: Motion;
}

function SubNavTransition(props: SubNavTransitionProps = {}) {
    const { children, isCollapsed, maxHeight = 999 } = props;
    // eslint-disable-next-line no-unused-vars
    const [immediate, setImmediate] = useState(false);

    // useEffect(() => {
    //     setImmediate(isCollapsed);
    // }, [isCollapsed]);

    return (
        <Transition
            from={{ maxHeight: 0, opacity: 0 }}
            enter={{
                maxHeight: { val: maxHeight, easing: 'easeInQuad', duration: 250 },
                opacity: { val: 1, duration: 200, easing: 'cubic-bezier(0.5, -0.1, 1, 0.4)' },
            }}
            leave={{
                maxHeight: { val: 0, easing: ease, duration: 250 },
                opacity: {
                    val: 0,
                    duration: isCollapsed ? 1 : 200, // Need to be fast and transparent when put away, otherwise there will be jumping
                    easing: 'cubic-bezier(0.5, -0.1, 1, 0.4)',
                },
            }}
            immediate={immediate}
        >
            {typeof children === 'function' ? (transitionStyle: { maxHeight: number; opacity: number }) => children(formatStyle(transitionStyle)) : children}
        </Transition>
    );
}

SubNavTransition.propTypes = {
    children: PropTypes.any,
    isCollapsed: PropTypes.bool,
};

export default SubNavTransition;
