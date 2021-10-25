import React from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { cssClasses, strings } from '@douyinfe/semi-foundation/avatar/constants';
import AvatarFoundation, { AvatarAdapter } from '@douyinfe/semi-foundation/avatar/foundation';
import '@douyinfe/semi-foundation/avatar/avatar.scss';
import { noop } from '@douyinfe/semi-foundation/utils/function';
import BaseComponent from '../_base/baseComponent';
import { AvatarProps } from './interface';

const sizeSet = strings.SIZE;
const shapeSet = strings.SHAPE;
const colorSet = strings.COLOR;
const prefixCls = cssClasses.PREFIX;

export * from './interface';
export interface AvatarState {
    isImgExist: boolean;
    hoverContent: React.ReactNode;
}

export default class Avatar extends BaseComponent<AvatarProps, AvatarState> {
    static defaultProps = {
        size: 'medium',
        color: 'grey',
        shape: 'circle',
        onClick: noop,
        onMouseEnter: noop,
        onMouseLeave: noop,
    };

    static propTypes = {
        children: PropTypes.node,
        color: PropTypes.oneOf(colorSet),
        shape: PropTypes.oneOf(shapeSet),
        size: PropTypes.oneOf(sizeSet),
        hoverMask: PropTypes.node,
        className: PropTypes.string,
        style: PropTypes.object,
        imgAttr: PropTypes.object,
        src: PropTypes.string,
        srcSet: PropTypes.string,
        alt: PropTypes.string,
        onError: PropTypes.func,
        onClick: PropTypes.func,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
    };

    constructor(props: AvatarProps) {
        super(props);
        this.state = {
            isImgExist: true,
            hoverContent: '',
        };
        this.onEnter = this.onEnter.bind(this);
        this.onLeave = this.onLeave.bind(this);
        this.handleError = this.handleError.bind(this);
    }

    get adapter(): AvatarAdapter<AvatarProps, AvatarState> {
        return {
            ...super.adapter,
            notifyImgState: (isImgExist: boolean) => {
                this.setState({ isImgExist });
            },
            notifyEnter: (e: React.MouseEvent) => {
                const { hoverMask } = this.props;
                const hoverContent = hoverMask;
                this.setState({ hoverContent }, () => {
                    const { onMouseEnter } = this.props;
                    onMouseEnter && onMouseEnter(e);
                });
            },
            notifyLeave: (e: React.MouseEvent) => {
                this.setState({ hoverContent: '' }, () => {
                    const { onMouseLeave } = this.props;
                    onMouseLeave && onMouseLeave(e);
                });
            }
        };
    }

    componentDidMount() {
        this.foundation = new AvatarFoundation<AvatarProps, AvatarState>(this.adapter);
        this.foundation.init();
    }

    componentDidUpdate(prevProps: AvatarProps) {
        if (this.props.src && this.props.src !== prevProps.src) {
            const image = new Image(0, 0);
            image.src = this.props.src;
            image.onload = () => {
                this.setState({ isImgExist: true });
            };
            image.onerror = () => {
                this.setState({ isImgExist: false });
            };
            image.onabort = () => {
                this.setState({ isImgExist: false });
            };
        }
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    onEnter() {
        this.foundation.handleEnter();
    }

    onLeave() {
        this.foundation.handleLeave();
    }

    handleError() {
        this.foundation.handleImgLoadError();
    }

    render() {
        // eslint-disable-next-line max-len, no-unused-vars
        const { shape, children, size, color, className, hoverMask, onClick, imgAttr, src, srcSet, style, alt, ...others } = this.props;
        const { isImgExist, hoverContent } = this.state;
        const isImg = src && isImgExist;
        const avtarCls = cls(
            prefixCls,
            {
                [`${prefixCls}-${shape}`]: shape,
                [`${prefixCls}-${size}`]: size,
                [`${prefixCls}-${color}`]: color && !isImg,
                [`${prefixCls}-img`]: isImg,
            },
            className
        );
        let content = children;
        const hoverRender = hoverContent ? (<div className={`${prefixCls}-hover`}>{hoverContent}</div>) : null;
        if (isImg) {
            content = (
                <img src={src} srcSet={srcSet} onError={this.handleError} alt={alt} {...imgAttr} />
            );
        } else if (typeof children === 'string') {
            content = (
                <span className={`${prefixCls}-content`}>
                    <span className={`${prefixCls}-label`}>{children}</span>
                </span>
            );
        }
        return (
            <span
                {...(others as any)}
                style={style}
                className={avtarCls}
                onClick={onClick as any}
                onMouseEnter={this.onEnter as any}
                onMouseLeave={this.onLeave as any}
            >
                {content}
                {hoverRender}
            </span>
        );
    }
}
