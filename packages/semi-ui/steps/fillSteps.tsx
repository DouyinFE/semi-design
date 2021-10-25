import React, { cloneElement, Children, useMemo } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import { stepsClasses as css } from '@douyinfe/semi-foundation/steps/constants';
import { Row, Col } from '../grid';

export type Status = 'wait' | 'process' | 'finish' | 'error' | 'warning';
export type Direction = 'horizontal' | 'vertical';
export interface FillStepsProps {
    prefixCls?: string;
    className?: string;
    current?: number;
    direction?: Direction;
    initial?: number;
    status?: Status;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onChange?: (current: number) => void;
}

const Steps = (props: FillStepsProps) => {
    const { current, status, children, prefixCls, initial, direction, className, style, onChange } = props;
    const inner = useMemo(() => {
        const filteredChildren = Children.toArray(children).filter(c => Boolean(c));
        const colStyle = direction === 'vertical' ? null : { width: `${100 / filteredChildren.length }%` };
        const content = Children.map(filteredChildren, (child: React.ReactElement, index) => {
            if (!child) {
                return null;
            }
            const stepNumber = initial + index;
            const childProps = {
                stepNumber: `${stepNumber + 1}`,
                direction,
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
            childProps.onChange = () => {
                if (index !== current) {
                    onChange(index + initial);
                }
            };
            return <Col style={colStyle}>{cloneElement(child, { ...childProps })}</Col>;
        });
        return content;
    }, [children, initial, prefixCls, direction, status, current]);

    const wrapperCls = cls(className, {
        [prefixCls]: true,
        [`${prefixCls}-${ direction}`]: true
    });

    return (
        <div
            className={wrapperCls}
            style={style}
        >
            <Row type="flex" justify="start">
                {inner}
            </Row>
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
    status: PropTypes.oneOf(['wait', 'process', 'finish', 'error', 'warning'])
};

Steps.defaultProps = {
    prefixCls: css.PREFIX,
    current: 0,
    direction: 'horizontal',
    initial: 0,
    status: 'process',
};

export default Steps;
