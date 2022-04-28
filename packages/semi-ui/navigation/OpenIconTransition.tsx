import React, { useEffect, useState } from 'react';
import { Transition } from '@douyinfe/semi-animation-react';
import PropTypes from 'prop-types';

const formatStyle = function formatStyle({ rotate = 0 }) {
    return {
        transform: `rotate(${Math.ceil(rotate)}deg)`,
    };
};

export interface OpenIconTransitionProps {
    children?: React.ReactNode |  ((transitionArgus?: any) => React.ReactNode);
    isCollapsed?: boolean;
    isOpen?: boolean;
}

function OpenIconTransition(props: OpenIconTransitionProps = {}) {
    const { children, isOpen } = props;

    const [immediate, setImmediate] = useState(true);

    useEffect(() => {
        setImmediate(false);
    }, []);

    return (
        <Transition
            immediate={immediate}
            state={isOpen ? 'enter' : 'leave'}
            from={{ rotate: 0 }}
            enter={{ rotate: { val: 180, duration: 200, easing: 'cubic-bezier(.62, .05, .36, .95)' } }}
            leave={{ rotate: { val: 0, duration: 200, easing: 'cubic-bezier(.62, .05, .36, .95)' } }}
        >
            {(transitionStyle: any) => {
                const formatedStyle = formatStyle(transitionStyle);
                if (typeof children === 'function') {
                    return children(formatedStyle);
                }
                if (React.isValidElement(children)) {
                    return React.cloneElement(children, {
                        style: {
                            ...(children.props && children.props.style),
                            ...formatedStyle,
                        },
                    });
                }
                return children;
            }}
        </Transition>
    );
}

OpenIconTransition.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    children: PropTypes.any.isRequired,
};

export default OpenIconTransition;
