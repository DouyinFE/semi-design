import React, { useEffect, useState, Children, cloneElement, isValidElement } from 'react';
import { Transition } from '@douyinfe/semi-animation-react';
import PropTypes from 'prop-types';

const formatStyle = function formatStyle({ rotate = 0 }) {
    return ({
        transform: `rotate(${rotate}deg)`,
    });
};

export interface TransitionStyle {
    rotate?: number;
}

export interface OpenIconTransitionProps {
    isOpen?: boolean;
    children?: React.ReactNode;
    enterDeg?: number;
    fromDeg?: number;
    duration?: number;
}

function OpenIconTransition(props: OpenIconTransitionProps = {}): React.ReactElement {
    const { children, isOpen, enterDeg = 180, fromDeg = 0, duration = 150 } = props;

    const [immediate, setImmediate] = useState(true);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        setImmediate(false);
    }, [isOpen]);

    return (
        <Transition
            immediate={immediate}
            state={isOpen ? 'enter' : 'leave'}
            from={{ rotate: fromDeg }}
            enter={{ rotate: { val: enterDeg, duration, easing: 'cubic-bezier(.62, .05, .36, .95)' } }}
            leave={{ rotate: { val: fromDeg, duration, easing: 'cubic-bezier(.62, .05, .36, .95)' } }}
        >
            {(transitionStyle: TransitionStyle) =>
                Children.map(children, child => (isValidElement(child) ?
                    cloneElement(child, {
                        ...child.props,
                        style: {
                            ...child.props.style,
                            ...formatStyle(transitionStyle),
                        },
                    }) :
                    child))
            }
        </Transition>
    );
}

OpenIconTransition.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    children: PropTypes.any.isRequired,
    enterDeg: PropTypes.number,
    fromDeg: PropTypes.number,
    duration: PropTypes.number,
};

export default OpenIconTransition;
