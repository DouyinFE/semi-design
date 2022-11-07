/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring, max-lines-per-function, one-var, max-len, @typescript-eslint/restrict-plus-operands */
/* argus-disable unPkgSensitiveInfo */
import { get, isEmpty } from 'lodash';
import { DOMRectLikeType } from '../utils/dom';
import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { ArrayElement } from '../utils/type';
import { strings } from './constants';
import { handlePrevent } from '../utils/a11y';

const REGS = {
    TOP: /top/i,
    RIGHT: /right/i,
    BOTTOM: /bottom/i,
    LEFT: /left/i,
};

const defaultRect = {
    left: 0,
    top: 0,
    height: 0,
    width: 0,
    scrollLeft: 0,
    scrollTop: 0,
};

export interface TooltipAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    registerPortalEvent(portalEventSet: any): void;
    unregisterPortalEvent(): void;
    registerResizeHandler(onResize: () => void): void;
    unregisterResizeHandler(onResize?: () => void): void;
    on(arg0: string, arg1: () => void): void;
    notifyVisibleChange(isVisible: any): void;
    getPopupContainerRect(): PopupContainerDOMRect;
    containerIsBody(): boolean;
    off(arg0: string): void;
    canMotion(): boolean;
    registerScrollHandler(arg: () => Record<string, any>): void;
    unregisterScrollHandler(): void;
    insertPortal(...args: any[]): void;
    removePortal(...args: any[]): void;
    getEventName(): {
        mouseEnter: string;
        mouseLeave: string;
        mouseOut: string;
        mouseOver: string;
        click: string;
        focus: string;
        blur: string;
        keydown: string;
    };
    registerTriggerEvent(...args: any[]): void;
    getTriggerBounding(...args: any[]): DOMRect;
    getWrapperBounding(...args: any[]): DOMRect;
    setPosition(...args: any[]): void;
    togglePortalVisible(...args: any[]): void;
    registerClickOutsideHandler(...args: any[]): void;
    unregisterClickOutsideHandler(...args: any[]): void;
    unregisterTriggerEvent(): void;
    containerIsRelative(): boolean;
    containerIsRelativeOrAbsolute(): boolean;
    getDocumentElementBounding(): DOMRect;
    updateContainerPosition(): void;
    updatePlacementAttr(placement: Position): void;
    getContainerPosition(): string;
    getFocusableElements(node: any): any[];
    getActiveElement(): any;
    getContainer(): any;
    setInitialFocus(): void;
    notifyEscKeydown(event: any): void;
    getTriggerNode(): any;
    setId(): void;
}

export type Position = ArrayElement<typeof strings.POSITION_SET>;

export interface PopupContainerDOMRect extends DOMRectLikeType {
    scrollLeft?: number;
    scrollTop?: number;
}

export default class Tooltip<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<TooltipAdapter<P, S>, P, S> {
    _timer: ReturnType<typeof setTimeout>;
    _mounted: boolean;

    constructor(adapter: TooltipAdapter<P, S>) {
        super({ ...adapter });
        this._timer = null;
    }

    init() {
        const { wrapperId } = this.getProps();
        this._mounted = true;
        this._bindEvent();
        this._shouldShow();
        this._initContainerPosition();
        if (!wrapperId) {
            this._adapter.setId();
        }
    }

    destroy() {
        this._mounted = false;
        this._unBindEvent();
    }

    _bindEvent() {
        const trigger = this.getProp('trigger'); // get trigger type
        const { triggerEventSet, portalEventSet } = this._generateEvent(trigger);
        this._bindTriggerEvent(triggerEventSet);
        this._bindPortalEvent(portalEventSet);
        this._bindResizeEvent();
    }

    _unBindEvent() {
        this._unBindTriggerEvent();
        this._unBindPortalEvent();
        this._unBindResizeEvent();
        this._unBindScrollEvent();
    }

    _bindTriggerEvent(triggerEventSet: Record<string, any>) {
        this._adapter.registerTriggerEvent(triggerEventSet);
    }

    _unBindTriggerEvent() {
        this._adapter.unregisterTriggerEvent();
    }

    _bindPortalEvent(portalEventSet: Record<string, any>) {
        this._adapter.registerPortalEvent(portalEventSet);
    }

    _unBindPortalEvent() {
        this._adapter.unregisterPortalEvent();
    }

    _bindResizeEvent() {
        this._adapter.registerResizeHandler(this.onResize);
    }

    _unBindResizeEvent() {
        this._adapter.unregisterResizeHandler(this.onResize);
    }

    _adjustPos(position = '', isVertical = false, ajustType = 'reverse', concatPos?: any) {
        switch (ajustType) {
            case 'reverse':
                return this._reversePos(position, isVertical);
            case 'expand':
                // only happens when postion is top/bottom/left/right
                return this._expandPos(position, concatPos);
            case 'reduce':
                // only happens when postion other than top/bottom/left/right
                return this._reducePos(position);
            default:
                return this._reversePos(position, isVertical);
        }
    }

    _reversePos(position = '', isVertical = false) {
        if (isVertical) {
            if (REGS.TOP.test(position)) {
                return position.replace('top', 'bottom').replace('Top', 'Bottom');
            } else if (REGS.BOTTOM.test(position)) {
                return position.replace('bottom', 'top').replace('Bottom', 'Top');
            }
        } else if (REGS.LEFT.test(position)) {
            return position.replace('left', 'right').replace('Left', 'Right');
        } else if (REGS.RIGHT.test(position)) {
            return position.replace('right', 'left').replace('Right', 'Left');
        }
        return position;
    }

    _expandPos(position = '', concatPos: string) {
        return position.concat(concatPos);
    }

    _reducePos(position = '') {
        // if cur position consists of two directions, remove the last position
        const found = ['Top', 'Bottom', 'Left', 'Right'].find(pos => position.endsWith(pos));
        return found ? position.replace(found, ''): position;
    }

    clearDelayTimer() {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
    }

    _generateEvent(types: ArrayElement<typeof strings.TRIGGER_SET>) {
        const eventNames = this._adapter.getEventName();
        const triggerEventSet = {
            // bind esc keydown on trigger for a11y
            [eventNames.keydown]: (event) => {
                this._handleTriggerKeydown(event);
            },
        };
        let portalEventSet = {};
        switch (types) {
            case 'focus':
                triggerEventSet[eventNames.focus] = () => {
                    this.delayShow();
                };
                triggerEventSet[eventNames.blur] = () => {
                    this.delayHide();
                };
                portalEventSet = triggerEventSet;
                break;
            case 'click':
                triggerEventSet[eventNames.click] = () => {
                    // this.delayShow();
                    this.show();
                };
                portalEventSet = {};
                // Click outside needs special treatment, can not be directly tied to the trigger Element, need to be bound to the document
                break;
            case 'hover':
                triggerEventSet[eventNames.mouseEnter] = () => {
                    // console.log(e);
                    this.setCache('isClickToHide', false);
                    this.delayShow();
                    // this.show('trigger');
                };
                triggerEventSet[eventNames.mouseLeave] = () => {
                    // console.log(e);
                    this.delayHide();
                    // this.hide('trigger');
                };
                // bind focus to hover trigger for a11y
                triggerEventSet[eventNames.focus] = () => {
                    const { disableFocusListener } = this.getProps();
                    !disableFocusListener && this.delayShow();
                };
                triggerEventSet[eventNames.blur] = () => {
                    const { disableFocusListener } = this.getProps();
                    !disableFocusListener && this.delayHide();
                };

                portalEventSet = { ...triggerEventSet };
                if (this.getProp('clickToHide')) {
                    portalEventSet[eventNames.click] = () => {
                        this.setCache('isClickToHide', true);
                        this.hide();
                    };

                    portalEventSet[eventNames.mouseEnter] = () => {
                        if (this.getCache('isClickToHide')) {
                            return;
                        }

                        this.delayShow();
                    };
                }
                break;
            case 'custom':
                // when trigger type is 'custom', no need to bind eventHandler
                // show/hide completely depend on props.visible which change by user
                break;
            default:
                break;
        }
        return { triggerEventSet, portalEventSet };
    }

    onResize = () => {
        // this.log('resize');
        // rePosition when window resize
        this.calcPosition();
    };

    _shouldShow() {
        const visible = this.getProp('visible');
        if (visible) {
            this.show();
        } else {
            // this.hide();
        }
    }

    delayShow = () => {
        const mouseEnterDelay: number = this.getProp('mouseEnterDelay');

        this.clearDelayTimer();

        if (mouseEnterDelay > 0) {
            this._timer = setTimeout(() => {
                this.show();
                this.clearDelayTimer();
            }, mouseEnterDelay);
        } else {
            this.show();
        }
    };

    show = () => {
        const content = this.getProp('content');
        const trigger = this.getProp('trigger');
        const clickTriggerToHide = this.getProp('clickTriggerToHide');

        this.clearDelayTimer();

        /**
         * If you emit an event in setState callback, you need to place the event listener function before setState to execute.
         * This is to avoid event registration being executed later than setState callback when setState is executed in setTimeout.
         * internal-issues:1402#note_38969412
         */
        this._adapter.on('portalInserted', () => {
            this.calcPosition();
        });

        this._adapter.on('positionUpdated', () => {
            this._togglePortalVisible(true);
        });

        this._adapter.insertPortal(content, { left: -9990, top: -9999 }); // offscreen rendering

        if (trigger === 'custom') {
            // eslint-disable-next-line
            this._adapter.registerClickOutsideHandler(() => {});
        }

        /**
         * trigger类型是click时，仅当portal被插入显示后，才绑定clickOutsideHandler
         * 因为handler需要绑定在document上。如果在constructor阶段绑定
         * 当一个页面中有多个容器实例时，一次click会触发多个容器的handler
         *
         * When the trigger type is click, clickOutsideHandler is bound only after the portal is inserted and displayed
         * Because the handler needs to be bound to the document. If you bind during the constructor phase
         * When there are multiple container instances in a page, one click triggers the handler of multiple containers
         */
        if (trigger === 'click' || clickTriggerToHide) {
            this._adapter.registerClickOutsideHandler(this.hide);
        }

        this._bindScrollEvent();
        this._bindResizeEvent();
    };

    _togglePortalVisible(isVisible: boolean) {
        const nowVisible = this.getState('visible');
        if (nowVisible !== isVisible) {
            this._adapter.togglePortalVisible(isVisible, () => {
                if (isVisible) {
                    this._adapter.setInitialFocus();
                }
                this._adapter.notifyVisibleChange(isVisible);
            });
        }
    }

    _roundPixel(pixel: number) {
        if (typeof pixel === 'number') {
            return Math.round(pixel);
        }

        return pixel;
    }

    calcTransformOrigin(position: Position, triggerRect: DOMRect, translateX: number, translateY: number) {
        // eslint-disable-next-line
        if (position && triggerRect && translateX != null && translateY != null) {
            if (this.getProp('transformFromCenter')) {
                if (['topLeft', 'bottomLeft'].includes(position)) {
                    return `${this._roundPixel(triggerRect.width / 2)}px ${-translateY * 100}%`;
                }

                if (['topRight', 'bottomRight'].includes(position)) {
                    return `calc(100% - ${this._roundPixel(triggerRect.width / 2)}px) ${-translateY * 100}%`;
                }

                if (['leftTop', 'rightTop'].includes(position)) {
                    return `${-translateX * 100}% ${this._roundPixel(triggerRect.height / 2)}px`;
                }

                if (['leftBottom', 'rightBottom'].includes(position)) {
                    return `${-translateX * 100}% calc(100% - ${this._roundPixel(triggerRect.height / 2)}px)`;
                }
            }

            return `${-translateX * 100}% ${-translateY * 100}%`;
        }

        return null;
    }

    calcPosStyle(props: {triggerRect: DOMRect, wrapperRect: DOMRect, containerRect: PopupContainerDOMRect, position?: Position, spacing?: number, isOverFlow?: [boolean, boolean]}) {
        const { spacing, isOverFlow } = props;
        const triggerRect = (isEmpty(props.triggerRect) ? props.triggerRect : this._adapter.getTriggerBounding()) || { ...defaultRect as any };
        const containerRect = (isEmpty(props.containerRect) ? props.containerRect : this._adapter.getPopupContainerRect()) || {
            ...defaultRect,
        };
        const wrapperRect = (isEmpty(props.wrapperRect) ? props.wrapperRect : this._adapter.getWrapperBounding()) || { ...defaultRect as any };
        // eslint-disable-next-line
        const position = props.position != null ? props.position : this.getProp('position');
        // eslint-disable-next-line
        const SPACING = spacing != null ? spacing : this.getProp('spacing');
        const { arrowPointAtCenter, showArrow, arrowBounding } = this.getProps();
        const pointAtCenter = showArrow && arrowPointAtCenter;

        const horizontalArrowWidth = get(arrowBounding, 'width', 24);
        const verticalArrowHeight = get(arrowBounding, 'width', 24);
        const arrowOffsetY = get(arrowBounding, 'offsetY', 0);
        const positionOffsetX = 6;
        const positionOffsetY = 6;

        // You must use left/top when rendering, using right/bottom does not render the element position correctly
        // Use left/top + translate to achieve tooltip positioning perfectly without knowing the size of the tooltip expansion layer
        let left;
        let top;
        let translateX = 0; // Container x-direction translation distance
        let translateY = 0; // Container y-direction translation distance

        const middleX = triggerRect.left + triggerRect.width / 2;
        const middleY = triggerRect.top + triggerRect.height / 2;
        const offsetXWithArrow = positionOffsetX + horizontalArrowWidth / 2;
        const offsetYWithArrow = positionOffsetY + verticalArrowHeight / 2;

        const heightDifference = wrapperRect.height - containerRect.height;
        const widthDifference = wrapperRect.width - containerRect.width;

        const offsetHeight = heightDifference > 0 ? heightDifference : 0;
        const offsetWidth = widthDifference > 0 ? widthDifference : 0;
        const isHeightOverFlow = isOverFlow && isOverFlow[0];
        const isWitdhOverFlow = isOverFlow && isOverFlow[1];

        const isTriggerNearLeft = middleX - containerRect.left < containerRect.right - middleX;
        const isTriggerNearTop = middleY - containerRect.top < containerRect.bottom - middleY;


        switch (position) {
            case 'top':
                // left = middleX;
                // top = triggerRect.top - SPACING;
                left = isWitdhOverFlow ? (isTriggerNearLeft ? containerRect.left + wrapperRect.width / 2 : containerRect.right - wrapperRect.width / 2 + offsetWidth): middleX;
                top = isHeightOverFlow ? containerRect.bottom + offsetHeight : triggerRect.top - SPACING;
                translateX = -0.5;
                translateY = -1;
                break;
            case 'topLeft':
                // left = pointAtCenter ? middleX - offsetXWithArrow : triggerRect.left;
                // top = triggerRect.top - SPACING;
                left = isWitdhOverFlow ? containerRect.left : (pointAtCenter ? middleX - offsetXWithArrow : triggerRect.left);
                top = isHeightOverFlow ? containerRect.bottom + offsetHeight : triggerRect.top - SPACING;
                translateY = -1;
                break;
            case 'topRight':
                // left = pointAtCenter ? middleX + offsetXWithArrow : triggerRect.right;
                // top = triggerRect.top - SPACING;
                left = isWitdhOverFlow ? containerRect.right + offsetWidth : (pointAtCenter ? middleX + offsetXWithArrow : triggerRect.right);
                top = isHeightOverFlow ? containerRect.bottom + offsetHeight : triggerRect.top - SPACING;
                translateY = -1;
                translateX = -1;
                break;
            case 'left':
                // left = triggerRect.left - SPACING;
                // top = middleY;
                // left = isWitdhOverFlow? containerRect.right - SPACING : triggerRect.left - SPACING;
                left = isWitdhOverFlow ? containerRect.right + offsetWidth - SPACING + offsetXWithArrow : triggerRect.left - SPACING;
                top = isHeightOverFlow ? (isTriggerNearTop ? containerRect.top + wrapperRect.height / 2 : containerRect.bottom - wrapperRect.height / 2 + offsetHeight): middleY;
                translateX = -1;
                translateY = -0.5;
                break;
            case 'leftTop':
                // left = triggerRect.left - SPACING;
                // top = pointAtCenter ? middleY - offsetYWithArrow : triggerRect.top;
                left = isWitdhOverFlow ? containerRect.right + offsetWidth - SPACING + offsetXWithArrow : triggerRect.left - SPACING;
                top = isHeightOverFlow ? containerRect.top : (pointAtCenter ? middleY - offsetYWithArrow : triggerRect.top);
                translateX = -1;
                break;
            case 'leftBottom':
                // left = triggerRect.left - SPACING;
                // top = pointAtCenter ? middleY + offsetYWithArrow : triggerRect.bottom;
                left = isWitdhOverFlow ? containerRect.right + offsetWidth - SPACING + offsetXWithArrow: triggerRect.left - SPACING;
                top = isHeightOverFlow ? containerRect.bottom + offsetHeight: (pointAtCenter ? middleY + offsetYWithArrow : triggerRect.bottom);
                translateX = -1;
                translateY = -1;
                break;
            case 'bottom':
                // left = middleX;
                // top = triggerRect.top + triggerRect.height + SPACING;
                left = isWitdhOverFlow ? (isTriggerNearLeft ? containerRect.left + wrapperRect.width / 2 : containerRect.right - wrapperRect.width / 2 + offsetWidth): middleX;
                top = isHeightOverFlow ? containerRect.top + offsetYWithArrow - SPACING: triggerRect.top + triggerRect.height + SPACING;
                translateX = -0.5;
                break;
            case 'bottomLeft':
                // left = pointAtCenter ? middleX - offsetXWithArrow : triggerRect.left;
                // top = triggerRect.bottom + SPACING;
                left = isWitdhOverFlow ? containerRect.left : (pointAtCenter ? middleX - offsetXWithArrow : triggerRect.left);
                top = isHeightOverFlow ? containerRect.top + offsetYWithArrow - SPACING : triggerRect.top + triggerRect.height + SPACING;
                break;
            case 'bottomRight':
                // left = pointAtCenter ? middleX + offsetXWithArrow : triggerRect.right;
                // top = triggerRect.bottom + SPACING;
                left = isWitdhOverFlow ? containerRect.right + offsetWidth : (pointAtCenter ? middleX + offsetXWithArrow : triggerRect.right);
                top = isHeightOverFlow ? containerRect.top + offsetYWithArrow - SPACING : triggerRect.top + triggerRect.height + SPACING;
                translateX = -1;
                break;
            case 'right':
                // left = triggerRect.right + SPACING;
                // top = middleY;
                left = isWitdhOverFlow ? containerRect.left - SPACING + offsetXWithArrow : triggerRect.right + SPACING;
                top = isHeightOverFlow ? (isTriggerNearTop ? containerRect.top + wrapperRect.height / 2 : containerRect.bottom - wrapperRect.height / 2 + offsetHeight) : middleY;
                translateY = -0.5;
                break;
            case 'rightTop':
                // left = triggerRect.right + SPACING;
                // top = pointAtCenter ? middleY - offsetYWithArrow : triggerRect.top;
                left = isWitdhOverFlow ? containerRect.left - SPACING + offsetXWithArrow : triggerRect.right + SPACING;
                top = isHeightOverFlow ? containerRect.top : (pointAtCenter ? middleY - offsetYWithArrow : triggerRect.top);
                break;
            case 'rightBottom':
                // left = triggerRect.right + SPACING;
                // top = pointAtCenter ? middleY + offsetYWithArrow : triggerRect.bottom;
                left = isWitdhOverFlow ? containerRect.left - SPACING + offsetXWithArrow : triggerRect.right + SPACING;
                top = isHeightOverFlow ? containerRect.bottom + offsetHeight : (pointAtCenter ? middleY + offsetYWithArrow : triggerRect.bottom);
                translateY = -1;
                break;
            case 'leftTopOver':
                left = triggerRect.left - SPACING;
                top = triggerRect.top - SPACING;
                break;
            case 'rightTopOver':
                left = triggerRect.right + SPACING;
                top = triggerRect.top - SPACING;
                translateX = -1;
                break;
            case 'leftBottomOver':
                left = triggerRect.left - SPACING;
                top = triggerRect.bottom + SPACING;
                translateY = -1;
                break;
            case 'rightBottomOver':
                left = triggerRect.right + SPACING;
                top = triggerRect.bottom + SPACING;
                translateX = -1;
                translateY = -1;
                break;
            default:
                break;
        }

        const transformOrigin = this.calcTransformOrigin(position, triggerRect, translateX, translateY); // Transform origin

        const _containerIsBody = this._adapter.containerIsBody();
        // Calculate container positioning relative to window
        left = left - containerRect.left;
        top = top - containerRect.top;

        /**
         * container为body时，如果position不为relative或absolute，这时trigger计算出的top/left会根据html定位（initial containing block）
         * 此时如果body有margin，则计算出的位置相对于body会有问题 fix issue #1368
         *
         * When container is body, if position is not relative or absolute, then the top/left calculated by trigger will be positioned according to html
         * At this time, if the body has a margin, the calculated position will have a problem relative to the body fix issue #1368
         */
        if (_containerIsBody && !this._adapter.containerIsRelativeOrAbsolute()) {
            const documentEleRect = this._adapter.getDocumentElementBounding();
            // Represents the left of the body relative to html
            left += containerRect.left - documentEleRect.left;
            // Represents the top of the body relative to html
            top += containerRect.top - documentEleRect.top;
        }

        // ContainerRect.scrollLeft to solve the inner scrolling of the container
        left = _containerIsBody ? left : left + containerRect.scrollLeft;
        top = _containerIsBody ? top : top + containerRect.scrollTop;

        const triggerHeight = triggerRect.height;

        if (
            this.getProp('showArrow') &&
            !arrowPointAtCenter &&
            triggerHeight <= (verticalArrowHeight / 2 + arrowOffsetY) * 2
        ) {
            const offsetY = triggerHeight / 2 - (arrowOffsetY + verticalArrowHeight / 2);

            if ((position.includes('Top') || position.includes('Bottom')) && !position.includes('Over')) {
                top = position.includes('Top') ? top + offsetY : top - offsetY;
            }
        }

        // The left/top value here must be rounded, otherwise it will cause the small triangle to shake
        const style: Record<string, string | number> = {
            left: this._roundPixel(left),
            top: this._roundPixel(top),
        };

        let transform = '';

        // eslint-disable-next-line
        if (translateX != null) {
            transform += `translateX(${translateX * 100}%) `;
            Object.defineProperty(style, 'translateX', {
                enumerable: false,
                value: translateX,
            });
        }
        // eslint-disable-next-line
        if (translateY != null) {
            transform += `translateY(${translateY * 100}%) `;
            Object.defineProperty(style, 'translateY', {
                enumerable: false,
                value: translateY,
            });
        }
        // eslint-disable-next-line
        if (transformOrigin != null) {
            style.transformOrigin = transformOrigin;
        }

        if (transform) {
            style.transform = transform;
        }

        return style;
    }

    /**
     * 耦合的东西比较多，稍微罗列一下：
     *
     * - 根据 trigger 和 wrapper 的 boundingClient 计算当前的 left、top、transform-origin
     * - 根据当前的 position 和 wrapper 的 boundingClient 决定是否需要自动调整位置
     * - 根据当前的 position、trigger 的 boundingClient 以及 motion.handleStyle 调整当前的 style
     * 
     * There are many coupling things, a little list:
     *
     * - calculate the current left, top, and transfer-origin according to the boundingClient of trigger and wrapper
     * - decide whether to automatically adjust the position according to the current position and the boundingClient of wrapper
     * - adjust the current style according to the current position, the boundingClient of trigger and motion.handle Style
     */
    calcPosition = (triggerRect?: DOMRect, wrapperRect?: DOMRect, containerRect?: PopupContainerDOMRect, shouldUpdatePos = true) => {
        triggerRect = (isEmpty(triggerRect) ? this._adapter.getTriggerBounding() : triggerRect) || { ...defaultRect as any };
        containerRect = (isEmpty(containerRect) ? this._adapter.getPopupContainerRect() : containerRect) || {
            ...defaultRect,
        };
        wrapperRect = (isEmpty(wrapperRect) ? this._adapter.getWrapperBounding() : wrapperRect) || { ...defaultRect as any };

        // console.log('containerRect: ', containerRect, 'triggerRect: ', triggerRect, 'wrapperRect: ', wrapperRect);

        let style = this.calcPosStyle({ triggerRect, wrapperRect, containerRect });

        let position = this.getProp('position');

        if (this.getProp('autoAdjustOverflow')) {
            // console.log('style: ', style, '\ntriggerRect: ', triggerRect, '\nwrapperRect: ', wrapperRect);
            const { position: adjustedPos, isHeightOverFlow, isWidthOverFlow } = this.adjustPosIfNeed(position, style, triggerRect, wrapperRect, containerRect);

            if (position !== adjustedPos || isHeightOverFlow || isWidthOverFlow) {
                position = adjustedPos;

                style = this.calcPosStyle({ triggerRect, wrapperRect, containerRect, position, spacing: null, isOverFlow: [ isHeightOverFlow, isWidthOverFlow ] });
            }
        }

        if (shouldUpdatePos && this._mounted) {
            // this._adapter.updatePlacementAttr(style.position);
            this._adapter.setPosition({ ...style, position });
        }

        return style;
    };

    isLR(position = '') {
        return position.includes('left') || position.includes('right');
    }

    isTB(position = '') {
        return position.includes('top') || position.includes('bottom');
    }

    isReverse(rowSpace: number, reverseSpace: number, size: number) {
        // 原空间不足，反向空间足够
        // Insufficient original space, enough reverse space
        return rowSpace < size && reverseSpace > size;
    }

    isOverFlow(rowSpace: number, reverseSpace: number, size: number){
        // 原空间且反向空间都不足
        // The original space and the reverse space are not enough
        return rowSpace < size && reverseSpace < size;
    }

    isHalfOverFlow(posSpace: number, negSpace: number, size: number){
        // 正半空间或者负半空间不足，即表示有遮挡，需要偏移
        // Insufficient positive half space or negative half space means that there is occlusion and needs to be offset
        return posSpace < size || negSpace < size;
    }

    isHalfAllEnough(posSpace: number, negSpace: number, size: number){
        // 正半空间和负半空间都足够，即表示可以从 topLeft/topRight 变成 top
        // Both positive and negative half-spaces are sufficient, which means you can change from topLeft/topRight to top
        return posSpace >= size || negSpace >= size;
    }

    getReverse(viewOverFlow: boolean, cntrOverFlow: boolean, shouldReverseView: boolean, shouldReverseContanier: boolean) {
        /**
         * 基于视口和容器一起判断，以下几种情况允许从原方向转到反方向，以判断是否应该由top->bottom为例子
         *
         * 1. 视口上下空间不足 且 容器上空间❌下空间✅
         * 2. 视口上空间❌下空间✅ 且 容器上下空间不足
         * 3. 视口上空间❌下空间✅ 且 容器上空间❌下空间✅
         * 
         * Based on the judgment of the viewport and the container, the following situations are allowed to turn from the original direction to the opposite direction
         * to judge whether it should be top->bottom as an example
         * 1. There is insufficient space above and below the viewport and the space above the container ❌ the space below ✅
         * 2. The space above the viewport ❌ the space below ✅ and the space above and below the container is insufficient
         * 3. Viewport upper space ❌ lower space✅ and container upper space ❌ lower space✅
         */
        return (viewOverFlow && shouldReverseContanier) || (shouldReverseView && cntrOverFlow) || (shouldReverseView && shouldReverseContanier);
    }

    // place the dom correctly
    adjustPosIfNeed(position: Position | string, style: Record<string, any>, triggerRect: DOMRect, wrapperRect: DOMRect, containerRect: PopupContainerDOMRect) {
        const { innerWidth, innerHeight } = window;
        const { spacing, margin } = this.getProps();

        const marginLeft = typeof margin === 'number' ? margin : margin.marginLeft;
        const marginTop = typeof margin === 'number' ? margin : margin.marginTop;
        const marginRight = typeof margin === 'number' ? margin : margin.marginRight;
        const marginBottom = typeof margin === 'number' ? margin : margin.marginBottom;

        let isHeightOverFlow = false;
        let isWidthOverFlow = false;

        if (wrapperRect.width > 0 && wrapperRect.height > 0) {
            // let clientLeft = left + translateX * wrapperRect.width - containerRect.scrollLeft;
            // let clientTop = top + translateY * wrapperRect.height - containerRect.scrollTop;

            // if (this._adapter.containerIsBody() || this._adapter.containerIsRelative()) {
            //     clientLeft += containerRect.left;
            //     clientTop += containerRect.top;
            // }
            // const clientRight = clientLeft + wrapperRect.width;
            // const clientBottom = clientTop + wrapperRect.height;

            // The relative position of the elements on the screen
            // https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/tooltip-pic.svg
            const clientLeft = triggerRect.left;
            const clientRight = triggerRect.right;
            const clientTop = triggerRect.top;
            const clientBottom = triggerRect.bottom;

            const restClientLeft = innerWidth - clientLeft;
            const restClientTop = innerHeight - clientTop;
            const restClientRight = innerWidth - clientRight;
            const restClientBottom = innerHeight - clientBottom;

            const widthIsBigger = wrapperRect.width > triggerRect.width;
            const heightIsBigger = wrapperRect.height > triggerRect.height;

            // The wrapperR ect.top|bottom equivalent cannot be directly used here for comparison, which is easy to cause jitter

            // 基于视口的微调判断
            // Fine-tuning judgment based on viewport
            const shouldViewReverseTop = clientTop - marginTop < wrapperRect.height + spacing && restClientBottom - marginBottom > wrapperRect.height + spacing;
            const shouldViewReverseLeft = clientLeft - marginLeft < wrapperRect.width + spacing && restClientRight - marginRight > wrapperRect.width + spacing;
            const shouldViewReverseBottom = restClientBottom - marginBottom < wrapperRect.height + spacing && clientTop - marginTop > wrapperRect.height + spacing;
            const shouldViewReverseRight = restClientRight - marginRight < wrapperRect.width + spacing && clientLeft - marginLeft > wrapperRect.width + spacing;
            const shouldViewReverseTopOver = restClientTop - marginBottom< wrapperRect.height + spacing && clientBottom - marginTop> wrapperRect.height + spacing;
            const shouldViewReverseBottomOver = clientBottom - marginTop < wrapperRect.height + spacing && restClientTop - marginBottom > wrapperRect.height + spacing;

            const shouldViewReverseTopSide = restClientTop < wrapperRect.height && clientBottom > wrapperRect.height;
            const shouldViewReverseBottomSide = clientBottom < wrapperRect.height && restClientTop > wrapperRect.height;
            const shouldViewReverseLeftSide = restClientLeft < wrapperRect.width && clientRight > wrapperRect.width;
            const shouldViewReverseRightSide = clientRight < wrapperRect.width && restClientLeft > wrapperRect.width;

            const shouldReverseLeftOver = restClientLeft < wrapperRect.width && clientRight > wrapperRect.width;
            const shouldReverseRightOver = clientRight < wrapperRect.width && restClientLeft > wrapperRect.width;

            // 基于容器的微调判断
            // Fine-tuning judgment based on container
            const clientTopInContanier = clientTop - containerRect.top;
            const clientLeftInContanier = clientLeft - containerRect.left;
            const clientBottomInContanier = clientTopInContanier + triggerRect.height;
            const clientRightInContanier = clientLeftInContanier + triggerRect.width;

            const restClientBottomInContanier = containerRect.bottom - clientBottom;
            const restClientRightInContanier = containerRect.right - clientRight;
            const restClientTopInContanier = restClientBottomInContanier + triggerRect.height;
            const restClientLeftInContanier = restClientRightInContanier + triggerRect.width;

            // 当原空间不足，反向空间足够时，可以反向。
            // When the original space is insufficient and the reverse space is sufficient, the reverse can be performed.
            const shouldContanierReverseTop = this.isReverse(clientTopInContanier - marginTop, restClientBottomInContanier - marginBottom, wrapperRect.height + spacing);
            const shouldContanierReverseLeft = this.isReverse(clientLeftInContanier - marginLeft, restClientRightInContanier - marginRight, wrapperRect.width + spacing);
            const shouldContanierReverseBottom = this.isReverse(restClientBottomInContanier - marginBottom, clientTopInContanier - marginTop, wrapperRect.height + spacing);
            const shouldContanierReverseRight = this.isReverse(restClientRightInContanier - marginRight, clientLeftInContanier - marginLeft, wrapperRect.width + spacing);
            const shouldContanierReverseTopOver = this.isReverse(restClientTopInContanier - marginBottom, clientBottomInContanier - marginTop, wrapperRect.height + spacing);
            const shouldContanierReverseBottomOver = this.isReverse(clientBottomInContanier - marginTop, restClientTopInContanier - marginBottom, wrapperRect.height + spacing);

            const shouldContanierReverseTopSide = this.isReverse(restClientTopInContanier, clientBottomInContanier, wrapperRect.height);
            const shouldContanierReverseBottomSide = this.isReverse(clientBottomInContanier, restClientTopInContanier, wrapperRect.height);
            const shouldContanierReverseLeftSide = this.isReverse(restClientLeftInContanier, clientRightInContanier, wrapperRect.width);
            const shouldContanierReverseRightSide = this.isReverse(clientRightInContanier, restClientLeftInContanier, wrapperRect.width);

            const halfHeight = triggerRect.height / 2;
            const halfWidth = triggerRect.width / 2;

            // 视口, 原空间与反向空间是否都不足判断
            // Viewport, whether the original space and the reverse space are insufficient to judge
            const isViewYOverFlow = this.isOverFlow(clientTop - marginTop, restClientBottom - marginBottom, wrapperRect.height + spacing);
            const isViewXOverFlow = this.isOverFlow(clientLeft - marginLeft, restClientRight - marginRight, wrapperRect.width + spacing);
            const isViewYOverFlowSide = this.isOverFlow(clientBottom - marginTop, restClientTop - marginBottom, wrapperRect.height + spacing);
            const isViewXOverFlowSide = this.isOverFlow(clientRight - marginLeft, restClientLeft - marginRight, wrapperRect.width + spacing);
            const isViewYOverFlowSideHalf = this.isHalfOverFlow(clientBottom - halfHeight, restClientTop - halfHeight, wrapperRect.height / 2);
            const isViewXOverFlowSideHalf = this.isHalfOverFlow(clientRight - halfWidth, restClientLeft - halfWidth, wrapperRect.width / 2);
            const isViewYEnoughSideHalf = this.isHalfAllEnough(clientBottom - halfHeight, restClientTop - halfHeight, wrapperRect.height / 2);
            const isViewXEnoughSideHalf = this.isHalfAllEnough(clientRight - halfWidth, restClientLeft - halfWidth, wrapperRect.width / 2);

            // 容器, 原空间与反向空间是否都不足判断
            // container, whether the original space and the reverse space are insufficient to judge
            const isContanierYOverFlow = this.isOverFlow(clientTopInContanier - marginTop, restClientBottomInContanier - marginBottom, wrapperRect.height + spacing);
            const isContanierXOverFlow = this.isOverFlow(clientLeftInContanier - marginLeft, restClientRightInContanier - marginRight, wrapperRect.width + spacing);
            const isContanierYOverFlowSide = this.isOverFlow(clientBottomInContanier - marginTop, restClientTopInContanier - marginBottom, wrapperRect.height + spacing);
            const isContanierXOverFlowSide = this.isOverFlow(clientRightInContanier - marginLeft, restClientLeftInContanier - marginRight, wrapperRect.width + spacing);
            const isContanierYOverFlowSideHalf = this.isHalfOverFlow(clientBottomInContanier - halfHeight, restClientTopInContanier - halfHeight, wrapperRect.height / 2);
            const isContanierXOverFlowSideHalf = this.isHalfOverFlow(clientRightInContanier - halfWidth, restClientLeftInContanier - halfWidth, wrapperRect.width / 2);
            const isContanierYEnoughSideHalf = this.isHalfAllEnough(clientBottomInContanier - halfHeight, restClientTopInContanier - halfHeight, wrapperRect.height / 2);
            const isContanierXEnoughSideHalf = this.isHalfAllEnough(clientRightInContanier - halfWidth, restClientLeftInContanier - halfWidth, wrapperRect.width / 2);

            // 综合 viewport + container 判断微调，即视口 + 容器都放置不行时才能考虑位置调整
            // Comprehensive viewport + container judgment fine-tuning, that is, the position adjustment can only be considered when the viewport + container cannot be placed.
            const shouldReverseTop = this.getReverse(isViewYOverFlow, isContanierYOverFlow, shouldViewReverseTop, shouldContanierReverseTop);
            const shouldReverseLeft = this.getReverse(isViewXOverFlow, isContanierXOverFlow, shouldViewReverseLeft, shouldContanierReverseLeft);
            const shouldReverseBottom = this.getReverse(isViewYOverFlow, isContanierYOverFlow, shouldViewReverseBottom, shouldContanierReverseBottom);
            const shouldReverseRight = this.getReverse(isViewXOverFlow, isContanierXOverFlow, shouldViewReverseRight, shouldContanierReverseRight);

            const shouldReverseTopOver = this.getReverse(isViewYOverFlowSide, isContanierYOverFlowSide, shouldViewReverseTopOver, shouldContanierReverseTopOver);
            const shouldReverseBottomOver = this.getReverse(isViewYOverFlowSide, isContanierYOverFlowSide, shouldViewReverseBottomOver, shouldContanierReverseBottomOver);

            const shouldReverseTopSide = this.getReverse(isViewYOverFlowSide, isContanierYOverFlowSide, shouldViewReverseTopSide, shouldContanierReverseTopSide);
            const shouldReverseBottomSide = this.getReverse(isViewYOverFlowSide, isContanierYOverFlowSide, shouldViewReverseBottomSide, shouldContanierReverseBottomSide);
            const shouldReverseLeftSide = this.getReverse(isViewXOverFlowSide, isContanierXOverFlowSide, shouldViewReverseLeftSide, shouldContanierReverseLeftSide);
            const shouldReverseRightSide = this.getReverse(isViewXOverFlowSide, isContanierXOverFlowSide, shouldViewReverseRightSide, shouldContanierReverseRightSide);

            const isYOverFlowSideHalf = isViewYOverFlowSideHalf && isContanierYOverFlowSideHalf;
            const isXOverFlowSideHalf = isViewXOverFlowSideHalf && isContanierXOverFlowSideHalf;

            switch (position) {
                case 'top':
                    if (shouldReverseTop) {
                        position = this._adjustPos(position, true);
                    }
                    if (isXOverFlowSideHalf && (shouldReverseLeftSide || shouldReverseRightSide)) {
                        position = this._adjustPos(position, true, 'expand', shouldReverseLeftSide ? 'Right' : 'Left');
                    }
                    break;
                case 'topLeft':
                    if (shouldReverseTop) {
                        position = this._adjustPos(position, true);
                    }
                    if (shouldReverseLeftSide && widthIsBigger) {
                        position = this._adjustPos(position, true);
                    }
                    if (isWidthOverFlow && (isViewXEnoughSideHalf || isContanierXEnoughSideHalf)) {
                        position = this._adjustPos(position, true, 'reduce');
                    }
                    break;
                case 'topRight':
                    if (shouldReverseTop) {
                        position = this._adjustPos(position, true);
                    }
                    if (shouldReverseRightSide && widthIsBigger) {
                        position = this._adjustPos(position);
                    }
                    if (isWidthOverFlow && (isViewXEnoughSideHalf || isContanierXEnoughSideHalf)) {
                        position = this._adjustPos(position, true, 'reduce');
                    }
                    break;
                case 'left':
                    if (shouldReverseLeft) {
                        position = this._adjustPos(position);
                    }
                    if (isYOverFlowSideHalf && (shouldReverseTopSide || shouldReverseBottomSide)) {
                        position = this._adjustPos(position, false, 'expand', shouldReverseTopSide ? 'Bottom' : 'Top');
                    }
                    break;
                case 'leftTop':
                    if (shouldReverseLeft) {
                        position = this._adjustPos(position);
                    }
                    if (shouldReverseTopSide && heightIsBigger) {
                        position = this._adjustPos(position, true); 
                    }
                    if (isHeightOverFlow && (isViewYEnoughSideHalf || isContanierYEnoughSideHalf)) {
                        position = this._adjustPos(position, false, 'reduce');
                    }
                    break;
                case 'leftBottom':
                    if (shouldReverseLeft) {
                        position = this._adjustPos(position);
                    }
                    if (shouldReverseBottomSide && heightIsBigger) {
                        position = this._adjustPos(position, true);
                    }
                    if (isHeightOverFlow && (isViewYEnoughSideHalf || isContanierYEnoughSideHalf)) {
                        position = this._adjustPos(position, false, 'reduce');
                    }
                    break;
                case 'bottom':
                    if (shouldReverseBottom) {
                        position = this._adjustPos(position, true);
                    }
                    if (isXOverFlowSideHalf && (shouldReverseLeftSide || shouldReverseRightSide)) {
                        position = this._adjustPos(position, true, 'expand', shouldReverseLeftSide ? 'Right' : 'Left');
                    }
                    break;
                case 'bottomLeft':
                    if (shouldReverseBottom) {
                        position = this._adjustPos(position, true);
                    }
                    if (shouldReverseLeftSide && widthIsBigger) {
                        position = this._adjustPos(position);
                    }
                    if (isWidthOverFlow && (isViewXEnoughSideHalf || isContanierXEnoughSideHalf)) {
                        position = this._adjustPos(position, true, 'reduce');
                    }
                    break;
                case 'bottomRight':
                    if (shouldReverseBottom) {
                        position = this._adjustPos(position, true);
                    }
                    if (shouldReverseRightSide && widthIsBigger) {
                        position = this._adjustPos(position);
                    }
                    if (isWidthOverFlow && (isViewXEnoughSideHalf || isContanierXEnoughSideHalf)) {
                        position = this._adjustPos(position, true, 'reduce');
                    }
                    break;
                case 'right':
                    if (shouldReverseRight) {
                        position = this._adjustPos(position);
                    }
                    if (isYOverFlowSideHalf && (shouldReverseTopSide || shouldReverseBottomSide)) {
                        position = this._adjustPos(position, false, 'expand', shouldReverseTopSide ? 'Bottom' : 'Top');
                    }
                    break;
                case 'rightTop':
                    if (shouldReverseRight) {
                        position = this._adjustPos(position);
                    }
                    if (shouldReverseTopSide && heightIsBigger) {
                        position = this._adjustPos(position, true);
                    }
                    if (isHeightOverFlow && (isViewYEnoughSideHalf || isContanierYEnoughSideHalf)) {
                        position = this._adjustPos(position, false, 'reduce');
                    }
                    break;
                case 'rightBottom':
                    if (shouldReverseRight) {
                        position = this._adjustPos(position);
                    }
                    if (shouldReverseBottomSide && heightIsBigger) {
                        position = this._adjustPos(position, true);
                    }
                    if (isHeightOverFlow && (isViewYEnoughSideHalf || isContanierYEnoughSideHalf)) {
                        position = this._adjustPos(position, false, 'reduce');
                    }
                    break;
                case 'leftTopOver':
                    if (shouldReverseTopOver) {
                        position = this._adjustPos(position, true);
                    }
                    if (shouldReverseLeftOver) {
                        position = this._adjustPos(position);
                    }
                    break;
                case 'leftBottomOver':
                    if (shouldReverseBottomOver) {
                        position = this._adjustPos(position, true);
                    }
                    if (shouldReverseLeftOver) {
                        position = this._adjustPos(position);
                    }
                    break;
                case 'rightTopOver':
                    if (shouldReverseTopOver) {
                        position = this._adjustPos(position, true);
                    }
                    if (shouldReverseRightOver) {
                        position = this._adjustPos(position);
                    }
                    break;
                case 'rightBottomOver':
                    if (shouldReverseBottomOver) {
                        position = this._adjustPos(position, true);
                    }
                    if (shouldReverseRightOver) {
                        position = this._adjustPos(position);
                    }
                    break;
                default:
                    break;
            }

            // 判断溢出 Judgment overflow
            // 上下方向 top and bottom
            if (this.isTB(position)){
                isHeightOverFlow = isViewYOverFlow && isContanierYOverFlow;
                if (position === 'top' || position === 'bottom') {
                    isWidthOverFlow = isViewXOverFlowSideHalf && isContanierXOverFlowSideHalf;
                } else {
                    isWidthOverFlow = isViewXOverFlowSide && isContanierXOverFlowSide;
                }
            }
            // 左右方向 left and right
            if (this.isLR(position)){
                isWidthOverFlow = isViewXOverFlow && isContanierXOverFlow;
                if (position === 'left' || position === 'right') {
                    isHeightOverFlow = isViewYOverFlowSideHalf && isContanierYOverFlowSideHalf;
                } else {
                    isHeightOverFlow = isViewYOverFlowSide && isContanierYOverFlowSide;
                }
            }
        }

        return { position, isHeightOverFlow, isWidthOverFlow };
    }

    delayHide = () => {
        const mouseLeaveDelay = this.getProp('mouseLeaveDelay');

        this.clearDelayTimer();

        if (mouseLeaveDelay > 0) {
            this._timer = setTimeout(() => {
                // console.log('delayHide for ', mouseLeaveDelay, ' ms, ', ...args);
                this.hide();
                this.clearDelayTimer();
            }, mouseLeaveDelay);
        } else {
            this.hide();
        }
    };

    hide = () => {
        this.clearDelayTimer();

        this._togglePortalVisible(false);

        this._adapter.off('portalInserted');
        this._adapter.off('positionUpdated');

        if (!this._adapter.canMotion()) {
            this._adapter.removePortal();
            // When the portal is removed, the global click outside event binding is also removed
            this._adapter.unregisterClickOutsideHandler();
            this._unBindScrollEvent();
            this._unBindResizeEvent();
        }
    };

    _bindScrollEvent() {
        this._adapter.registerScrollHandler(() => this.calcPosition());
        // Capture scroll events on the window to determine whether the current scrolling area (e.target) will affect the positioning of the pop-up layer relative to the viewport when scrolling
        // (By determining whether the e.target contains the triggerDom of the current tooltip) If so, the pop-up layer will also be affected and needs to be repositioned
    }

    _unBindScrollEvent() {
        this._adapter.unregisterScrollHandler();
    }

    _initContainerPosition() {
        this._adapter.updateContainerPosition();
    }

    handleContainerKeydown = (event: any) => {
        const { guardFocus, closeOnEsc } = this.getProps();
        switch (event && event.key) {
            case "Escape":
                closeOnEsc && this._handleEscKeyDown(event);
                break;
            case "Tab":
                if (guardFocus) {
                    const container = this._adapter.getContainer();
                    const focusableElements = this._adapter.getFocusableElements(container);
                    const focusableNum = focusableElements.length;
    
                    if (focusableNum) {
                        // Shift + Tab will move focus backward
                        if (event.shiftKey) {
                            this._handleContainerShiftTabKeyDown(focusableElements, event);
                        } else {
                            this._handleContainerTabKeyDown(focusableElements, event);
                        }
                    }
                }
                break;
            default:
                break;
        }
    }

    _handleTriggerKeydown(event: any) {
        const { closeOnEsc, disableArrowKeyDown } = this.getProps();
        const container = this._adapter.getContainer();
        const focusableElements = this._adapter.getFocusableElements(container);
        const focusableNum = focusableElements.length;
        
        switch (event && event.key) {
            case "Escape":
                handlePrevent(event);
                closeOnEsc && this._handleEscKeyDown(event);
                break;
            case "ArrowUp":
                // when disableArrowKeyDown is true, disable tooltip's arrow keyboard event action
                !disableArrowKeyDown && focusableNum && this._handleTriggerArrowUpKeydown(focusableElements, event);
                break;
            case "ArrowDown":
                !disableArrowKeyDown && focusableNum && this._handleTriggerArrowDownKeydown(focusableElements, event);
                break;
            default:
                break;
        }
    }

    /**
     * focus trigger 
     * 
     * when trigger is 'focus' or 'hover', onFocus is bind to show popup
     * if we focus trigger, popup will show again
     * 
     * 如果 trigger 是 focus 或者 hover，则它绑定了 onFocus，这里我们如果重新 focus 的话，popup 会再次打开
     * 因此 returnFocusOnClose 只支持 click trigger
     */
    _focusTrigger() {
        const { trigger, returnFocusOnClose, preventScroll } = this.getProps();
        if (returnFocusOnClose && trigger !== 'custom') {
            const triggerNode = this._adapter.getTriggerNode();
            if (triggerNode && 'focus' in triggerNode) {
                triggerNode.focus({ preventScroll });
            }
        }
    }

    _handleEscKeyDown(event: any) {
        const { trigger } = this.getProps();
        if (trigger !== 'custom') {
            // Move the focus into the trigger first and then close the pop-up layer 
            // to avoid the problem of opening the pop-up layer again when the focus returns to the trigger in the case of hover and focus
            this._focusTrigger();
            this.hide();
        }
        this._adapter.notifyEscKeydown(event);
    }

    _handleContainerTabKeyDown(focusableElements: any[], event: any) {
        const { preventScroll } = this.getProps();
        const activeElement = this._adapter.getActiveElement();
        const isLastCurrentFocus = focusableElements[focusableElements.length - 1] === activeElement;
        if (isLastCurrentFocus) {
            focusableElements[0].focus({ preventScroll });
            event.preventDefault(); // prevent browser default tab move behavior
        }
    }

    _handleContainerShiftTabKeyDown(focusableElements: any[], event: any) {
        const { preventScroll } = this.getProps();
        const activeElement = this._adapter.getActiveElement();
        const isFirstCurrentFocus = focusableElements[0] === activeElement;
        if (isFirstCurrentFocus) {
            focusableElements[focusableElements.length - 1].focus({ preventScroll });
            event.preventDefault(); // prevent browser default tab move behavior
        }
    }

    _handleTriggerArrowDownKeydown(focusableElements: any[], event: any) {
        const { preventScroll } = this.getProps();
        focusableElements[0].focus({ preventScroll });
        event.preventDefault(); // prevent browser default scroll behavior
    }

    _handleTriggerArrowUpKeydown(focusableElements: any[], event: any) {
        const { preventScroll } = this.getProps();
        focusableElements[focusableElements.length - 1].focus({ preventScroll });
        event.preventDefault(); // prevent browser default scroll behavior
    }
}
