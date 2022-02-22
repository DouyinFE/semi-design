/* eslint-disable prefer-destructuring, max-lines-per-function, react/no-find-dom-node, max-len, @typescript-eslint/no-empty-function */
import React, { isValidElement, cloneElement } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { throttle, noop, get, omit, each, isEmpty } from 'lodash';

import { BASE_CLASS_PREFIX } from '@douyinfe/semi-foundation/base/constants';
import warning from '@douyinfe/semi-foundation/utils/warning';
import Event from '@douyinfe/semi-foundation/utils/Event';
import { ArrayElement } from '@douyinfe/semi-foundation/utils/type';
import { convertDOMRectToObject, DOMRectLikeType } from '@douyinfe/semi-foundation/utils/dom';
import TooltipFoundation, { TooltipAdapter, Position, PopupContainerDOMRect } from '@douyinfe/semi-foundation/tooltip/foundation';
import { strings, cssClasses, numbers } from '@douyinfe/semi-foundation/tooltip/constants';
import { getUuidShort } from '@douyinfe/semi-foundation/utils/uuid';
import '@douyinfe/semi-foundation/tooltip/tooltip.scss';

import BaseComponent, { BaseProps } from '../_base/baseComponent';
import { isHTMLElement } from '../_base/reactUtils';
import { stopPropagation } from '../_utils';
import Portal from '../_portal/index';
import ConfigContext from '../configProvider/context';
import TriangleArrow from './TriangleArrow';
import TriangleArrowVertical from './TriangleArrowVertical';
import TooltipTransition from './TooltipStyledTransition';
import ArrowBoundingShape from './ArrowBoundingShape';
import { Motion } from '../_base/base';

export { TooltipTransitionProps } from './TooltipStyledTransition';
export type Trigger = ArrayElement<typeof strings.TRIGGER_SET>;

export interface ArrowBounding {
    offsetX?: number;
    offsetY?: number;
    width?: number;
    height?: number;
}

export interface TooltipProps extends BaseProps {
    children?: React.ReactNode;
    motion?: Motion;
    autoAdjustOverflow?: boolean;
    position?: Position;
    getPopupContainer?: () => HTMLElement;
    mouseEnterDelay?: number;
    mouseLeaveDelay?: number;
    trigger?: Trigger;
    className?: string;
    clickToHide?: boolean;
    visible?: boolean;
    style?: React.CSSProperties;
    content?: React.ReactNode;
    prefixCls?: string;
    onVisibleChange?: (visible: boolean) => void;
    onClickOutSide?: (e: React.MouseEvent) => void;
    spacing?: number;
    showArrow?: boolean | React.ReactNode;
    zIndex?: number;
    rePosKey?: string | number;
    role?: string;
    arrowBounding?: ArrowBounding;
    transformFromCenter?: boolean;
    arrowPointAtCenter?: boolean;
    wrapWhenSpecial?: boolean;
    stopPropagation?: boolean;
    clickTriggerToHide?: boolean;
    wrapperClassName?: string;
}
interface TooltipState {
    visible: boolean;
    transitionState: string;
    triggerEventSet: {
        [key: string]: any;
    };
    portalEventSet: {
        [key: string]: any;
    };
    containerStyle: React.CSSProperties;
    isInsert: boolean;
    placement: Position;
    transitionStyle: Record<string, any>;
    isPositionUpdated: boolean;
    id: string;
}

const prefix = cssClasses.PREFIX;
const positionSet = strings.POSITION_SET;
const triggerSet = strings.TRIGGER_SET;

const blockDisplays = ['flex', 'block', 'table', 'flow-root', 'grid'];
const defaultGetContainer = () => document.body;
export default class Tooltip extends BaseComponent<TooltipProps, TooltipState> {
    static contextType = ConfigContext;

    static propTypes = {
        children: PropTypes.node,
        motion: PropTypes.oneOfType([PropTypes.bool, PropTypes.object, PropTypes.func]),
        autoAdjustOverflow: PropTypes.bool,
        position: PropTypes.oneOf(positionSet),
        getPopupContainer: PropTypes.func,
        mouseEnterDelay: PropTypes.number,
        mouseLeaveDelay: PropTypes.number,
        trigger: PropTypes.oneOf(triggerSet).isRequired,
        className: PropTypes.string,
        wrapperClassName: PropTypes.string,
        clickToHide: PropTypes.bool,
        // used with trigger === hover, private
        clickTriggerToHide: PropTypes.bool,
        visible: PropTypes.bool,
        style: PropTypes.object,
        content: PropTypes.node,
        prefixCls: PropTypes.string,
        onVisibleChange: PropTypes.func,
        onClickOutSide: PropTypes.func,
        spacing: PropTypes.number,
        showArrow: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
        zIndex: PropTypes.number,
        rePosKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        arrowBounding: ArrowBoundingShape,
        transformFromCenter: PropTypes.bool, // Whether to change from the center of the trigger (for dynamic effects)
        arrowPointAtCenter: PropTypes.bool,
        stopPropagation: PropTypes.bool,
        // private
        role: PropTypes.string,
        wrapWhenSpecial: PropTypes.bool, // when trigger has special status such as "disabled" or "loading", wrap span
    };

    static defaultProps = {
        arrowBounding: numbers.ARROW_BOUNDING,
        autoAdjustOverflow: true,
        arrowPointAtCenter: true,
        trigger: 'hover',
        transformFromCenter: true,
        position: 'top',
        prefixCls: prefix,
        role: 'tooltip',
        mouseEnterDelay: numbers.MOUSE_ENTER_DELAY,
        mouseLeaveDelay: numbers.MOUSE_LEAVE_DELAY,
        motion: true,
        onVisibleChange: noop,
        onClickOutSide: noop,
        spacing: numbers.SPACING,
        showArrow: true,
        wrapWhenSpecial: true,
        zIndex: numbers.DEFAULT_Z_INDEX,
    };

    eventManager: Event;
    triggerEl: React.RefObject<unknown>;
    containerEl: React.RefObject<unknown>;
    clickOutsideHandler: any;
    resizeHandler: any;
    isWrapped: boolean;
    mounted: any;
    scrollHandler: any;
    getPopupContainer: () => HTMLElement;
    containerPosition: string;

    constructor(props: TooltipProps) {
        super(props);
        this.state = {
            visible: false,
            /**
             *
             * Note: The transitionState parameter is equivalent to isInsert
             */
            transitionState: '',
            triggerEventSet: {},
            portalEventSet: {},
            containerStyle: {
                // zIndex: props.zIndex,
            },
            isInsert: false,
            placement: props.position || 'top',
            transitionStyle: {},
            isPositionUpdated: false,
            id: getUuidShort(), // auto generate id, will be used by children.aria-describedby & content.id, improve a11y
        };
        this.foundation = new TooltipFoundation(this.adapter);
        this.eventManager = new Event();
        this.triggerEl = React.createRef();
        this.containerEl = React.createRef();
        this.clickOutsideHandler = null;
        this.resizeHandler = null;
        this.isWrapped = false; // Identifies whether a span element is wrapped
        this.containerPosition = undefined;
    }

    setContainerEl = (node: HTMLDivElement) => (this.containerEl = { current: node });

    get adapter(): TooltipAdapter<TooltipProps, TooltipState> {
        return {
            ...super.adapter,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            on: (...args: any[]) => this.eventManager.on(...args),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            off: (...args: any[]) => this.eventManager.off(...args),
            insertPortal: (content: string, { position, ...containerStyle }: { position: Position }) => {
                this.setState(
                    {
                        isInsert: true,
                        transitionState: 'enter',
                        containerStyle: { ...this.state.containerStyle, ...containerStyle },
                    },
                    () => {
                        setTimeout(() => {
                            // waiting child component mounted
                            this.eventManager.emit('portalInserted');
                        }, 0);
                    }
                );
            },
            removePortal: () => {
                this.setState({ isInsert: false, isPositionUpdated: false });
            },
            getEventName: () => ({
                mouseEnter: 'onMouseEnter',
                mouseLeave: 'onMouseLeave',
                mouseOut: 'onMouseOut',
                mouseOver: 'onMouseOver',
                click: 'onClick',
                focus: 'onFocus',
                blur: 'onBlur',
            }),
            registerTriggerEvent: (triggerEventSet: Record<string, any>) => {
                this.setState({ triggerEventSet });
            },
            unregisterTriggerEvent: () => {},
            registerPortalEvent: (portalEventSet: Record<string, any>) => {
                this.setState({ portalEventSet });
            },
            unregisterPortalEvent: () => {},
            getTriggerBounding: () => {
                // eslint-disable-next-line
                // It may be a React component or an html element
                // There is no guarantee that triggerE l.current can get the real dom, so call findDOMNode to ensure that you can get the real dom
                let triggerDOM = this.triggerEl.current;
                if (!isHTMLElement(this.triggerEl.current)) {
                    const realDomNode = ReactDOM.findDOMNode(this.triggerEl.current as React.ReactInstance);
                    (this.triggerEl as any).current = realDomNode;
                    triggerDOM = realDomNode;
                }
                return triggerDOM && (triggerDOM as Element).getBoundingClientRect();
            },
            // Gets the outer size of the specified container
            getPopupContainerRect: () => {
                const container = this.getPopupContainer();

                let rect: PopupContainerDOMRect = null;

                if (container && isHTMLElement(container)) {
                    const boundingRect: DOMRectLikeType = convertDOMRectToObject(container.getBoundingClientRect());
                    rect = {
                        ...boundingRect,
                        scrollLeft: container.scrollLeft,
                        scrollTop: container.scrollTop,
                    };
                }

                return rect;
            },
            containerIsBody: () => {
                const container = this.getPopupContainer();

                return container === document.body;
            },
            containerIsRelative: () => {
                const container = this.getPopupContainer();
                const computedStyle = window.getComputedStyle(container);
                return computedStyle.getPropertyValue('position') === 'relative';
            },
            containerIsRelativeOrAbsolute: () => ['relative', 'absolute'].includes(this.containerPosition),
            // Get the size of the pop-up layer
            getWrapperBounding: () => {
                const el = this.containerEl && this.containerEl.current;
                return el && (el as Element).getBoundingClientRect();
            },
            getDocumentElementBounding: () => document.documentElement.getBoundingClientRect(),
            setPosition: ({ position, ...style }: { position: Position }) => {
                this.setState(
                    {
                        containerStyle: { ...this.state.containerStyle, ...style },
                        placement: position,
                        isPositionUpdated: true
                    },
                    () => {
                        this.eventManager.emit('positionUpdated');
                    }
                );
            },
            updatePlacementAttr: (placement: Position) => {
                this.setState({ placement });
            },
            togglePortalVisible: (visible: boolean, cb: () => void) => {
                const willUpdateStates: Partial<TooltipState> = {};

                if (this.adapter.canMotion()) {
                    willUpdateStates.transitionState = visible ? 'enter' : 'leave';
                    willUpdateStates.visible = visible;
                } else {
                    willUpdateStates.visible = visible;
                }
                this.setState(willUpdateStates as TooltipState, () => {
                    cb();
                });
            },
            registerClickOutsideHandler: (cb: () => void) => {
                if (this.clickOutsideHandler) {
                    this.adapter.unregisterClickOutsideHandler();
                }
                this.clickOutsideHandler = (e: React.MouseEvent): any => {
                    if (!this.mounted) {
                        return false;
                    }
                    let el = this.triggerEl && this.triggerEl.current;
                    let popupEl = this.containerEl && this.containerEl.current;
                    el = ReactDOM.findDOMNode(el as React.ReactInstance);
                    popupEl = ReactDOM.findDOMNode(popupEl as React.ReactInstance);
                    if (
                        (el && !(el as any).contains(e.target) && popupEl && !(popupEl as any).contains(e.target)) ||
                        this.props.clickTriggerToHide
                    ) {
                        this.props.onClickOutSide(e);
                        cb();
                    }
                };
                document.addEventListener('click', this.clickOutsideHandler, {capture: true});
            },
            unregisterClickOutsideHandler: () => {
                if (this.clickOutsideHandler) {
                    document.removeEventListener('click', this.clickOutsideHandler, {capture: true});
                    this.clickOutsideHandler = null;
                }
            },
            registerResizeHandler: (cb: (e: any) => void) => {
                if (this.resizeHandler) {
                    this.adapter.unregisterResizeHandler();
                }
                this.resizeHandler = throttle((e): any => {
                    if (!this.mounted) {
                        return false;
                    }
                    cb(e);
                }, 10);
                window.addEventListener('resize', this.resizeHandler, false);
            },
            unregisterResizeHandler: () => {
                if (this.resizeHandler) {
                    window.removeEventListener('resize', this.resizeHandler, false);
                    this.resizeHandler = null;
                }
            },
            notifyVisibleChange: (visible: boolean) => {
                this.props.onVisibleChange(visible);
            },
            registerScrollHandler: (rePositionCb: (arg: { x: number; y: number }) => void) => {
                if (this.scrollHandler) {
                    this.adapter.unregisterScrollHandler();
                }
                this.scrollHandler = throttle((e): any => {
                    if (!this.mounted) {
                        return false;
                    }
                    let triggerDOM = this.triggerEl.current;
                    if (!isHTMLElement(this.triggerEl.current)) {
                        triggerDOM = ReactDOM.findDOMNode(this.triggerEl.current as React.ReactInstance);
                    }
                    const isRelativeScroll = e.target.contains(triggerDOM);
                    if (isRelativeScroll) {
                        const scrollPos = { x: e.target.scrollLeft, y: e.target.scrollTop };
                        rePositionCb(scrollPos);
                    }
                }, 10); // When it is greater than 16ms, it will be very obvious
                window.addEventListener('scroll', this.scrollHandler, true);
            },
            unregisterScrollHandler: () => {
                if (this.scrollHandler) {
                    window.removeEventListener('scroll', this.scrollHandler, true);
                    this.scrollHandler = null;
                }
            },
            canMotion: () => Boolean(this.props.motion),
            updateContainerPosition: () => {
                const container = this.getPopupContainer();
                if (container && isHTMLElement(container)) {
                    // getComputedStyle need first parameter is Element type
                    const computedStyle = window.getComputedStyle(container);
                    const position = computedStyle.getPropertyValue('position');
                    this.containerPosition = position;
                }
            },
            getContainerPosition: () => this.containerPosition,
        };
    }

    componentDidMount() {
        this.mounted = true;
        this.getPopupContainer = this.props.getPopupContainer || this.context.getPopupContainer || defaultGetContainer;
        this.foundation.init();
    }

    componentWillUnmount() {
        this.mounted = false;
        this.foundation.destroy();
    }

    isSpecial = (elem: React.ReactNode | HTMLElement | any) => {
        if (isHTMLElement(elem)) {
            return Boolean(elem.disabled);
        } else if (isValidElement(elem)) {
            const disabled = get(elem, 'props.disabled');

            if (disabled) {
                return strings.STATUS_DISABLED;
            }

            const loading = get(elem, 'props.loading');

            /* Only judge the loading state of the Button, and no longer judge other components */
            const isButton = !isEmpty(elem)
                && !isEmpty(elem.type)
                && (elem.type as any).name === 'Button'
                || (elem.type as any).name === 'IconButton';
            if (loading && isButton) {
                return strings.STATUS_LOADING;
            }
        }

        return false;
    };

    // willEnter = () => {
    // this.foundation.calcPosition();
    // this.setState({ visible: true });
    // };

    didLeave = () => {
        this.adapter.unregisterClickOutsideHandler();
        this.adapter.unregisterScrollHandler();
        this.adapter.unregisterResizeHandler();
        this.adapter.removePortal();
    };
    /** for transition - end */

    rePosition() {
        return this.foundation.calcPosition();
    }

    componentDidUpdate(prevProps: TooltipProps, prevState: TooltipState) {
        warning(
            this.props.mouseLeaveDelay < this.props.mouseEnterDelay,
            "[Semi Tooltip] 'mouseLeaveDelay' cannot be less than 'mouseEnterDelay', which may cause the dropdown layer to not be hidden."
        );
        if (prevProps.visible !== this.props.visible) {
            this.props.visible ? this.foundation.delayShow() : this.foundation.delayHide();
        }
        if (prevProps.rePosKey !== this.props.rePosKey) {
            this.rePosition();
        }
    }

    renderIcon = () => {
        const { placement } = this.state;
        const { showArrow, prefixCls, style } = this.props;
        let icon = null;
        const triangleCls = classNames([`${prefixCls}-icon-arrow`]);
        const bgColor = get(style, 'backgroundColor');

        const iconComponent = placement.includes('left') || placement.includes('right') ?
            <TriangleArrowVertical /> :
            <TriangleArrow />;
        if (showArrow) {
            if (isValidElement(showArrow)) {
                icon = showArrow;
            } else {
                icon = React.cloneElement(iconComponent, { className: triangleCls, style: { color: bgColor, fill: 'currentColor' } });
            }
        }

        return icon;
    };

    handlePortalInnerClick = (e: React.MouseEvent) => {
        if (this.props.clickToHide) {
            this.foundation.hide();
        }
        if (this.props.stopPropagation) {
            stopPropagation(e);
        }
    };

    renderPortal = () => {
        const { containerStyle = {}, visible, portalEventSet, placement, transitionState, id, isPositionUpdated } = this.state;
        const { prefixCls, content, showArrow, style, motion, role, zIndex } = this.props;
        const { className: propClassName } = this.props;
        const direction = this.context.direction;
        const className = classNames(propClassName, {
            [`${prefixCls}-wrapper`]: true,
            [`${prefixCls}-wrapper-show`]: visible,
            [`${prefixCls}-with-arrow`]: Boolean(showArrow),
            [`${prefixCls}-rtl`]: direction === 'rtl',
        });
        const icon = this.renderIcon();
        const portalInnerStyle = omit(containerStyle, motion ? ['transformOrigin'] : undefined);
        const transformOrigin = get(containerStyle, 'transformOrigin');
        const inner = motion && isPositionUpdated ? (
            <TooltipTransition position={placement} didLeave={this.didLeave} motion={motion}>
                {
                    transitionState === 'enter' ?
                        ({ animateCls, animateStyle, animateEvents }) => (
                            <div
                                className={classNames(className, animateCls)}
                                style={{
                                    // visibility: 'visible',
                                    ...animateStyle,
                                    transformOrigin,
                                    ...style,
                                }}
                                {...portalEventSet}
                                {...animateEvents}
                                role={role}
                                x-placement={placement}
                                id={id}
                            >
                                {content}
                                {icon}
                            </div>
                        ) :
                        null
                }
            </TooltipTransition>
        ) : (
            <div className={className} {...portalEventSet} x-placement={placement} style={style}>
                {content}
                {icon}
            </div>
        );

        return (
            <Portal getPopupContainer={this.props.getPopupContainer} style={{ zIndex }}>
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                <div
                    className={`${BASE_CLASS_PREFIX}-portal-inner`}
                    style={portalInnerStyle}
                    ref={this.setContainerEl}
                    onClick={this.handlePortalInnerClick}
                >
                    {inner}
                </div>
            </Portal>
        );
    };

    wrapSpan = (elem: React.ReactNode | React.ReactElement) => {
        const { wrapperClassName } = this.props;
        const display = get(elem, 'props.style.display');
        const block = get(elem, 'props.block');

        const style: React.CSSProperties = {
            display: 'inline-block',
        };

        if (block || blockDisplays.includes(display)) {
            style.width = '100%';
        }

        return <span className={wrapperClassName} style={style}>{elem}</span>;
    };

    mergeEvents = (rawEvents: Record<string, any>, events: Record<string, any>) => {
        const mergedEvents = {};
        each(events, (handler: any, key) => {
            if (typeof handler === 'function') {
                mergedEvents[key] = (...args: any[]) => {
                    handler(...args);
                    if (rawEvents && typeof rawEvents[key] === 'function') {
                        rawEvents[key](...args);
                    }
                };
            }
        });

        return mergedEvents;
    };

    render() {
        const { isInsert, triggerEventSet, visible, id } = this.state;
        const { wrapWhenSpecial, role } = this.props;
        let { children } = this.props;
        const childrenStyle = { ...get(children, 'props.style') };
        const extraStyle: React.CSSProperties = {};

        if (wrapWhenSpecial) {
            const isSpecial = this.isSpecial(children);

            if (isSpecial) {
                childrenStyle.pointerEvents = 'none';

                if (isSpecial === strings.STATUS_DISABLED) {
                    extraStyle.cursor = 'not-allowed';
                }

                children = cloneElement(children as React.ReactElement, { style: childrenStyle });
                children = this.wrapSpan(children);
                this.isWrapped = true;
            } else if (!isValidElement(children)) {
                children = this.wrapSpan(children);
                this.isWrapped = true;
            }
        }

        // eslint-disable-next-line prefer-const
        let ariaAttribute = {};

        // Take effect when used by Popover component
        if (role === 'dialog') {
            ariaAttribute['aria-expanded'] = visible ? 'true' : 'false';
            ariaAttribute['aria-haspopup'] = 'dialog';
            ariaAttribute['aria-controls'] = id;
        } else {
            ariaAttribute['aria-describedby'] = id;
        }

        // The incoming children is a single valid element, otherwise wrap a layer with span
        const newChild = React.cloneElement(children as React.ReactElement, {
            ...ariaAttribute,
            ...(children as React.ReactElement).props,
            ...this.mergeEvents((children as React.ReactElement).props, triggerEventSet),
            style: {
                ...get(children, 'props.style'),
                ...extraStyle,
            },
            className: classNames(
                get(children, 'props.className')
            ),
            // to maintain refs with callback
            ref: (node: React.ReactNode) => {
                // Keep your own reference
                (this.triggerEl as any).current = node;
                // Call the original ref, if any
                const { ref } = children as any;
                // this.log('tooltip render() - get ref', ref);
                if (typeof ref === 'function') {
                    ref(node);
                } else if (ref && typeof ref === 'object') {
                    ref.current = node;
                }
            },
        });

        // If you do not add a layer of div, in order to bind the events and className in the tooltip, you need to cloneElement children, but this time it may overwrite the children's original ref reference
        // So if the user adds ref to the content, you need to use callback ref: https://github.com/facebook/react/issues/8873
        return (
            <React.Fragment>
                {isInsert ? this.renderPortal() : null}
                {newChild}
            </React.Fragment>
        );
    }
}

export { Position };
