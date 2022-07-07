/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { cssClasses, strings } from '@douyinfe/semi-foundation/tag/constants';
import Avatar from '../avatar/index';
import { IconClose } from '@douyinfe/semi-icons';
import { TagProps, TagSize, TagColor, TagType } from './interface';
import { handlePrevent } from '@douyinfe/semi-foundation/utils/a11y';
import '@douyinfe/semi-foundation/tag/tag.scss';
import { isString } from 'lodash';

export * from './interface';

const prefixCls = cssClasses.PREFIX;

const tagColors = strings.TAG_COLOR;

const tagSize = strings.TAG_SIZE;
const tagType = strings.TAG_TYPE;
const avatarShapeSet = strings.AVATAR_SHAPE;

export interface TagState {
    visible: boolean;
}

export default class Tag extends Component<TagProps, TagState> {
    static defaultProps: TagProps = {
        size: tagSize[0] as TagSize,
        color: tagColors[0] as TagColor,
        closable: false,
        // visible: true,
        type: tagType[0] as TagType,
        onClose: () => undefined,
        onClick: () => undefined,
        style: {},
        className: '',
        avatarShape: 'square',
        tabIndex: 0,
    };

    static propTypes = {
        children: PropTypes.node,
        size: PropTypes.oneOf(tagSize),
        color: PropTypes.oneOf(tagColors),
        type: PropTypes.oneOf(tagType),
        closable: PropTypes.bool,
        visible: PropTypes.bool,
        onClose: PropTypes.func,
        onClick: PropTypes.func,
        style: PropTypes.object,
        className: PropTypes.string,
        avatarSrc: PropTypes.string,
        avatarShape: PropTypes.oneOf(avatarShapeSet),
        'aria-label': PropTypes.string,
    };

    constructor(props: TagProps) {
        super(props);
        this.state = {
            visible: true,
        };
        this.close = this.close.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    // any other way to achieve this?
    static getDerivedStateFromProps(nextProps: TagProps) {
        if ('visible' in nextProps) {
            return {
                visible: nextProps.visible,
            };
        }
        return null;
    }

    setVisible(visible: boolean) {
        if (!('visible' in this.props)) {
            this.setState({ visible });
        }
    }

    close(e: React.MouseEvent<HTMLElement>, value: React.ReactNode) {
        const { onClose } = this.props;
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        onClose && onClose(value, e);
        // when user call e.preventDefault() in onClick callback, tag will not hidden
        if (e.defaultPrevented) {
            return;
        }
        this.setVisible(false);
    }

    handleKeyDown(event: any) {
        const { closable, onClick } = this.props;
        switch (event.key) {
            case "Backspace":
            case "Delete":
                closable && this.close(event, this.props.children);
                handlePrevent(event);
                break;
            case "Enter":
                onClick(event);
                handlePrevent(event);
                break;
            case 'Escape':
                event.target.blur();
                break;
            default:
                break;
        }
    }

    renderAvatar() {
        const { avatarShape, avatarSrc } = this.props;
        const avatar = <Avatar src={avatarSrc} shape={avatarShape} />;
        return avatar;
    }

    render() {
        const { children, size, color, closable, visible, onClose, onClick, className, type, avatarSrc, avatarShape, tabIndex, ...attr } = this.props;
        const { visible: isVisible } = this.state;
        const clickable = onClick !== Tag.defaultProps.onClick || closable;
        const a11yProps = { role: 'button', tabIndex, onKeyDown: this.handleKeyDown };
        const baseProps = {
            ...attr,
            onClick,
            className: classNames(
                prefixCls,
                {
                    [`${prefixCls}-default`]: size === 'default',
                    [`${prefixCls}-small`]: size === 'small',
                    [`${prefixCls}-large`]: size === 'large',
                    [`${prefixCls}-${type}`]: type,
                    [`${prefixCls}-${color}-${type}`]: color && type,
                    [`${prefixCls}-closable`]: closable,
                    [`${prefixCls}-invisible`]: !isVisible,
                    [`${prefixCls}-avatar-${avatarShape}`]: avatarSrc,
                },
                className
            ),
        };
        const wrapProps = clickable ? ({ ...baseProps, ...a11yProps }) : baseProps;
        const closeIcon = closable ? (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div className={`${prefixCls}-close`} onClick={e => this.close(e, children)}>
                <IconClose size="small" />
            </div>
        ) : null;
        return (
            <div aria-label={this.props['aria-label'] || isString(children) ? `${closable ? 'Closable ' : ''}Tag: ${children}` : '' } {...wrapProps}>
                <div className={`${prefixCls}-content`}>
                    {avatarSrc ? this.renderAvatar() : null}
                    {children}
                    {closeIcon}
                </div>
            </div>
        );
    }
}
