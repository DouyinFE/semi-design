import React, { cloneElement, Children, useMemo, isValidElement, ReactElement } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import { stepsClasses as css } from '@douyinfe/semi-foundation/steps/constants';

export type Direction = 'horizontal' | 'vertical';
export type Status = 'wait' | 'process' | 'finish' | 'error' | 'warning';
export type Size = 'default' | 'small';
export interface BasicStepsProps {
    prefixCls?: string;
    className?: string;
    direction?: Direction;
    current?: number;
    initial?: number;
    status?: Status;
    style?: React.CSSProperties;
    size?: Size;
    hasLine?: boolean;
    children?: React.ReactNode;
    onChange?: (current: number) => void;
}

const Steps = (props: BasicStepsProps) => {
    const {
        size,
        current,
        status,
        children,
        prefixCls,
        initial,
        direction,
        className,
        style,
        hasLine,
        onChange,
    } = props;
    const inner = useMemo(() => {
        const filteredChildren = Children.toArray(children).filter(c => isValidElement(c)) as Array<ReactElement>;
        const content = Children.map(filteredChildren, (child: React.ReactElement, index) => {
            if (!child) {
                return null;
            }
            const stepNumber = initial + index;
            const childProps = {
                stepNumber: `${stepNumber + 1}`,
                size,
                ...child.props,
            };

            if (status === 'error' && index === current - 1) {
                childProps.className = `${prefixCls}-next-error`;
            }

            if (!child.props.status) {
                if (stepNumber === current) {
                    childProps.status = status;
                } else if (stepNumber < current) {
                    childProps.status = 'finish';
                } else {
                    childProps.status = 'wait';
                }
            }
            childProps.active = stepNumber === current;
            childProps.done = stepNumber < current;
            childProps.onChange = () => {
                if (index !== current) {
                    onChange(index + initial);
                }
            };
            return cloneElement(child, { ...childProps });
        });
        return content;
    }, [children, initial, prefixCls, direction, status, current, size]);

    const wrapperCls = cls(className, {
        [`${prefixCls}-basic`]: true,
        [`${prefixCls}-${direction}`]: true,
        [`${prefixCls}-${size}`]: size !== 'default',
        [`${prefixCls}-hasline`]: hasLine,
    });

    return (
        <div className={wrapperCls} style={style}>
            {inner}
        </div>
    );
};

Steps.propTypes = {
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    current: PropTypes.number,
    initial: PropTypes.number,
    direction: PropTypes.oneOf(['horizontal', 'vertical']),
    status: PropTypes.oneOf(['wait', 'process', 'finish', 'error', 'warning']),
    hasLine: PropTypes.bool,
};

Steps.defaultProps = {
    prefixCls: css.PREFIX,
    current: 0,
    direction: 'horizontal',
    size: '',
    initial: 0,
    hasLine: true,
    status: 'process',
};

export default Steps;
