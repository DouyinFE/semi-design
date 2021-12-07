/* eslint-disable eqeqeq */
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { cssClasses, strings } from '@douyinfe/semi-foundation/button/constants';
import { strings as iconStrings } from '@douyinfe/semi-foundation/icons/constants';
import Button, { Theme, ButtonProps } from '../button/Button';
import SpinIcon from '../spin/icon';
import { IconSize } from '@douyinfe/semi-icons';
import { noop } from 'lodash';
import '@douyinfe/semi-foundation/button/iconButton.scss';

const iconSizes = iconStrings.SIZE;

export type HorizontalPaddingType = 'left' | 'right';

export interface IconButtonProps extends ButtonProps {
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    iconSize?: IconSize;
    iconStyle?: React.CSSProperties;
    loading?: boolean;
    theme?: Theme;
    style?: React.CSSProperties;
    className?: string;
    disabled?: boolean;
    noHorizontalPadding?: boolean | HorizontalPaddingType | HorizontalPaddingType[];
    prefixCls?: string;
}

// TODO: add a buttonGroup component
// TODO: icon configuration
class IconButton extends PureComponent<IconButtonProps> {
    static defaultProps = {
        iconPosition: strings.DEFAULT_ICON_POSITION,
        prefixCls: cssClasses.PREFIX,
        loading: false,
        noHorizontalPadding: false, //  true same as ['left', 'right']
        onMouseEnter: noop,
        onMouseLeave: noop,
    };

    static propTypes = {
        iconStyle: PropTypes.object,
        style: PropTypes.object,
        loading: PropTypes.bool,
        prefixCls: PropTypes.string,
        icon: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.node]),
        iconSize: PropTypes.oneOf(iconSizes),
        noHorizontalPadding: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.array]),
        children: PropTypes.node,
        theme: PropTypes.string,
        iconPosition: PropTypes.oneOf(strings.iconPositions),
        className: PropTypes.string,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
    };

    render() {
        const {
            children: originChildren,
            iconPosition,
            iconSize,
            iconStyle,
            style: originStyle,
            icon,
            noHorizontalPadding,
            theme,
            className,
            prefixCls,
            loading,
            ...otherProps
        } = this.props;

        const style = { ...originStyle };
        // TODO: review check
        if (Array.isArray(noHorizontalPadding)) {
            noHorizontalPadding.includes('left') && (style.paddingLeft = 0);
            noHorizontalPadding.includes('right') && (style.paddingRight = 0);
        } else if (noHorizontalPadding === true) {
            style.paddingLeft = 0;
            style.paddingRight = 0;
        }

        let finalChildren = null;

        let IconElem = null;

        if (loading && !otherProps.disabled) {
            IconElem = <SpinIcon />;
        } else if (React.isValidElement(icon)) {
            IconElem = icon;
        }

        const btnTextCls = classNames({
            [`${prefixCls}-content-left`]: iconPosition === 'right',
            [`${prefixCls}-content-right`]: iconPosition === 'left',
        });

        const children = originChildren != null ? <span className={btnTextCls}>{originChildren}</span> : null;

        if (iconPosition === 'left') {
            finalChildren = (
                <>
                    {IconElem}
                    {children}
                </>
            );
        } else {
            finalChildren = (
                <>
                    {children}
                    {IconElem}
                </>
            );
        }

        const iconBtnCls = classNames(className, `${prefixCls}-with-icon`, {
            [`${prefixCls}-with-icon-only`]: children == null || (children as any) === '',
            [`${prefixCls}-loading`]: loading,
        });
        return (
            <Button {...otherProps} className={iconBtnCls} theme={theme} style={style}>
                {finalChildren}
            </Button>
        );
    }
}

export default IconButton;
