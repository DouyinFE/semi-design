import React, { createRef, ReactNode, RefObject } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ResizeGroupFoundation, ResizeGroupAdapter } from '@douyinfe/semi-foundation/resizable/foundation';
import { cssClasses } from '@douyinfe/semi-foundation/resizable/constants';
import BaseComponent from '../../_base/baseComponent';
import { ResizeContext, ResizeContextProps } from './resizeContext';
import { ResizeCallback, ResizeStartCallback } from '@douyinfe/semi-foundation/resizable/types';
import "@douyinfe/semi-foundation/resizable/index.scss";

const prefixCls = cssClasses.PREFIX;

export interface ResizeGroupProps {
    children: ReactNode;
    direction: 'horizontal' | 'vertical';
    className?: string
}

export interface ResizeGroupState {
    isResizing: boolean;
    originalPosition: {
        x: number;
        y: number;
        lastItemSize: number;
        nextItemSize: number;
        lastOffset: number;
        nextOffset: number
    };
    backgroundStyle: React.CSSProperties;
    curHandler: number
}

class ResizeGroup extends BaseComponent<ResizeGroupProps, ResizeGroupState> {

    static propTypes = {
    };

    static defaultProps: Partial<ResizeGroupProps> = {
        direction: 'horizontal'
    };

    constructor(props: ResizeGroupProps) {
        super(props);
        this.state = {
            isResizing: false,
            originalPosition: {
                x: 0,
                y: 0,
                lastItemSize: 0,
                nextItemSize: 0,
                lastOffset: 0,
                nextOffset: 0,
            },
            backgroundStyle: {
                cursor: 'auto',
            },
            curHandler: null,
        };
        
        this.groupRef = createRef();
        this.foundation = new ResizeGroupFoundation(this.adapter);
        this.contextValue = {
            direction: props.direction,
            registerItem: this.registerItem,
            registerHandler: this.registerHandler,
            notifyResizeStart: this.foundation.onResizeStart,
            getGroupSize: this.getGroupSize,
        };
    }

    contextValue: ResizeContextProps;
    foundation: ResizeGroupFoundation;
    groupRef: React.RefObject<HTMLDivElement>;
    groupSize: number;
    availableSize: number;
    static contextType = ResizeContext;
    context: ResizeGroupProps;
    itemRefs: Map<number, RefObject<HTMLDivElement>> = new Map();
    itemMinMap: Map<number, string> = new Map();
    itemMaxMap: Map<number, string> = new Map();
    itemMinusMap: Map<number, number> = new Map();
    itemDefaultSizeList: Map<number, (string|number)> = new Map();
    itemResizeStart: Map<number, ResizeStartCallback> = new Map();
    itemResizing: Map<number, ResizeCallback> = new Map();
    itemResizeEnd: Map<number, ResizeCallback> = new Map();
    handlerRefs: Map<number, RefObject<HTMLDivElement>> = new Map();

    componentDidMount() {
        this.foundation.init();
        window.addEventListener('resize', this.foundation.calculateSpace);
    }

    componentDidUpdate(_prevProps: ResizeGroupProps) {
    }

    componentWillUnmount() {
        this.foundation.destroy();
        window.removeEventListener('resize', this.foundation.calculateSpace);
    }

    get adapter(): ResizeGroupAdapter<ResizeGroupProps, ResizeGroupState> {
        return {
            ...super.adapter,
            getGroupRef: () => this.groupRef.current,
            getItem: (id: number) => this.itemRefs.get(id).current,
            getItemCount: () => this.itemRefs.size,
            getHandler: (id: number) => this.handlerRefs.get(id).current,
            getHandlerCount: () => this.handlerRefs.size,
            getItemMin: (index) => {
                return this.itemMinMap.get(index);
            },
            getItemMax: (index) => {
                return this.itemMaxMap.get(index);
            },
            getItemChange: (index) => {
                return this.itemResizing.get(index);
            },
            getItemEnd: (index) => {
                return this.itemResizeEnd.get(index);   
            },
            getItemStart: (index) => {
                return this.itemResizeStart.get(index);
            },
            getItemDefaultSize: (index) => {
                return this.itemDefaultSizeList.get(index);
            },
            registerEvents: this.registerEvent,
            unregisterEvents: this.unregisterEvent,
        };
    }

    get window(): Window | null {
        return this.groupRef.current.ownerDocument.defaultView as Window ?? null;
    }

    registerEvent = () => {
        if (this.window) {
            this.window.addEventListener('mousemove', this.foundation.onResizing);
            this.window.addEventListener('mouseup', this.foundation.onResizeEnd);
            this.window.addEventListener('mouseleave', this.foundation.onResizeEnd);
        }
    }

    unregisterEvent = () => {
        if (this.window) {
            this.window.removeEventListener('mousemove', this.foundation.onResizing);
            this.window.removeEventListener('mouseup', this.foundation.onResizeEnd);
            this.window.removeEventListener('mouseleave', this.foundation.onResizeEnd);
        }
    }

    registerItem = (ref: RefObject<HTMLDivElement>,
        min: string, max: string, defaultSize: string|number,
        onResizeStart: ResizeStartCallback, onChange: ResizeCallback, onResizeEnd: ResizeCallback
    ) => {
        if (Array.from(this.itemRefs.values()).some(r => r === ref)) {
            return -1;
        }
        let index = this.itemRefs.size;
        this.itemRefs.set(index, ref);
        this.itemMinMap.set(index, min);
        this.itemMaxMap.set(index, max);
        this.itemDefaultSizeList.set(index, defaultSize);
        this.itemResizeStart.set(index, onResizeStart);
        this.itemResizing.set(index, onChange);
        this.itemResizeEnd.set(index, onResizeEnd);
        return index;
    }

    registerHandler = (ref: RefObject<HTMLDivElement>) => {
        if (Array.from(this.handlerRefs.values()).some(r => r === ref)) {
            return -1;
        }
        let index = this.handlerRefs.size;
        this.handlerRefs.set(index, ref);
        return index;
    }

    getGroupSize = () => {
        return this.groupSize;
    }

    render() {
        const { children, direction, className, ...rest } = this.props;
        return (
            <ResizeContext.Provider value={this.contextValue}>
                <div
                    style={{
                        flexDirection: direction === 'vertical' ? 'column' : 'row',
                    }}
                    ref={this.groupRef}
                    className={classNames(className, prefixCls + '-group')}
                    {...rest}
                >
                    {this.state.isResizing && <div style={this.state.backgroundStyle} className={classNames(className, prefixCls + '-background')}/>}
                    {children}
                </div>
            </ResizeContext.Provider>
        );
    }
}

export default ResizeGroup;
