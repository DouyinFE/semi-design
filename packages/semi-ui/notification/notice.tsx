/* eslint-disable no-unreachable */
import React from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import ConfigContext from '../configProvider/context';
import { numbers, cssClasses, strings } from '@douyinfe/semi-foundation/notification/constants';
import NotificationFoundation, {
    NoticeAdapter,
    NoticeState,
    NoticeProps
} from '@douyinfe/semi-foundation/notification/notificationFoundation';
import Button from '../iconButton';
import BaseComponent from '../_base/baseComponent';
import { isSemiIcon } from '../_utils';
import { noop } from 'lodash';
import { IconAlertTriangle, IconInfoCircle, IconTickCircle, IconAlertCircle, IconClose } from '@douyinfe/semi-icons';

export interface NoticeReactProps extends NoticeProps{
    style?: React.CSSProperties;
    title?: React.ReactNode;
    content?: React.ReactNode;
    icon?: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
}

const prefixCls = cssClasses.NOTICE;
const { duration } = numbers;
const { types, themes, directions } = strings;

class Notice extends BaseComponent<NoticeReactProps, NoticeState> {
    static contextType = ConfigContext;
    static propTypes = {
        duration: PropTypes.number,
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        title: PropTypes.node,
        content: PropTypes.node, // strings、numbers、array、element
        type: PropTypes.oneOf(types),
        theme: PropTypes.oneOf(themes),
        icon: PropTypes.node,
        onClick: PropTypes.func,
        onClose: PropTypes.func,
        onCloseClick: PropTypes.func,
        showClose: PropTypes.bool,
        // private props
        close: PropTypes.func,
        direction: PropTypes.oneOf(directions),
    };

    static defaultProps = {
        duration,
        id: '',
        close: noop,
        onClose: noop,
        onClick: noop,
        onCloseClick: noop,
        content: '',
        title: '',
        showClose: true,
        theme: 'normal',
    };

    get adapter(): NoticeAdapter {
        return {
            ...super.adapter,
            notifyWrapperToRemove: (id: string) => {
                this.props.close(id);
            },
            notifyClose: () => {
                this.props.onClose();
                this.props.onHookClose && this.props.onHookClose();
            },
        };
    }

    constructor(props: NoticeReactProps) {
        super(props);
        this.state = {
            visible: true,
        };

        this.foundation = new NotificationFoundation(this.adapter);
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    renderTypeIcon() {
        const { type, icon } = this.props;
        const iconMap = {
            warning: <IconAlertTriangle size="large" />,
            success: <IconTickCircle size="large" />,
            info: <IconInfoCircle size="large" />,
            error: <IconAlertCircle size="large" />,
        };
        let iconType = iconMap[type];
        const iconCls = cls({
            [`${prefixCls }-icon`]: true,
            [`${prefixCls }-${ type}`]: true,
        });
        if (icon) {
            iconType = icon;
        }
        if (iconType) {
            return (
                <div className={iconCls}>
                    {isSemiIcon(iconType) ? React.cloneElement(iconType, {size : iconType.props.size || 'large'}): iconType}
                </div>
            );
        }
        return null;
    }

    clearCloseTimer = () => {
        this.foundation._clearCloseTimer();
    };

    startCloseTimer = () => {
        this.foundation._startCloseTimer();
    };

    close = (e: React.MouseEvent) => {
        this.props.onCloseClick(this.props.id);
        this.foundation.close(e);
    };

    notifyClick = (e: React.MouseEvent) => {
        this.props.onClick(e);
    };

    render() {
        const direction = this.props.direction || this.context.direction;
        const defaultPosition = direction === 'rtl' ? 'topLeft' : 'topRight';
        const {
            content,
            title,
            theme,
            position = defaultPosition,
            type,
            id,
            onCloseClick,
            className,
            showClose,
            style,
            ...attr
        } = this.props;
        const { visible } = this.state;
        const wrapper = cls(prefixCls, className, {
            [`${prefixCls}-close`]: !visible,
            [`${prefixCls}-icon-show`]: types.includes(type),
            [`${prefixCls}-${type}`]: true,
            [`${prefixCls}-${theme}`]: theme === 'light',
            [`${prefixCls}-rtl`]: direction === 'rtl',
        });
        return (
            <div
                className={wrapper}
                style={style}
                onMouseEnter={this.clearCloseTimer}
                onMouseLeave={this.startCloseTimer}
                onClick={this.notifyClick}
            >
                <div>{this.renderTypeIcon()}</div>
                <div className={`${prefixCls}-inner`}>
                    <div className={`${prefixCls}-content-wrapper`}>
                        {title ? <div className={`${prefixCls}-title`}>{title}</div> : ''}
                        {content ? <div className={`${prefixCls}-content`}>{content}</div> : ''}
                    </div>
                    {showClose && (
                        <Button
                            className={`${prefixCls}-icon-close`}
                            type="tertiary"
                            icon={<IconClose />}
                            theme="borderless"
                            size="small"
                            onClick={this.close}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default Notice;
