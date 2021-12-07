import React from 'react';
import { isFunction } from 'lodash';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { stepsClasses as css } from '@douyinfe/semi-foundation/steps/constants';
import { IconTickCircle, IconAlertCircle, IconAlertTriangle } from '@douyinfe/semi-icons';

export type Status = 'wait' | 'process' | 'finish' | 'error' | 'warning';

export interface FillStepProps {
    description?: React.ReactNode;
    icon?: React.ReactNode;
    status?: Status;
    title?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    prefixCls?: string;
    stepNumber?: string;
    onChange?: () => void;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const FillStep = (props: FillStepProps) => {
    const { prefixCls, className, title, description, status, style, onClick, icon, onChange, stepNumber } = props;
    const renderIcon = () => {
        let inner, progress;

        if ('icon' in props) {
            inner = icon;
        } else if ('status' in props) {
            switch (status) {
                case 'error':
                    inner = <IconAlertCircle size="extra-large" />;
                    break;
                case 'wait':
                    inner = stepNumber;
                    break;
                case 'process':
                    inner = stepNumber;
                    progress = true;
                    break;
                case 'finish':
                    inner = <IconTickCircle size="extra-large" />;
                    break;
                case 'warning':
                    inner = <IconAlertTriangle size="extra-large" />;
                    break;
                default:
                    inner = null;
                    break;
            }
        }
        const cls = classnames({
            [`${prefixCls }-left`]: true,
            [`${prefixCls }-icon`]: 'icon' in props,
            [`${prefixCls }-plain`]: !('icon' in props),
            [`${prefixCls }-icon-process`]: progress,
        });

        return inner ? <div className={cls}>{inner}</div> : null;
    };
    const handleClick = (e: React.MouseEvent) => {
        if (isFunction(onClick)) {
            onClick(e);
        }
        onChange();
    };
    return (
        <div
            className={classnames({
                [className]: Boolean(className),
                [prefixCls]: true,
                [`${prefixCls}-${status}`]: Boolean(status),
                [`${prefixCls }-clickable`]: onClick,
            })}
            style={style}
            onClick={e => {
                handleClick(e);
            }}
        >
            {renderIcon()}
            <div className={`${prefixCls }-content`}>
                <div className={`${prefixCls }-title`} title={typeof title === 'string' ? title : null}>
                    <span className={`${prefixCls }-title-text`}>{title}</span>
                </div>
                <div
                    className={`${prefixCls }-description`}
                    title={typeof description === 'string' ? description : null}
                >
                    {description}
                </div>
            </div>
        </div>
    );
};

FillStep.propTypes = {
    prefixCls: PropTypes.string,
    description: PropTypes.node,
    icon: PropTypes.node,
    status: PropTypes.oneOf(['wait', 'process', 'finish', 'error', 'warning']),
    title: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
};
FillStep.defaultProps = {
    prefixCls: css.ITEM,
    status: 'wait',
    className: '',
};

export default FillStep;
