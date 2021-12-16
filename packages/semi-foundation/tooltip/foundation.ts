/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring, max-lines-per-function, one-var, max-len, @typescript-eslint/restrict-plus-operands */
/* argus-disable unPkgSensitiveInfo */
import { get, isEmpty } from 'lodash';
import { DOMRectLikeType } from '../utils/dom';
import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { ArrayElement } from '../utils/type';
import { strings } from './constants';

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
        this._mounted = true;
        this._bindEvent();
        this._shouldShow();
        this._initContainerPosition();
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

    clearDelayTimer() {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
    }

    _generateEvent(types: ArrayElement<typeof strings.TRIGGER_SET>) {
        const eventNames = this._adapter.getEventName();
        const triggerEventSet = {};
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
                // show/hide completely depond on props.visible which change by user
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

        const position = this.calcPosition(null, null, null, false);

        this._adapter.insertPortal(content, position);

        if (trigger === 'custom') {
            // eslint-disable-next-line
            this._adapter.registerClickOutsideHandler(() => {});
            this._togglePortalVisible(true);
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
            this._adapter.togglePortalVisible(isVisible, () => this._adapter.notifyVisibleChange(isVisible));
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

    calcPosStyle(triggerRect: DOMRect, wrapperRect: DOMRect, containerRect: PopupContainerDOMRect, position?: Position, spacing?: number) {
        triggerRect = (isEmpty(triggerRect) ? triggerRect : this._adapter.getTriggerBounding()) || { ...defaultRect as any };
        containerRect = (isEmpty(containerRect) ? containerRect : this._adapter.getPopupContainerRect()) || {
            ...defaultRect,
        };
        wrapperRect = (isEmpty(wrapperRect) ? wrapperRect : this._adapter.getWrapperBounding()) || { ...defaultRect as any };
        // eslint-disable-next-line
        position = position != null ? position : this.getProp('position');
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

        switch (position) {
            case 'top':
                left = middleX;
                top = triggerRect.top - SPACING;
                translateX = -0.5;
                translateY = -1;
                break;
            case 'topLeft':
                left = pointAtCenter ? middleX - offsetXWithArrow : triggerRect.left;
                top = triggerRect.top - SPACING;
                translateY = -1;
                break;
            case 'topRight':
                left = pointAtCenter ? middleX + offsetXWithArrow : triggerRect.right;
                top = triggerRect.top - SPACING;
                translateY = -1;
                translateX = -1;
                break;
            case 'left':
                left = triggerRect.left - SPACING;
                top = middleY;
                translateX = -1;
                translateY = -0.5;
                break;
            case 'leftTop':
                left = triggerRect.left - SPACING;
                top = pointAtCenter ? middleY - offsetYWithArrow : triggerRect.top;
                translateX = -1;
                break;
            case 'leftBottom':
                left = triggerRect.left - SPACING;
                top = pointAtCenter ? middleY + offsetYWithArrow : triggerRect.bottom;
                translateX = -1;
                translateY = -1;
                break;
            case 'bottom':
                left = middleX;
                top = triggerRect.top + triggerRect.height + SPACING;
                translateX = -0.5;
                break;
            case 'bottomLeft':
                left = pointAtCenter ? middleX - offsetXWithArrow : triggerRect.left;
                top = triggerRect.bottom + SPACING;
                break;
            case 'bottomRight':
                left = pointAtCenter ? middleX + offsetXWithArrow : triggerRect.right;
                top = triggerRect.bottom + SPACING;
                translateX = -1;
                break;
            case 'right':
                left = triggerRect.right + SPACING;
                top = middleY;
                translateY = -0.5;
                break;
            case 'rightTop':
                left = triggerRect.right + SPACING;
                top = pointAtCenter ? middleY - offsetYWithArrow : triggerRect.top;
                break;
            case 'rightBottom':
                left = triggerRect.right + SPACING;
                top = pointAtCenter ? middleY + offsetYWithArrow : triggerRect.bottom;
                translateY = -1;
                break;
            case 'leftTopOver':
                left = triggerRect.left;
                top = triggerRect.top;
                break;
            case 'rightTopOver':
                left = triggerRect.right;
                top = triggerRect.top;
                translateX = -1;
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

        let style = this.calcPosStyle(triggerRect, wrapperRect, containerRect);

        let position = this.getProp('position');

        if (this.getProp('autoAdjustOverflow')) {
            // console.log('style: ', style, '\ntriggerRect: ', triggerRect, '\nwrapperRect: ', wrapperRect);
            const adjustedPos = this.adjustPosIfNeed(position, style, triggerRect, wrapperRect, containerRect);

            if (position !== adjustedPos) {
                position = adjustedPos;

                style = this.calcPosStyle(triggerRect, wrapperRect, containerRect, position);
            }
        }

        if (shouldUpdatePos && this._mounted) {
            // this._adapter.updatePlacementAttr(style.position);
            this._adapter.setPosition({ ...style, position });
        }

        return style;
    };

    isLR(position = '') {
        return position.indexOf('left') === 0 || position.indexOf('right') === 0;
    }

    isTB(position = '') {
        return position.indexOf('top') === 0 || position.indexOf('bottom') === 0;
    }

    // place the dom correctly
    adjustPosIfNeed(position: Position | string, style: Record<string, any>, triggerRect: DOMRect, wrapperRect: DOMRect, containerRect: PopupContainerDOMRect) {
        const { innerWidth, innerHeight } = window;

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

            const shouldReverseTop = clientTop < wrapperRect.height && restClientBottom > wrapperRect.height;
            const shouldReverseLeft = clientLeft < wrapperRect.width && restClientRight > wrapperRect.width;
            const sholdReverseBottom = restClientBottom < wrapperRect.height && clientTop > wrapperRect.height;
            const shouldReverseRight = restClientRight < wrapperRect.width && clientLeft > wrapperRect.width;

            const shouldReverseTopSide = restClientTop < wrapperRect.height && clientBottom > wrapperRect.height;
            const shouldReverseBottomSide = clientBottom < wrapperRect.height && restClientTop > wrapperRect.height;
            const shouldReverseLeftSide = restClientLeft < wrapperRect.width && clientRight > wrapperRect.width;
            const shouldReverseRightSide = clientRight < wrapperRect.width && restClientLeft > wrapperRect.width;

            switch (position) {
                case 'top':
                    if (shouldReverseTop) {
                        position = this._reversePos(position, true);
                    }
                    break;
                case 'topLeft':
                    if (shouldReverseTop) {
                        position = this._reversePos(position, true);
                    }
                    if (shouldReverseLeftSide && widthIsBigger) {
                        position = this._reversePos(position);
                    }
                    break;
                case 'topRight':
                    if (shouldReverseTop) {
                        position = this._reversePos(position, true);
                    }
                    if (shouldReverseRightSide && widthIsBigger) {
                        position = this._reversePos(position);
                    }
                    break;
                case 'left':
                    if (shouldReverseLeft) {
                        position = this._reversePos(position);
                    }
                    break;
                case 'leftTop':
                    if (shouldReverseLeft) {
                        position = this._reversePos(position);
                    }
                    if (shouldReverseTopSide && heightIsBigger) {
                        position = this._reversePos(position, true);
                    }
                    break;
                case 'leftBottom':
                    if (shouldReverseLeft) {
                        position = this._reversePos(position);
                    }
                    if (shouldReverseBottomSide && heightIsBigger) {
                        position = this._reversePos(position, true);
                    }
                    break;
                case 'bottom':
                    if (sholdReverseBottom) {
                        position = this._reversePos(position, true);
                    }
                    break;
                case 'bottomLeft':
                    if (sholdReverseBottom) {
                        position = this._reversePos(position, true);
                    }
                    if (shouldReverseLeftSide && widthIsBigger) {
                        position = this._reversePos(position);
                    }
                    break;
                case 'bottomRight':
                    if (sholdReverseBottom) {
                        position = this._reversePos(position, true);
                    }
                    if (shouldReverseRightSide && widthIsBigger) {
                        position = this._reversePos(position);
                    }
                    break;
                case 'right':
                    if (shouldReverseRight) {
                        position = this._reversePos(position);
                    }
                    break;
                case 'rightTop':
                    if (shouldReverseRight) {
                        position = this._reversePos(position);
                    }
                    if (shouldReverseTopSide && heightIsBigger) {
                        position = this._reversePos(position, true);
                    }
                    break;
                case 'rightBottom':
                    if (shouldReverseRight) {
                        position = this._reversePos(position);
                    }
                    if (shouldReverseBottomSide && heightIsBigger) {
                        position = this._reversePos(position, true);
                    }
                    break;
                default:
                    break;
            }
        }

        return position;
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
}
