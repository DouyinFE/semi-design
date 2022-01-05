/* eslint-disable max-len */
import React from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import Button from '../iconButton';
import { strings, cssClasses } from '@douyinfe/semi-foundation/banner/constants';
import BannerFoundation, { BannerAdapter } from '@douyinfe/semi-foundation/banner/foundation';
import '@douyinfe/semi-foundation/banner/banner.scss';
import Typography from '../typography';
import { IconClose, IconAlertTriangle, IconInfoCircle, IconTickCircle, IconAlertCircle } from '@douyinfe/semi-icons';

import warning from '@douyinfe/semi-foundation/utils/warning';
import BaseComponent from '../_base/baseComponent';

const prefixCls = cssClasses.PREFIX;
const types = strings.TYPE;


export type Type = 'info' | 'danger' | 'warning' | 'success';
export interface BannerProps {
    type?: Type;
    className?: string;
    fullMode?: boolean;
    title?: React.ReactNode;
    description?: React.ReactNode;
    icon?: string | React.ReactNode;
    closeIcon?: string | React.ReactNode;
    style?: React.CSSProperties;
    bordered?: boolean;
    onClose?: (e: React.MouseEvent) => void;
}

export interface BannerState {
    visible: boolean;
}

export default class Banner extends BaseComponent<BannerProps, BannerState> {
    static propTypes = {
        // target: PropTypes.func,
        fullMode: PropTypes.bool,
        // insertAfter: PropTypes.func,
        type: PropTypes.oneOf(types),
        title: PropTypes.node,
        description: PropTypes.node,
        icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        closeIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        children: PropTypes.node,
        style: PropTypes.object,
        className: PropTypes.string,
        onClose: PropTypes.func,
        bordered: PropTypes.bool,
    };

    static defaultProps = {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onClose: () => { },
        type: 'info',
        fullMode: true,
    };

    foundation: BannerFoundation;

    constructor(props: BannerProps) {
        super(props);
        this.state = {
            visible: true,
        };

        warning(
            'target' in this.props,
            '[Semi Banner] \'target\' has been deprecated, please write JSX directly instead.'
        );
    }

    get adapter(): BannerAdapter<BannerProps, BannerState> {
        return {
            ...super.adapter,
            setVisible: () => {
                this.setState({ visible: false });
            },
            notifyClose: (e: React.MouseEvent) => {
                const { onClose } = this.props;
                onClose(e);
            },
        };
    }

    componentDidMount() {
        this.foundation = new BannerFoundation(this.adapter);
        this.foundation.init();
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    remove: React.MouseEventHandler = e => {
        e && e.stopPropagation();
        this.foundation.removeBanner(e);
    };

    renderCloser() {
        const { closeIcon } = this.props;
        if (closeIcon === null) {
            return closeIcon;
        }
        const closer = (
            <Button
                className={`${prefixCls}-close`}
                onClick={this.remove}
                icon={closeIcon || <IconClose />}
                theme="borderless"
                size="small"
                type="tertiary"
                aria-label='Close'
            />
        );
        return closer;
    }

    renderIcon() {
        const { type, icon } = this.props;
        const iconMap = {
            warning: <IconAlertTriangle size="large" />,
            success: <IconTickCircle size="large" />,
            info: <IconInfoCircle size="large" />,
            danger: <IconAlertCircle size="large" />
        };
        let iconType: React.ReactNode = iconMap[type];
        const iconCls = cls({
            [`${prefixCls }-icon`]: true,
            // [prefixCls + '-' + type]: true,
        });
        if (typeof icon !== 'undefined') {
            iconType = icon;
        }
        if (iconType) {
            return (
                <div className={iconCls}>
                    {iconType}
                </div>
            );
        }
        return null;
    }

    render() {
        const { children, type, className, style, bordered, title, description, fullMode } = this.props;
        const { visible } = this.state;
        const wrapper = cls(prefixCls, className, {
            [`${prefixCls}-${type}`]: type,
            [`${prefixCls}-full`]: fullMode,
            [`${prefixCls}-in-container`]: !fullMode,
            [`${prefixCls}-bordered`]: !fullMode && bordered,
        });
        const banner = visible ? (
            <div className={wrapper} style={style} role="alert">
                <div className={`${prefixCls}-content-wrapper`}>
                    <div className={`${prefixCls}-content`}>
                        {this.renderIcon()}
                        <div className={`${prefixCls}-content-body`}>
                            {title ? <Typography.Title heading={5} className={`${prefixCls}-title`} component="div">{title}</Typography.Title> : null}
                            {description ? <Typography.Paragraph className={`${prefixCls}-description`} component="div">{description}</Typography.Paragraph> : null}
                        </div>
                    </div>
                    {this.renderCloser()}
                </div>
                {children ? <div className={`${prefixCls}-extra`}>{children}</div> : null}
            </div>
        ) : null;
        return banner;
    }
}
