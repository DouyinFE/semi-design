import React, { createRef, CSSProperties, ReactNode, useRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ResizableFoundation, ResizableAdapter } from '@douyinfe/semi-foundation/resizable/foundation';

import { cssClasses, } from '@douyinfe/semi-foundation/resizable/constants';
import { Direction, Size, Enable, ResizeStartCallback, ResizeCallback, HandleClassName, directions } from '@douyinfe/semi-foundation/resizable/singleConstants';
import BaseComponent from '../../_base/baseComponent';
import ResizableHandler from './resizableHandler';

const prefixCls = cssClasses.PREFIX;
export interface HandleComponent {
    top?: ReactNode;
    right?: ReactNode;
    bottom?: ReactNode;
    left?: ReactNode;
    topRight?: ReactNode;
    bottomRight?: ReactNode;
    bottomLeft?: ReactNode;
    topLeft?: ReactNode
}

export interface HandleStyle {
    top?: CSSProperties;
    right?: CSSProperties;
    bottom?: CSSProperties;
    left?: CSSProperties;
    topRight?: CSSProperties;
    bottomRight?: CSSProperties;
    bottomLeft?: CSSProperties;
    topLeft?: CSSProperties
}

export interface ResizableProps {
    style?: React.CSSProperties;
    className?: string;
    grid?: [number, number];
    snap?: {
        x?: number[];
        y?: number[]
    };
    snapGap?: number;
    boundElement?: 'parent' | 'window' | HTMLElement;
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
    handleStyle?: HandleStyle;
    handleClass?: HandleClassName;
    handleWrapperStyle?: React.CSSProperties;
    handleWrapperClass?: string;
    handleNode?: HandleComponent;
    children?: React.ReactNode;
    onResizeStart?: ResizeStartCallback;
    onChange?: ResizeCallback;
    onResizeEnd?: ResizeCallback;
    defaultSize?: Size;
    scale?: number;
    ratio?: number | [number, number]
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
        grid: PropTypes.arrayOf(PropTypes.number),
        snap: PropTypes.shape({
            x: PropTypes.arrayOf(PropTypes.number),
            y: PropTypes.arrayOf(PropTypes.number),
        }),        
        snapGap: PropTypes.number,
        bounds: PropTypes.oneOf(['parent', 'window', PropTypes.node]),
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
        handleStyle: PropTypes.object,
        handleClass: PropTypes.object,
        handleWrapperStyle: PropTypes.object,
        handleWrapperClass: PropTypes.string,
        handleNode: PropTypes.object,
        children: PropTypes.object,
        onResizeStart: PropTypes.func,
        onChange: PropTypes.func,
        onResizeEnd: PropTypes.func,
        defaultSize: PropTypes.object,
        scale: PropTypes.number,
        ratio: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
    };

    static defaultProps: Partial<ResizableProps> = {
        onResizeStart: () => {},
        onChange: () => {},
        onResizeEnd: () => {},
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
        ratio: 1,
        snapGap: 0,
    };

    foundation: ResizableFoundation;
    resizableRef: React.RefObject<HTMLDivElement | null>;;
    constructor(props: ResizableProps) {
        super(props);
        this.resizableRef = createRef<HTMLDivElement | null>();
        this.foundation = new ResizableFoundation(this.adapter);
        this.state = {
            isResizing: false,
            width: this.foundation.propSize.width ?? 'auto',
            height: this.foundation.propSize.height ?? 'auto',
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
    }


    componentDidMount() {
        this.foundation.init();
    }

    componentDidUpdate(_prevProps: ResizableProps) {
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    getResizable = () => {
        return this.resizableRef?.current   ;
    }

    get adapter(): ResizableAdapter<ResizableProps, ResizableState> {
        return {
            ...super.adapter,
            getResizable: this.getResizable,
        };
    }

    renderResizeHandler = () => {
        const { enable, handleStyle, handleClass, handleNode, handleWrapperStyle, handleWrapperClass } = this.props;
        if (!enable) {
            return null;
        }
        const handlers = directions.map(dir => {
            if (enable[dir as Direction] !== false) {
                return (
                    <ResizableHandler
                        key={dir}
                        direction={dir as Direction}
                        onResizeStart={this.foundation.onResizeStart}
                        style={handleStyle && handleStyle[dir]}
                        className={handleClass && handleClass[dir]}
                    >
                        {handleNode?.[dir] ?? null}
                    </ResizableHandler>
                );
            }
            return null;
        });
 
        return (
            <div className={handleWrapperClass} style={handleWrapperStyle}>
                {handlers}
            </div>
        );
    }

    render() {
        const {className, style, children,
            maxHeight, maxWidth, minHeight, minWidth, size,} = this.props;
        const resizeStyle: React.CSSProperties = {
            position: 'relative',
            userSelect: this.state.isResizing ? 'none' : 'auto',
            ...style,
            ...this.foundation.sizeStyle,
            maxWidth: maxWidth,
            maxHeight: maxHeight,
            minWidth: minWidth,
            minHeight: minHeight,
            boxSizing: 'border-box',
            flexShrink: 0,
        };

        if (this.state?.flexBasis) {
            style.flexBasis = this.state.flexBasis;
        }

        return (
            <div
                style={resizeStyle}
                className={classNames(className, prefixCls)}
                ref={this.resizableRef}
                {...this.getDataAttr(this.props)}
            >
                {this.state.isResizing && <div style={this.state.backgroundStyle} />}
                {children}
                {size ? null : this.renderResizeHandler()}
            </div>
        );
    }
}

export default Resizable;