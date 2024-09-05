import React, { createRef, ReactNode, useContext } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ResizeItemFoundation, ResizeItemAdapter } from '@douyinfe/semi-foundation/resizable/foundation';
import { cssClasses } from '@douyinfe/semi-foundation/resizable/constants';
import BaseComponent from '../../_base/baseComponent';
import { Direction, ResizeCallback, ResizeStartCallback, Size } from '@douyinfe/semi-foundation/resizable/singleConstants';
import { ResizeContext, ResizeContextProps } from './resizeContext';

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
    size?: Size;
    minWidth?: string ;
    minHeight?: string ;
    maxWidth?: string;
    maxHeight?: string;
    children?: React.ReactNode;
    onResizeStart?: ResizeStartCallback;
    onChange?: ResizeCallback;
    onResizeEnd?: ResizeCallback;
    defaultSize?: Size
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
        snap: PropTypes.shape({
            x: PropTypes.arrayOf(PropTypes.number),
            y: PropTypes.arrayOf(PropTypes.number),
        }),  
        snapGap: PropTypes.number,
        size: PropTypes.object,
        minWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        minHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        children: PropTypes.object,
        onResizeStart: PropTypes.func,
        onChange: PropTypes.func,
        onResizeEnd: PropTypes.func,
        defaultSize: PropTypes.object,
    };

    static defaultProps: Partial<ResizeItemProps> = {
        onResizeStart: () => { },
        onChange: () => { },
        onResizeEnd: () => { },
        style: {},
        grid: [1, 1],
        snapGap: 0,
    };

    constructor(props: ResizeItemProps) {
        super(props);
        this.itemRef = createRef<HTMLDivElement | null>();
        this.foundation = new ResizeItemFoundation(this.adapter);
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
            getItemRef: () => this.itemRef?.current,
            getItemIndex: () => this.itemIndex,
        };
    }
    static contextType = ResizeContext;
    context: ResizeContextProps;
    itemRef: React.RefObject<HTMLDivElement | null>;
    itemIndex: number;

    render() {     
        this.itemIndex = this.context.registerItem(this.itemRef);                                                                                                                                                                                                                
        const style: React.CSSProperties = {
            position: 'relative',
            userSelect: this.state.isResizing ? 'none' : 'auto',
            ...this.props.style,
            ...this.foundation.sizeStyle,
            boxSizing: 'border-box',
            flexShrink: 1,
        };

        if (this.state?.flexBasis) {
            style.flexBasis = this.state.flexBasis;
        }

        return (
            <div
                style={style}
                className={classNames(this.props.className, prefixCls + '-item')}
                ref={this.itemRef}
            >
                {this.state.isResizing && <div style={this.state.backgroundStyle} />}
                {this.props.children}
            </div>
        );
    }
}


export default ResizeItem;
