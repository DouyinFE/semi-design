import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { stepsClasses as css } from '@douyinfe/semi-foundation/steps/constants';

export type Status = 'wait' | 'process' | 'finish' | 'error' | 'warning';
export type Size = 'default' | 'small';

export interface DotStepProps {
    description?: React.ReactNode;
    status?: Status;
    title?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    active?: boolean;
    prefixCls?: string;
    stepNumber?: string;
    size?: Size;
    done?: boolean;
    onChange?: () => void;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
    role?: React.AriaRole;
    'aria-label'?: React.AriaAttributes['aria-label']
}

const DotStep = (props: DotStepProps) => {
    const {
        prefixCls,
        className,
        size,
        title,
        description,
        status,
        style,
        active,
        done,
        onClick,
        onChange,
        onKeyDown,
    } = props;

    const classString = classnames(prefixCls, `${prefixCls}-${status}`, {
        [`${prefixCls}-active`]: active,
        [`${prefixCls}-done`]: done,
        [`${prefixCls}-hover`]: onChange || props.onClick,
        [`${prefixCls}-clickable`]: onChange || onClick,
        [`${prefixCls}-${status}-hover`]: onChange || props.onClick,
    }, className);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        onClick?.(e);
        onChange?.();
    };
    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            onKeyDown?.(e);
            onChange?.();
        }
    };

    return (
        <div
            role={props.role}
            aria-label={props['aria-label']}
            tabIndex={0}
            aria-current="step"
            className={classString}
            style={style}
            onClick={e => handleClick(e)}
            onKeyDown={handleKeyDown}
        >
            <div className={`${prefixCls}-container`}>
                <div className={`${prefixCls}-dot`} />
                <div className={`${prefixCls}-content`}>
                    <div className={`${prefixCls}-title`}>
                        <div className={`${prefixCls}-title-text`}>{title}</div>
                    </div>
                    {description && <div className={`${prefixCls}-description`}>{description}</div>}
                </div>
            </div>
        </div>
    );
};

DotStep.propTypes = {
    prefixCls: PropTypes.string,
    description: PropTypes.node,
    status: PropTypes.oneOf(['wait', 'process', 'finish', 'error', 'warning']),
    title: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    active: PropTypes.bool,
    done: PropTypes.bool,
};

DotStep.defaultProps = {
    prefixCls: css.ITEM,
    active: false,
    done: false,
    status: 'wait',
    className: '',
};

export default DotStep;

