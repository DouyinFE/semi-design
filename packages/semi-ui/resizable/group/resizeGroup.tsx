import React, { createContext, createRef, ReactNode, Ref, RefObject } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ResizeGroupFoundation, ResizeGroupAdapter } from '@douyinfe/semi-foundation/resizable/foundation';
import { cssClasses } from '@douyinfe/semi-foundation/resizable/constants';
import BaseComponent from '../../_base/baseComponent';
import { ResizeContext, ResizeContextProps } from './resizeContext';
import { ResizeCallback, ResizeStartCallback } from '@douyinfe/semi-foundation/resizable/singleConstants';
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
    itemRefs: RefObject<HTMLDivElement>[] = [];
    itemMinMap: Map<number, string> = new Map();
    itemMaxMap: Map<number, string> = new Map();
    itemMinusMap: Map<number, number> = new Map();
    itemDefaultSizeList: (string|number)[] = []
    itemResizeStart: Map<number, ResizeStartCallback> = new Map();
    itemResizing: Map<number, ResizeCallback> = new Map();
    itemResizeEnd: Map<number, ResizeCallback> = new Map();
    handlerRefs: RefObject<HTMLDivElement>[] = [];

    componentDidMount() {
        this.foundation.init();
    }

    componentDidUpdate(_prevProps: ResizeGroupProps) {
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    get adapter(): ResizeGroupAdapter<ResizeGroupProps, ResizeGroupState> {
        return {
            ...super.adapter,
            getGroupRef: () => this.groupRef.current,
            getItem: (id: number) => this.itemRefs[id].current,
            getItemCount: () => this.itemRefs.length,
            getHandler: (id: number) => this.handlerRefs[id].current,
            getHandlerCount: () => this.handlerRefs.length,
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
                return this.itemDefaultSizeList[index];
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
        this.itemRefs.push(ref);
        let index = this.itemRefs.length - 1;
        this.itemMinMap.set(index, min);
        this.itemMaxMap.set(index, max);
        this.itemDefaultSizeList.push(defaultSize);
        this.itemResizeStart.set(index, onResizeStart);
        this.itemResizing.set(index, onChange);
        this.itemResizeEnd.set(index, onResizeEnd);
        return index;
    }

    registerHandler = (ref: RefObject<HTMLDivElement>) => {
        this.handlerRefs.push(ref);
        return this.handlerRefs.length - 1;
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
                    {this.state.isResizing && <div style={this.state.backgroundStyle} />}
                    {children}
                </div>
            </ResizeContext.Provider>
        );
    }
}

export default ResizeGroup;
