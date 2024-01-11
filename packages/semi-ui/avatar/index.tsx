import React from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { cssClasses, strings } from '@douyinfe/semi-foundation/avatar/constants';
import AvatarFoundation, { AvatarAdapter } from '@douyinfe/semi-foundation/avatar/foundation';
import '@douyinfe/semi-foundation/avatar/avatar.scss';
import { noop } from '@douyinfe/semi-foundation/utils/function';
import BaseComponent from '../_base/baseComponent';
import { AvatarProps } from './interface';
import { handlePrevent } from '@douyinfe/semi-foundation/utils/a11y';
import TopSlotSvg from "@douyinfe/semi-ui/avatar/TopSlotSvg";


const sizeSet = strings.SIZE;
const shapeSet = strings.SHAPE;
const colorSet = strings.COLOR;
const prefixCls = cssClasses.PREFIX;

export * from './interface';
export interface AvatarState {
    isImgExist: boolean;
    hoverContent: React.ReactNode;
    focusVisible: boolean;
    scale: number
}

export default class Avatar extends BaseComponent<AvatarProps, AvatarState> {
    static defaultProps = {
        size: 'medium',
        color: 'grey',
        shape: 'circle',
        gap: 3,
        onClick: noop,
        onMouseEnter: noop,
        onMouseLeave: noop,
    };

    static elementType: string;
    static propTypes = {
        children: PropTypes.node,
        color: PropTypes.oneOf(colorSet),
        shape: PropTypes.oneOf(shapeSet),
        size: PropTypes.oneOf(sizeSet),
        hoverMask: PropTypes.node,
        className: PropTypes.string,
        style: PropTypes.object,
        gap: PropTypes.number,
        imgAttr: PropTypes.object,
        src: PropTypes.string,
        srcSet: PropTypes.string,
        alt: PropTypes.string,
        onError: PropTypes.func,
        onClick: PropTypes.func,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
    };

    foundation!: AvatarFoundation;
    avatarRef: React.RefObject<HTMLElement | null>;
    constructor(props: AvatarProps) {
        super(props);
        this.state = {
            isImgExist: true,
            hoverContent: '',
            focusVisible: false,
            scale: 1,
        };
        this.onEnter = this.onEnter.bind(this);
        this.onLeave = this.onLeave.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.getContent = this.getContent.bind(this);
        this.avatarRef = React.createRef();
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
            },
            setFocusVisible: (focusVisible: boolean): void => {
                this.setState({ focusVisible });
            },
            setScale: (scale: number) => {
                this.setState({ scale });
            },
            getAvatarNode: () => {
                return this.avatarRef?.current;
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
        if (typeof this.props.children === "string" && this.props.children !== prevProps.children) {
            this.foundation.changeScale();
        }
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    onEnter(e: React.MouseEvent) {
        this.foundation.handleEnter(e);
    }

    onLeave(e: React.MouseEvent) {
        this.foundation.handleLeave(e);
    }

    handleError() {
        this.foundation.handleImgLoadError();
    }

    handleKeyDown(event: any) {
        const { onClick } = this.props;
        switch (event.key) {
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
    
    handleFocusVisible = (event: React.FocusEvent) => {
        this.foundation.handleFocusVisible(event);
    }

    handleBlur = (event: React.FocusEvent) => {
        this.foundation.handleBlur();
    }

    getContent = () => {
        const { children, onClick, imgAttr, src, srcSet, alt } = this.props;
        const { isImgExist } = this.state;
        let content = children;
        const clickable = onClick !== noop;
        const isImg = src && isImgExist;
        const a11yFocusProps = { 
            tabIndex: 0, 
            onKeyDown: this.handleKeyDown,
            onFocus: this.handleFocusVisible,
            onBlur: this.handleBlur,
        };
        if (isImg) {
            const finalAlt = clickable ? `clickable Avatar: ${alt}` : alt; 
            const imgBasicProps = {
                src,
                srcSet,
                onError: this.handleError,
                ...imgAttr,
                className: cls({
                    [`${prefixCls}-no-focus-visible`]: clickable,
                }),
            };
            const imgProps = clickable ? { ...imgBasicProps, ...a11yFocusProps } : imgBasicProps;
            content = (
                <img alt={finalAlt} {...imgProps}/>
            );
        } else if (typeof children === 'string') {
            const tempAlt = alt ?? children;
            const finalAlt = clickable ? `clickable Avatar: ${tempAlt}` : tempAlt; 
            const props = {
                role: 'img',
                'aria-label': finalAlt,
                className: cls(`${prefixCls}-label`,
                    {
                        [`${prefixCls}-no-focus-visible`]: clickable,
                    }
                ),
            };
            const finalProps = clickable ? { ...props, ...a11yFocusProps } : props;
            const stringStyle: React.CSSProperties = {
                transform: `scale(${this.state.scale})`,
            };
            content = (
                <span className={`${prefixCls}-content`} style={stringStyle}>
                    <span {...finalProps} x-semi-prop="children">{children}</span>
                </span>
            );
        }
        return content;
    }


    renderBottomSlot = ()=>{
        if (!this.props.bottomSlot) {
            return null;
        }

        if (this.props.bottomSlot.render) {
            return this.props.bottomSlot.render();
        }

        const renderContent = this.props.bottomSlot.render ??(()=>{
            return <span className={cls(`${prefixCls}-bottom_slot-shape_${this.props.bottomSlot.shape}`, `${prefixCls}-bottom_slot-shape_${this.props.bottomSlot.shape}-${this.props.size}`)}>
                {this.props.bottomSlot.content}
            </span>;
        });

        return <div className={cls([`${prefixCls}-bottom_slot`])}>
            {renderContent()}
        </div>;

    }


    renderTopSlot = ()=> {
        return <>
            <div className={cls([`${prefixCls}-top_slot-bg`, `${prefixCls}-top_slot-bg-${this.props.size}`, {
                [`${prefixCls}-top_slot-bg-with_border`]: this.props.border,
            }])}>
                <div className={cls([`${prefixCls}-top_slot-bg-svg`, `${prefixCls}-top_slot-bg-svg-${this.props.size}`])}>
                    <TopSlotSvg gradientStart={this.props.topSlot.gradientStart ?? "#FF1764"} gradientEnd={this.props.topSlot.gradientStart ?? "#ED3494"}/>
                </div>
            </div>
            <div className={cls([`${prefixCls}-top_slot`, {
                [`${prefixCls}-top_slot-with_border`]: this.props.border,
            }])}>
                <div
                    className={cls([`${prefixCls}-top_slot-content`, `${prefixCls}-top_slot-content-${this.props.size}`])}>{this.props.topSlot.content}</div>
            </div>
        </>;
    }

    render() {
        const {
            shape,
            children,
            size,
            color,
            className,
            hoverMask,
            onClick,
            imgAttr,
            src,
            srcSet,
            style,
            alt,
            gap,
            bottomSlot,
            topSlot,
            border,
            ...others
        } = this.props;
        const { isImgExist, hoverContent, focusVisible } = this.state;
        const isImg = src && isImgExist;
        const avatarCls = cls(
            prefixCls,
            {
                [`${prefixCls}-${shape}`]: shape,
                [`${prefixCls}-${size}`]: size,
                [`${prefixCls}-${color}`]: color && !isImg,
                [`${prefixCls}-img`]: isImg,
                [`${prefixCls}-focus`]: focusVisible,
            },
            className
        );

        const hoverRender = hoverContent ? (
            <div className={`${prefixCls}-hover`} x-semi-prop="hoverContent">{hoverContent}</div>) : null;

        let avatar = <span
            {...(others as any)}
            style={style}
            className={avatarCls}
            onClick={onClick as any}
            onMouseEnter={this.onEnter as any}
            onMouseLeave={this.onLeave as any}
            role='listitem'
            ref={this.avatarRef}>
            {this.getContent()}
            {hoverRender}
        </span>;

        if (border) {
            avatar = <>
                {avatar}
                <span className={cls([
                    `${prefixCls}-border`,
                    `${prefixCls}-border-${size}`,
                    {
                        [`${prefixCls}-${shape}`]: shape,
                    },
                ])}>
                </span>
                {
                    this.props.borderMotion && <span className={cls([
                        `${prefixCls}-border`,
                        `${prefixCls}-border-${size}`,
                        {
                            [`${prefixCls}-${shape}`]: shape,
                            [`${prefixCls}-border-animated`]: this.props.borderMotion,
                        },
                    ])}/>
                }
            </>;

        }


        if (bottomSlot || topSlot ||border) {
            return <span className={cls([`${prefixCls}-wrapper`])}>
                {avatar}
                {topSlot && ["small", "default", "medium", "large"].includes(size) && shape === "circle" && this.renderTopSlot()}
                {bottomSlot && ["small", "default", "medium", "large"].includes(size) && this.renderBottomSlot()}
            </span>;
        } else {
            return avatar;
        }
    }
}
Avatar.elementType = 'Avatar';
