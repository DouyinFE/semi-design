import React from 'react';
import { isFunction } from 'lodash';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { stepsClasses as css } from '@douyinfe/semi-foundation/steps/constants';
import { IconTickCircle, IconAlertCircle, IconAlertTriangle } from '@douyinfe/semi-icons';

export type Status = 'wait' | 'process' | 'finish' | 'error' | 'warning';
export type Size = 'default' | 'small';
export interface BasicStepProps {
    description?: React.ReactNode;
    icon?: React.ReactNode;
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
}
export enum stepSizeMapIconSize {
    small = 'large',
    default = 'extra-large'
}

const BasicStep = (props: BasicStepProps) => {
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
        icon,
        stepNumber,
        onClick,
        onChange,
        ...restProps
    } = props;
    const renderIcon = () => {
        let inner, progress;

        if ('icon' in props) {
            if (React.isValidElement(icon)) {
                inner = icon;
            }
        } else if ('status' in props) {
            switch (status) {
                case 'error':
                    inner = <IconAlertCircle size={stepSizeMapIconSize[size]} />;
                    break;
                case 'wait':
                    inner = <span className={`${prefixCls}-number-icon`}>{stepNumber}</span>;
                    break;
                case 'process':
                    inner = <span className={`${prefixCls}-number-icon`}>{stepNumber}</span>;
                    progress = true;
                    break;
                case 'finish':
                    inner = <IconTickCircle size={stepSizeMapIconSize[size]} />;
                    break;
                case 'warning':
                    inner = <IconAlertTriangle size={stepSizeMapIconSize[size]} />;
                    break;
                default:
                    inner = null;
                    break;
            }
        }
        const cls = classnames({
            [`${prefixCls}-icon`]: true,
            [`${prefixCls}-custom-icon`]: 'icon' in props,
            [`${prefixCls}-icon-process`]: progress,
        });

        return inner ? <span className={cls}>{inner}</span> : null;
    };
    const classString = classnames(prefixCls, className, `${prefixCls}-${status}`, {
        [`${prefixCls}-active`]: active,
        [`${prefixCls}-done`]: done
    });
    const handleClick = (e: React.MouseEvent) => {
        if (isFunction(onClick)) {
            onClick(e);
        }
        onChange();
    };
    return (
        <div {...restProps} className={classString} style={style} onClick={e => handleClick(e)}>
            <div className={`${prefixCls}-container`}>
                <div className={`${prefixCls}-left`}>{renderIcon()}</div>
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

BasicStep.propTypes = {
    prefixCls: PropTypes.string,
    description: PropTypes.node,
    icon: PropTypes.node,
    status: PropTypes.oneOf(['wait', 'process', 'finish', 'error', 'warning']),
    title: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    active: PropTypes.bool,
    done: PropTypes.bool,
};
BasicStep.defaultProps = {
    prefixCls: css.ITEM,
    active: false,
    done: false,
    status: 'wait',
    className: '',
};

export default BasicStep;
