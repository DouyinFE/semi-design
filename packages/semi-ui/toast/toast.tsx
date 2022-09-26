/* eslint-disable max-len */
import React, { CSSProperties } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import ConfigContext, { ContextValue } from '../configProvider/context';
import ToastFoundation, { ToastAdapter, ToastState, ToastProps } from '@douyinfe/semi-foundation/toast/toastFoundation';
import { numbers, cssClasses, strings } from '@douyinfe/semi-foundation/toast/constants';
import BaseComponent from '../_base/baseComponent';
import Button from '../iconButton/index';
import { IconClose, IconAlertTriangle, IconInfoCircle, IconTickCircle, IconAlertCircle } from '@douyinfe/semi-icons';
import { noop } from 'lodash';
import { isSemiIcon } from '../_utils';

const prefixCls = cssClasses.PREFIX;

export interface ToastReactProps extends ToastProps {
    style?: CSSProperties;
    icon?: React.ReactNode;
    content: React.ReactNode;
    onAnimationEnd?: (e:React.AnimationEvent) => void;
    onAnimationStart?: (e:React.AnimationEvent) => void;
}

class Toast extends BaseComponent<ToastReactProps, ToastState> {

    static contextType = ConfigContext;
    static propTypes = {
        onClose: PropTypes.func,
        content: PropTypes.node,
        close: PropTypes.func,
        duration: PropTypes.number,
        theme: PropTypes.oneOf(strings.themes),
        type: PropTypes.oneOf(strings.types),
        textMaxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        style: PropTypes.object,
        className: PropTypes.string,
        showClose: PropTypes.bool,
        icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        direction: PropTypes.oneOf(strings.directions),
    };

    static defaultProps = {
        onClose: noop,
        content: '',
        close: noop,
        duration: numbers.duration,
        textMaxWidth: 450,
        showClose: true,
        theme: 'normal'
    };

    constructor(props: ToastReactProps) {
        super(props);
        this.state = {};
        this.foundation = new ToastFoundation(this.adapter);
    }

    context: ContextValue;

    get adapter(): ToastAdapter {
        return {
            ...super.adapter,
            notifyWrapperToRemove: (id: string) => {
                this.props.close(id);
            },
            notifyClose: () => {
                this.props.onClose();
            },
        };
    }

    componentDidMount() {
        this.foundation.init();
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    close(e: React.MouseEvent) {
        this.foundation.close(e);
    }

    clearCloseTimer = () => {
        this.foundation.clearCloseTimer_();
    };

    startCloseTimer = () => {
        this.foundation.startCloseTimer_();
    };

    restartCloseTimer = () => {
        this.foundation.restartCloseTimer();
    }

    renderIcon() {
        const { type, icon } = this.props;
        const iconMap = {
            warning: <IconAlertTriangle />,
            success: <IconTickCircle />,
            info: <IconInfoCircle />,
            error: <IconAlertCircle />
        };
        const iconType = iconMap[type];
        const iconSize = 'large';
        const iconCls = cls(`${prefixCls}-icon`, `${prefixCls}-icon-${type}`);
        if (icon) {
            return isSemiIcon(icon) ? React.cloneElement((icon as React.ReactElement), { size: iconSize, className: `${prefixCls}-icon` }) : icon;
        }
        if (type && iconType) {
            return React.cloneElement(iconType, { size: iconSize, className: iconCls });
        }
        return null;
    }

    render() {
        const { content, type, theme, showClose, textMaxWidth, className, style } = this.props;
        const direction = this.props.direction || this.context.direction;
        const toastCls = cls(prefixCls, className, {
            [`${prefixCls}-${type}`]: true,
            [`${prefixCls}-${theme}`]: theme === 'light',
            [`${prefixCls}-rtl`]: direction === 'rtl',
        });
        const textStyle: CSSProperties = {};
        textStyle.maxWidth = textMaxWidth;
        const btnTheme = 'borderless';
        const btnSize = 'small';
        return (
            <div
                role="alert"
                aria-label={`${type ? type : 'default'} type`}
                className={toastCls}
                style={style}
                onMouseEnter={this.clearCloseTimer}
                onMouseLeave={this.startCloseTimer}
                onAnimationStart={this.props.onAnimationStart}
                onAnimationEnd={this.props.onAnimationEnd}
            >
                <div className={`${prefixCls}-content`}>
                    {this.renderIcon()}
                    <span className={`${prefixCls}-content-text`} style={textStyle} x-semi-prop="content">
                        {content}
                    </span>
                    {showClose && (
                        <div className={`${prefixCls}-close-button`}>
                            <Button
                                onClick={e => this.close(e)}
                                type="tertiary"
                                icon={<IconClose x-semi-prop="icon" />}
                                theme={btnTheme}
                                size={btnSize}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default Toast;
