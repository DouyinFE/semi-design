import React, { createRef, ReactNode } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ResizeItemFoundation, ResizeItemAdapter } from '@douyinfe/semi-foundation/resizable/foundation';

import { cssClasses } from '@douyinfe/semi-foundation/resizable/constants';

import BaseComponent from '../../_base/baseComponent';
import { Direction, HandleClassName, HandleComponent, HandleStyles, ResizeCallback, ResizeStartCallback, Size } from '@douyinfe/semi-foundation/resizable/singleConstants';
import ResizeHandler from './resizeHandler';
import { ResizeContext } from './resizeContext';

const prefixCls = cssClasses.PREFIX;

export interface ResizeItemProps {
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
    children?: React.ReactNode;
    onResizeStart?: ResizeStartCallback;
    onChange?: ResizeCallback;
    onResizeEnd?: ResizeCallback;
    defaultSize?: Size;
    scale?: number;
    ratio?: number | [number, number]
}

export interface ResizeItemState {
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

class ResizeItem extends BaseComponent<ResizeItemProps, ResizeItemState> {
    static propTypes = {
        style: PropTypes.object,
        className: PropTypes.string,
        grid: PropTypes.arrayOf(PropTypes.number),
        snap: {
            x: PropTypes.arrayOf(PropTypes.number),
            y: PropTypes.arrayOf(PropTypes.number),
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
        children: PropTypes.object,
        onResizeStart: PropTypes.func,
        onChange: PropTypes.func,
        onResizeEnd: PropTypes.func,
        defaultSize: PropTypes.object,
        scale: PropTypes.number,
        ratio: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
    };

    static defaultProps: Partial<ResizeItemProps> = {
        onResizeStart: () => { },
        onChange: () => { },
        onResizeEnd: () => { },
        style: {},
        grid: [1, 1],
        lockAspectRatio: false,
        lockAspectRatioExtraWidth: 0,
        lockAspectRatioExtraHeight: 0,
        scale: 1,
        ratio: 1,
        snapGap: 0,
    };

    constructor(props: ResizeItemProps) {
        super(props);
        this.resizeItemRef = createRef();
        this.foundation = new ResizeItemFoundation(this.adapter);
        this.foundation.resizable = () => this.resizeItemRef.current;
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

    componentDidUpdate(_prevProps: ResizeItemProps) {
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    get adapter(): ResizeItemAdapter<ResizeItemProps, ResizeItemState> {
        return {
            ...super.adapter,
        };
    }
    static contextType = ResizeContext;
    context: ResizeItemProps;
    resizeItemRef: React.RefObject<HTMLDivElement>

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
            </div>
        );
    }
}


export default ResizeItem;
