import React, { ReactNode, useRef } from 'react';
import classNames from 'classnames';
import PropTypes, { number } from 'prop-types';
import { ResizableFoundation, ResizableAdapter } from '@douyinfe/semi-foundation/resizable/foundation';

import { cssClasses, Direction, Size, Enable, ResizeStartCallback, ResizeCallback, HandleStyles, HandleClassName, HandleComponent } from '@douyinfe/semi-foundation/resizable/constants';
import BaseComponent from '../../_base/baseComponent';
import ResizeHandler from './resizeHandler';

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
    handleStyles?: HandleStyles;
    handleClasses?: HandleClassName;
    handleWrapperStyle?: React.CSSProperties;
    handleWrapperClass?: string;
    handleComponent?: HandleComponent;
    children?: React.ReactNode;
    onResizeStart?: ResizeStartCallback;
    onResize?: ResizeCallback;
    onResizeStop?: ResizeCallback;
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
        ratio: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(number)]),
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
        ratio: 1,
        snapGap: 0,
    };

    constructor(props: ResizableProps) {
        super(props);
        this.foundation = new ResizableFoundation(this.adapter);
        this.state = {
            isResizing: false,
            width: this.foundation.propsSize?.width ?? 'auto',
            height: this.foundation.propsSize?.height ?? 'auto',
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

    get adapter(): ResizableAdapter<ResizableProps, ResizableState> {
        return {
            ...super.adapter,
        };
    }

    renderResizeHandler = () => {
        const { enable, handleStyles, handleClasses, handleComponent, handleWrapperStyle, handleWrapperClass } = this.props;
        if (!enable) {
            return null;
        }
        const directions = ['top', 'right', 'bottom', 'left', 'topRight', 'bottomRight', 'bottomLeft', 'topLeft'];
        const handlers = directions.map(dir => {
            if (enable[dir as Direction] !== false) {
                return (
                    <ResizeHandler
                        key={dir}
                        direction={dir as Direction}
                        onResizeStart={this.foundation.onResizeStart}
                        style={handleStyles && handleStyles[dir]}
                        className={handleClasses && handleClasses[dir]}
                    >
                        {handleComponent?.[dir] ?? null}
                    </ResizeHandler>
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
        const style: React.CSSProperties = {
            position: 'relative',
            userSelect: this.state.isResizing ? 'none' : 'auto',
            ...this.props.style,
            ...this.foundation.sizeStyle,
            maxWidth: this.props.maxWidth,
            maxHeight: this.props.maxHeight,
            minWidth: this.props.minWidth,
            minHeight: this.props.minHeight,
            boxSizing: 'border-box',
            flexShrink: 0,
        };

        if (this.state?.flexBasis) {
            style.flexBasis = this.state.flexBasis;
        }

        return (
            <div
                style={style}
                className={classNames(this.props.className, prefixCls)}
                ref={(c: HTMLElement | null) => {
                    if (c) {
                        this.foundation.resizable = c;
                    }
                }}
            >
                {this.state.isResizing && <div style={this.state.backgroundStyle} />}
                {this.props.children}
                {this.renderResizeHandler()}
            </div>
        );
    }
}

export default Resizable;