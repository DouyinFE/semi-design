import React, { ReactNode, useRef } from 'react';
import classNames from 'classnames';
import PropTypes, { number } from 'prop-types';
import { ResizableFoundation, ResizableAdapter } from '@douyinfe/semi-foundation/resizable/foundation';

import { cssClasses, Direction, Size, Enable, ResizeStartCallback, ResizeCallback, NumberSize, calculateNewMax, clamp, DEFAULT_SIZE, findClosestSnap, getStringSize, hasDirection, NewSize, normalizeToPair, snap } from '@douyinfe/semi-foundation/resizable/constants';
import BaseComponent from '../../_base/baseComponent';
import Resizer from './resizer';

const prefixCls = cssClasses.PREFIX;

export interface ResizableProps {
    style?: React.CSSProperties;
    className?: string;
    grid?: [number, number];
    snap?: {
        x?: number[];
        y?: number[]
    };
    snapGap?: number;
    bounds?: 'parent' | 'window' | HTMLElement;
    boundsByDirection?: boolean;
    size?: Size;
    minWidth?: string | number;
    minHeight?: string | number;
    maxWidth?: string | number;
    maxHeight?: string | number;
    lockAspectRatio?: boolean | number;
    lockAspectRatioExtraWidth?: number;
    lockAspectRatioExtraHeight?: number;
    enable?: Enable | false;
    // handleStyles?: HandleStyles;
    // handleClasses?: HandleClassName;
    handleWrapperStyle?: React.CSSProperties;
    handleWrapperClass?: string;
    // handleComponent?: HandleComponent;
    children?: React.ReactNode;
    onResizeStart?: ResizeStartCallback;
    onResize?: ResizeCallback;
    onResizeStop?: ResizeCallback;
    defaultSize?: Size;
    scale?: number;
    resizeRatio?: number | [number, number]
}

export interface ResizableState {
    isResizing: boolean;
    direction: Direction;
    original: {
        x: number;
        y: number;
        width: number;
        height: number
    };
    width: number | string;
    height: number | string;

    backgroundStyle: React.CSSProperties;
    flexBasis?: string | number
}

class Resizable extends BaseComponent<ResizableProps, ResizableState> {
    static propTypes = {
        style: PropTypes.object,
        className: PropTypes.string,
        grid: PropTypes.arrayOf(number),
        snap: {
            x: PropTypes.arrayOf(number),
            y: PropTypes.arrayOf(number),
        },
        snapGap: PropTypes.number,
        bounds: PropTypes.oneOf(['parent', 'window', HTMLElement]),
        boundsByDirection: PropTypes.bool,
        size: PropTypes.object,
        minWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        minHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        lockAspectRatio: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
        lockAspectRatioExtraWidth: PropTypes.number,
        lockAspectRatioExtraHeight: PropTypes.number,
        enable: PropTypes.object,
        // handleStyles: HandleStyles,
        // handleClasses: HandleClassName,
        handleWrapperStyle: PropTypes.object,
        handleWrapperClass: PropTypes.string,
        // handleComponent: HandleComponent,
        children: PropTypes.object,
        onResizeStart: PropTypes.func,
        onResize: PropTypes.func,
        onResizeStop: PropTypes.func,
        defaultSize: PropTypes.object,
        scale: PropTypes.number,
        resizeRatio: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(number)]),
    };

    static defaultProps: Partial<ResizableProps> = {
        onResizeStart: () => {},
        onResize: () => {},
        onResizeStop: () => {},
        enable: {
            top: true,
            right: true,
            bottom: true,
            left: true,
            topRight: true,
            bottomRight: true,
            bottomLeft: true,
            topLeft: true,
        },
        style: {},
        grid: [1, 1],
        lockAspectRatio: false,
        lockAspectRatioExtraWidth: 0,
        lockAspectRatioExtraHeight: 0,
        scale: 1,
        resizeRatio: 1,
        snapGap: 0,
    };
    flexDir?: 'row' | 'column';

    ratio = 1;
    resizable: HTMLElement | null = null;
    // For parent boundary
    parentLeft = 0;
    parentTop = 0;
    // For boundary
    resizableLeft = 0;
    resizableRight = 0;
    resizableTop = 0;
    resizableBottom = 0;
    // For target boundary
    targetLeft = 0;
    targetTop = 0;

    get parentNode(): HTMLElement | null {
        if (!this.resizable) {
            return null;
        }
        return this.resizable.parentNode as HTMLElement;
    }

    get window(): Window | null {
        if (!this.resizable) {
            return null;
        }
        if (!this.resizable.ownerDocument) {
            return null;
        }
        return this.resizable.ownerDocument.defaultView as Window;
    }

    get propsSize(): Size {
        return this.props.size || this.props.defaultSize || DEFAULT_SIZE;
    }

    get size(): NumberSize {
        let width = 0;
        let height = 0;
        if (this.resizable && this.window) {
            const orgWidth = this.resizable.offsetWidth;
            const orgHeight = this.resizable.offsetHeight;
            const orgPosition = this.resizable.style.position;
            if (orgPosition !== 'relative') {
                this.resizable.style.position = 'relative';
            }
            width = this.resizable.style.width !== 'auto' ? this.resizable.offsetWidth : orgWidth;
            height = this.resizable.style.height !== 'auto' ? this.resizable.offsetHeight : orgHeight;
            this.resizable.style.position = orgPosition;
        }
        return { width, height };
    }

    get sizeStyle(): { width: string; height: string } {
        const { size } = this.props;
        const getSize = (key: 'width' | 'height'): string => {
            if (typeof this.state[key] === 'undefined' || this.state[key] === 'auto') {
                return 'auto';
            }
            if (this.propsSize && this.propsSize[key] && this.propsSize[key]?.toString().endsWith('%')) {
                if (this.state[key].toString().endsWith('%')) {
                    return this.state[key].toString();
                }
                const parentSize = this.getParentSize();
                const value = Number(this.state[key].toString().replace('px', ''));
                const percent = (value / parentSize[key]) * 100;
                return `${percent}%`;
            }
            return getStringSize(this.state[key]);
        };
        const width =
            size && typeof size.width !== 'undefined' && !this.state.isResizing
                ? getStringSize(size.width)
                : getSize('width');
        const height =
            size && typeof size.height !== 'undefined' && !this.state.isResizing
                ? getStringSize(size.height)
                : getSize('height');
        return { width, height };
    }

    getParentSize(): { width: number; height: number } {
        if (!this.parentNode) {
            if (!this.window) {
                return { width: 0, height: 0 };
            }
            return { width: this.window.innerWidth, height: this.window.innerHeight };
        }
        const base = this.appendBase();
        if (!base) {
            return { width: 0, height: 0 };
        }
        let wrapChanged = false;
        const wrap = this.parentNode.style.flexWrap;
        if (wrap !== 'wrap') {
            wrapChanged = true;
            this.parentNode.style.flexWrap = 'wrap';
        }
        base.style.position = 'relative';
        base.style.minWidth = '100%';
        base.style.minHeight = '100%';
        const size = {
            width: base.offsetWidth,
            height: base.offsetHeight,
        };
        if (wrapChanged) {
            this.parentNode.style.flexWrap = wrap;
        }
        this.removeBase(base);
        return size;
    }

    appendBase = () => {
        if (!this.resizable || !this.window) {
            return null;
        }
        const parent = this.parentNode;
        if (!parent) {
            return null;
        }
        const element = this.window.document.createElement('div');
        element.style.width = '100%';
        element.style.height = '100%';
        element.style.position = 'absolute';
        element.style.transform = 'scale(0, 0)';
        element.style.left = '0';
        element.style.flex = '0 0 100%';
        if (element.classList) {
            element.classList.add(prefixCls);
        } else {
            element.className += prefixCls;
        }
        parent.appendChild(element);
        return element;
    };

    removeBase = (base: HTMLElement) => {
        const parent = this.parentNode;
        if (!parent) {
            return;
        }
        parent.removeChild(base);
    };

    constructor(props: ResizableProps) {
        super(props);
        this.state = {
            isResizing: false,
            width: this.propsSize?.width ?? 'auto',
            height: this.propsSize?.height ?? 'auto',
            direction: 'right',
            original: {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            },
            backgroundStyle: {
                height: '100%',
                width: '100%',
                backgroundColor: 'rgba(0,0,0,0)',
                cursor: 'auto',
                opacity: 0,
                position: 'fixed',
                zIndex: 9999,
                top: '0',
                left: '0',
                bottom: '0',
                right: '0',
            },
            flexBasis: undefined,
        };
        this.onResizeStart = this.onResizeStart.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

        this.foundation = new ResizableFoundation(this.adapter);
    }

    bindEvents() {
        if (this.window) {
            this.window.addEventListener('mouseup', this.onMouseUp);
            this.window.addEventListener('mousemove', this.onMouseMove);
            this.window.addEventListener('mouseleave', this.onMouseUp);
        }
    }

    unbindEvents() {
        if (this.window) {
            this.window.removeEventListener('mouseup', this.onMouseUp);
            this.window.removeEventListener('mousemove', this.onMouseMove);
            this.window.removeEventListener('mouseleave', this.onMouseUp);
        }
    }


    componentDidMount() {
        this.foundation.init();
        if (!this.resizable || !this.window) {
            return;
        }
        const computedStyle = this.window.getComputedStyle(this.resizable);
        this.setState({
            width: this.state.width || this.size.width,
            height: this.state.height || this.size.height,
            flexBasis: computedStyle.flexBasis !== 'auto' ? computedStyle.flexBasis : undefined,
        });
    }

    componentDidUpdate(_prevProps: ResizableProps) {

    }

    componentWillUnmount() {
        this.foundation.destroy();
        if (this.window) {
            this.unbindEvents();
        }
    }

    createSizeForCssProperty(newSize: number | string, kind: 'width' | 'height'): number | string {
        const propsSize = this.propsSize && this.propsSize[kind];
        return this.state[kind] === 'auto' &&
            this.state.original[kind] === newSize &&
            (typeof propsSize === 'undefined' || propsSize === 'auto')
            ? 'auto'
            : newSize;
    }

    calculateNewMaxFromBoundary(maxWidth?: number, maxHeight?: number) {
        const { boundsByDirection } = this.props;
        const { direction } = this.state;
        const widthByDirection = boundsByDirection && hasDirection('left', direction);
        const heightByDirection = boundsByDirection && hasDirection('top', direction);
        let boundWidth;
        let boundHeight;
        if (this.props.bounds === 'parent') {
            const parent = this.parentNode;
            if (parent) {
                boundWidth = widthByDirection
                    ? this.resizableRight - this.parentLeft
                    : parent.offsetWidth + (this.parentLeft - this.resizableLeft);
                boundHeight = heightByDirection
                    ? this.resizableBottom - this.parentTop
                    : parent.offsetHeight + (this.parentTop - this.resizableTop);
            }
        } else if (this.props.bounds === 'window') {
            if (this.window) {
                boundWidth = widthByDirection ? this.resizableRight : this.window.innerWidth - this.resizableLeft;
                boundHeight = heightByDirection ? this.resizableBottom : this.window.innerHeight - this.resizableTop;
            }
        } else if (this.props.bounds) {
            boundWidth = widthByDirection
                ? this.resizableRight - this.targetLeft
                : this.props.bounds.offsetWidth + (this.targetLeft - this.resizableLeft);
            boundHeight = heightByDirection
                ? this.resizableBottom - this.targetTop
                : this.props.bounds.offsetHeight + (this.targetTop - this.resizableTop);
        }
        if (boundWidth && Number.isFinite(boundWidth)) {
            maxWidth = maxWidth && maxWidth < boundWidth ? maxWidth : boundWidth;
        }
        if (boundHeight && Number.isFinite(boundHeight)) {
            maxHeight = maxHeight && maxHeight < boundHeight ? maxHeight : boundHeight;
        }
        return { maxWidth, maxHeight };
    }

    calculateNewSizeFromDirection(clientX: number, clientY: number) {
        const scale = this.props.scale || 1;
        const [resizeRatioX, resizeRatioY] = normalizeToPair(this.props.resizeRatio || 1);
        const { direction, original } = this.state;
        const { lockAspectRatio, lockAspectRatioExtraHeight, lockAspectRatioExtraWidth } = this.props;
        let newWidth = original.width;
        let newHeight = original.height;
        const extraHeight = lockAspectRatioExtraHeight || 0;
        const extraWidth = lockAspectRatioExtraWidth || 0;
        if (hasDirection('right', direction)) {
            newWidth = original.width + ((clientX - original.x) * resizeRatioX) / scale;
            if (lockAspectRatio) {
                newHeight = (newWidth - extraWidth) / this.ratio + extraHeight;
            }
        }
        if (hasDirection('left', direction)) {
            newWidth = original.width - ((clientX - original.x) * resizeRatioX) / scale;
            if (lockAspectRatio) {
                newHeight = (newWidth - extraWidth) / this.ratio + extraHeight;
            }
        }
        if (hasDirection('bottom', direction)) {
            newHeight = original.height + ((clientY - original.y) * resizeRatioY) / scale;
            if (lockAspectRatio) {
                newWidth = (newHeight - extraHeight) * this.ratio + extraWidth;
            }
        }
        if (hasDirection('top', direction)) {
            newHeight = original.height - ((clientY - original.y) * resizeRatioY) / scale;
            if (lockAspectRatio) {
                newWidth = (newHeight - extraHeight) * this.ratio + extraWidth;
            }
        }
        return { newWidth, newHeight };
    }

    calculateNewSizeFromAspectRatio(
        newWidth: number,
        newHeight: number,
        max: { width?: number; height?: number },
        min: { width?: number; height?: number },
    ) {
        const { lockAspectRatio, lockAspectRatioExtraHeight, lockAspectRatioExtraWidth } = this.props;
        const computedMinWidth = typeof min.width === 'undefined' ? 10 : min.width;
        const computedMaxWidth = typeof max.width === 'undefined' || max.width < 0 ? newWidth : max.width;
        const computedMinHeight = typeof min.height === 'undefined' ? 10 : min.height;
        const computedMaxHeight = typeof max.height === 'undefined' || max.height < 0 ? newHeight : max.height;
        const extraHeight = lockAspectRatioExtraHeight || 0;
        const extraWidth = lockAspectRatioExtraWidth || 0;
        if (lockAspectRatio) {
            const extraMinWidth = (computedMinHeight - extraHeight) * this.ratio + extraWidth;
            const extraMaxWidth = (computedMaxHeight - extraHeight) * this.ratio + extraWidth;
            const extraMinHeight = (computedMinWidth - extraWidth) / this.ratio + extraHeight;
            const extraMaxHeight = (computedMaxWidth - extraWidth) / this.ratio + extraHeight;
            const lockedMinWidth = Math.max(computedMinWidth, extraMinWidth);
            const lockedMaxWidth = Math.min(computedMaxWidth, extraMaxWidth);
            const lockedMinHeight = Math.max(computedMinHeight, extraMinHeight);
            const lockedMaxHeight = Math.min(computedMaxHeight, extraMaxHeight);
            newWidth = clamp(newWidth, lockedMinWidth, lockedMaxWidth);
            newHeight = clamp(newHeight, lockedMinHeight, lockedMaxHeight);
        } else {
            newWidth = clamp(newWidth, computedMinWidth, computedMaxWidth);
            newHeight = clamp(newHeight, computedMinHeight, computedMaxHeight);
        }
        return { newWidth, newHeight };
    }

    setBoundingClientRect() {
        // For parent boundary
        if (this.props.bounds === 'parent') {
            const parent = this.parentNode;
            if (parent) {
                const parentRect = parent.getBoundingClientRect();
                this.parentLeft = parentRect.left;
                this.parentTop = parentRect.top;
            }
        }

        // For target(html element) boundary
        if (this.props.bounds && typeof this.props.bounds !== 'string') {
            const targetRect = this.props.bounds.getBoundingClientRect();
            this.targetLeft = targetRect.left;
            this.targetTop = targetRect.top;
        }

        // For boundary
        if (this.resizable) {
            const { left, top, right, bottom } = this.resizable.getBoundingClientRect();
            this.resizableLeft = left;
            this.resizableRight = right;
            this.resizableTop = top;
            this.resizableBottom = bottom;
        }
    }

    

    onResizeStart(event: MouseEvent, direction: Direction) {
        if (!this.resizable || !this.window) {
            return;
        }
        
        let e = event as unknown as React.MouseEvent<HTMLElement>;
        let clientX = 0;
        let clientY = 0;
        clientX = e.clientX;
        clientY = e.clientY;
        if (this.props.onResizeStart) {
            if (this.resizable) {
                const startResize = this.props.onResizeStart(event, direction, this.resizable);
                if (startResize === false) {
                    return;
                }
            }
        }

        if (this.props.size) {
            if (typeof this.props.size.height !== 'undefined' && this.props.size.height !== this.state.height) {
                this.setState({ height: this.props.size.height });
            }
            if (typeof this.props.size.width !== 'undefined' && this.props.size.width !== this.state.width) {
                this.setState({ width: this.props.size.width });
            }
        }

        // For lockAspectRatio case
        this.ratio =
            typeof this.props.lockAspectRatio === 'number' ? this.props.lockAspectRatio : this.size.width / this.size.height;

        let flexBasis: string;
        const computedStyle = this.window.getComputedStyle(this.resizable);
        if (computedStyle.flexBasis !== 'auto') {
            const parent = this.parentNode;
            if (parent) {
                const dir = this.window.getComputedStyle(parent).flexDirection;
                this.flexDir = dir.startsWith('row') ? 'row' : 'column';
                flexBasis = computedStyle.flexBasis;
            }
        }
        // For boundary
        this.setBoundingClientRect();
        this.bindEvents();
        const state = {
            original: {
                x: clientX,
                y: clientY,
                width: this.size.width,
                height: this.size.height,
            },
            isResizing: true,
            backgroundStyle: {
                ...this.state.backgroundStyle,
                cursor: this.window.getComputedStyle(event.target as HTMLElement).cursor || 'auto',
            },
            direction,
            flexBasis,
        };

        this.setState(state);
    }

    onMouseMove(event: MouseEvent) {
        if (!this.state.isResizing || !this.resizable || !this.window) {
            return;
        }
        let { maxWidth, maxHeight, minWidth, minHeight } = this.props;
        const clientX = event.clientX;
        const clientY = event.clientY;
        const { direction, original, width, height } = this.state;
        const parentSize = this.getParentSize();
        const max = calculateNewMax(
            parentSize,
            this.window.innerWidth,
            this.window.innerHeight,
            maxWidth,
            maxHeight,
            minWidth,
            minHeight,
        );

        maxWidth = max.maxWidth;
        maxHeight = max.maxHeight;
        minWidth = max.minWidth;
        minHeight = max.minHeight;

        // Calculate new size
        let { newHeight, newWidth }: NewSize = this.calculateNewSizeFromDirection(clientX, clientY);

        // Calculate max size from boundary settings
        const boundaryMax = this.calculateNewMaxFromBoundary(maxWidth, maxHeight);

        if (this.props.snap && this.props.snap.x) {
            newWidth = findClosestSnap(newWidth, this.props.snap.x, this.props.snapGap);
        }
        if (this.props.snap && this.props.snap.y) {
            newHeight = findClosestSnap(newHeight, this.props.snap.y, this.props.snapGap);
        }

        // Calculate new size from aspect ratio
        const newSize = this.calculateNewSizeFromAspectRatio(
            newWidth,
            newHeight,
            { width: boundaryMax.maxWidth, height: boundaryMax.maxHeight },
            { width: minWidth, height: minHeight },
        );
        newWidth = newSize.newWidth;
        newHeight = newSize.newHeight;

        if (this.props.grid) {
            const newGridWidth = snap(newWidth, this.props.grid[0]);
            const newGridHeight = snap(newHeight, this.props.grid[1]);
            const gap = this.props.snapGap || 0;
            const w = gap === 0 || Math.abs(newGridWidth - newWidth) <= gap ? newGridWidth : newWidth;
            const h = gap === 0 || Math.abs(newGridHeight - newHeight) <= gap ? newGridHeight : newHeight;
            newWidth = w;
            newHeight = h;
        }

        const delta = {
            width: newWidth - original.width,
            height: newHeight - original.height,
        };

        if (width && typeof width === 'string') {
            if (width.endsWith('%')) {
                const percent = (newWidth / parentSize.width) * 100;
                newWidth = `${percent}%`;
            } else if (width.endsWith('vw')) {
                const vw = (newWidth / this.window.innerWidth) * 100;
                newWidth = `${vw}vw`;
            } else if (width.endsWith('vh')) {
                const vh = (newWidth / this.window.innerHeight) * 100;
                newWidth = `${vh}vh`;
            }
        }

        if (height && typeof height === 'string') {
            if (height.endsWith('%')) {
                const percent = (newHeight / parentSize.height) * 100;
                newHeight = `${percent}%`;
            } else if (height.endsWith('vw')) {
                const vw = (newHeight / this.window.innerWidth) * 100;
                newHeight = `${vw}vw`;
            } else if (height.endsWith('vh')) {
                const vh = (newHeight / this.window.innerHeight) * 100;
                newHeight = `${vh}vh`;
            }
        }

        const newState: { width: string | number; height: string | number; flexBasis?: string | number } = {
            width: this.createSizeForCssProperty(newWidth, 'width'),
            height: this.createSizeForCssProperty(newHeight, 'height'),
        };

        if (this.flexDir === 'row') {
            newState.flexBasis = newState.width;
        } else if (this.flexDir === 'column') {
            newState.flexBasis = newState.height;
        }

        const widthChanged = this.state.width !== newState.width;
        const heightChanged = this.state.height !== newState.height;
        const flexBaseChanged = this.state.flexBasis !== newState.flexBasis;
        const changed = widthChanged || heightChanged || flexBaseChanged;

        if (changed) {
            // For v18, update state sync
            this.setState(newState);
        }

        if (this.props.onResize) {
            if (changed) {
                this.props.onResize(event, direction, this.resizable, delta);
            }
        }
    }

    onMouseUp(event: MouseEvent) {
        const { isResizing, direction, original } = this.state;
        if (!isResizing || !this.resizable) {
            return;
        }
        const delta = {
            width: this.size.width - original.width,
            height: this.size.height - original.height,
        };
        if (this.props.onResizeStop) {
            this.props.onResizeStop(event, direction, this.resizable, delta);
        }
        if (this.props.size) {
            this.setState({ width: this.props.size.width ?? 'auto', height: this.props.size.height ?? 'auto' });
        }
        this.unbindEvents();
        this.setState({
            isResizing: false,
            backgroundStyle: { ...this.state.backgroundStyle, cursor: 'auto' },
        });
    }

    updateSize(size: Size) {
        this.setState({ width: size.width ?? 'auto', height: size.height ?? 'auto' });
    }

    get adapter(): ResizableAdapter<ResizableProps, ResizableState> {
        return {
            ...super.adapter,
        };
    }

    renderResizer() {
        const { enable, handleWrapperStyle, handleWrapperClass } = this.props;
        if (!enable) {
            return null;
        }
        const resizers = Object.keys(enable).map(dir => {
            if (enable[dir as Direction] !== false) {
                return (
                    <Resizer
                        key={dir}
                        direction={dir as Direction}
                        onResizeStart={this.onResizeStart}
                    // replaceStyles={handleStyles && handleStyles[dir as Direction]}
                    // className
                    >
                    </Resizer>
                );
            }
            return null;
        });
 
        return (
            <div className={handleWrapperClass} style={handleWrapperStyle}>
                {resizers}
            </div>
        );
    }

    render() {
        const style: React.CSSProperties = {
            position: 'relative',
            userSelect: this.state.isResizing ? 'none' : 'auto',
            ...this.props.style,
            ...this.sizeStyle,
            maxWidth: this.props.maxWidth,
            maxHeight: this.props.maxHeight,
            minWidth: this.props.minWidth,
            minHeight: this.props.minHeight,
            boxSizing: 'border-box',
            flexShrink: 0,
        };

        if (this.state.flexBasis) {
            style.flexBasis = this.state.flexBasis;
        }

        console.log(style);
        console.log(this.state);

        return (
            <div
                style={style}
                className={this.props.className}
                ref={(c: HTMLElement | null) => {
                    if (c) {
                        this.resizable = c;
                    }
                }}
            >
                {this.state.isResizing && <div style={this.state.backgroundStyle} />}
                {this.props.children}
                {this.renderResizer()}
            </div>
        );
    }
}

export default Resizable;