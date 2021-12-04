import React, { cloneElement, Children, useMemo, isValidElement, ReactElement } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import { stepsClasses as css } from '@douyinfe/semi-foundation/steps/constants';

export type Size = 'default' | 'small';
export interface NavStepsProps {
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
    current?: number;
    initial?: number;
    size?: Size;
    children?: React.ReactNode;
    onChange?: (current: number) => void;
}

const Steps = (props: NavStepsProps) => {
    const { size, current, initial, children, prefixCls, className, style, onChange } = props;
    const inner = useMemo(() => {
        const filteredChildren = Children.toArray(children).filter(c => isValidElement(c)) as Array<ReactElement>;
        const total = filteredChildren.length;
        const content = Children.map(filteredChildren, (child: React.ReactElement, index) => {
            if (!child) {
                return null;
            }
            const childProps = {
                index,
                total,
                ...child.props,
            };
            childProps.active = index === current;
            childProps.onChange = () => {
                if (index !== current) {
                    onChange(index + initial);
                }
            };
            return cloneElement(child, { ...childProps });
        });
        return content;
    }, [children, prefixCls, current, size]);

    const wrapperCls = cls(className, {
        [`${prefixCls}-nav`]: true,
        [`${prefixCls}-${size}`]: size !== 'default',
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
    size: PropTypes.oneOf(['small', 'default']),
};

Steps.defaultProps = {
    prefixCls: css.PREFIX,
    current: 0,
    direction: 'horizontal',
    size: 'default',
    initial: 0,
    status: 'process',
};

export default Steps;
