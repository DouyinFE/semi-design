import React, { createContext, createRef, ReactNode, Ref, RefObject } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ResizeGroupFoundation, ResizeGroupAdapter } from '@douyinfe/semi-foundation/resizable/foundation';
import { cssClasses } from '@douyinfe/semi-foundation/resizable/constants';
import BaseComponent from '../../_base/baseComponent';
import { ResizeContext } from './resizeContext';
import { ResizeCallback, ResizeStartCallback } from '@douyinfe/semi-foundation/resizable/singleConstants';
import { getPixelSize } from '@douyinfe/semi-foundation/resizable/utils';
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
    curHandler: number;
    curConstraint: [number, number]
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
            curConstraint: null
        };
        
        this.groupRef = createRef();
        this.foundation = new ResizeGroupFoundation(this.adapter);
    }

    groupRef: React.RefObject<HTMLDivElement>;
    groupSize: number;
    availableSize: number;
    static contextType = ResizeContext;
    context: ResizeGroupProps;
    itemRefs: RefObject<HTMLDivElement>[] = [];
    itemMinMap: Map<number, string> = new Map();
    itemMaxMap: Map<number, string> = new Map();
    itemMinusMap: Map<number, number> = new Map();
    itemDefaultSizeList: string[] = []
    itemResizeStart: Map<number, ResizeStartCallback> = new Map();
    itemResizing: Map<number, ResizeCallback> = new Map();
    itemResizeEnd: Map<number, ResizeCallback> = new Map();
    handlerRefs: RefObject<HTMLDivElement>[] = [];

    componentDidMount() {
        this.foundation.init();
        // calculate accurate space for group item
        let handlerSizes = new Array(this.handlerRefs.length).fill(0);
        this.groupSize = this.props.direction === 'horizontal' ? this.groupRef.current.offsetWidth : this.groupRef.current.offsetHeight;
        this.availableSize = this.groupSize;
        for (let i = 0; i < this.handlerRefs.length; i++) {
            let handlerSize = this.props.direction === 'horizontal' ? this.handlerRefs[i].current.offsetWidth : this.handlerRefs[i].current.offsetHeight;
            handlerSizes[i] = handlerSize;
            this.availableSize -= handlerSize;
        }

        // allocate size for items which don't have default size
        let totalSizePercent = 0;
        let undefineLoc = [];
        let parentSize = this.props.direction === 'horizontal' ? this.groupRef.current.offsetWidth : this.groupRef.current.offsetHeight;

        for (let i = 0; i < this.itemRefs.length; i++) {
            if (i === 0) {
                this.itemMinusMap.set(i, handlerSizes[i] / 2);
            } else if (i === this.itemRefs.length - 1) {
                this.itemMinusMap.set(i, handlerSizes[i - 1] / 2);
            } else {
                this.itemMinusMap.set(i, handlerSizes[i - 1] / 2 + handlerSizes[i] / 2);
            }
            const child = this.itemRefs[i].current;
            let minSize = this.itemMinMap.get(i), maxSize = this.itemMaxMap.get(i);
            let minSizePercent = minSize ? getPixelSize(minSize, parentSize) / parentSize * 100 : 0,
                maxSizePercent = maxSize ? getPixelSize(maxSize, parentSize) / parentSize * 100 : 100;
            if (minSizePercent > maxSizePercent) {
                console.warn('min size bigger than max size');
            }    

            if (this.itemDefaultSizeList[i]) {
                let itemSizePercent: number;
                if (this.itemDefaultSizeList[i].endsWith('%')) {
                    itemSizePercent = parseInt(this.itemDefaultSizeList[i].slice(0, -1));
                } else if (this.itemDefaultSizeList[i].endsWith('px')) {
                    itemSizePercent = parseInt(this.itemDefaultSizeList[i].slice(0, -2)) / parentSize * 100;
                }
                totalSizePercent += itemSizePercent;
                
                if (this.props.direction === 'horizontal') {
                    child.style.width = `calc(${itemSizePercent}% - ${this.itemMinusMap.get(i)}px)`;
                } else {
                    child.style.height = `calc(${itemSizePercent}% - ${this.itemMinusMap.get(i)}px)`;
                }
                
                if (itemSizePercent < minSizePercent) {
                    console.warn('[Semi ResizableGroup]: item size smaller than min size');
                } 
                if (itemSizePercent > maxSizePercent) {
                    console.warn('[Semi ResizableGroup]: item size bigger than max size');
                }
            } else {
                undefineLoc.push(i);
            }
        }
        let undefineSizePercent = 100 - totalSizePercent;
        if (totalSizePercent > 100) {
            console.warn('[Semi ResizableGroup]: total Size bigger than 100%');
            undefineSizePercent = 10; // 如果总和超过100%，则保留10%的空间均分给未定义的item
        }
    
        for (let i = 0; i < undefineLoc.length; i++) {
            const child = this.itemRefs[undefineLoc[i]].current;
            if (this.props.direction === 'horizontal') {
                child.style.width = `calc(${undefineSizePercent / undefineLoc.length}% - ${this.itemMinusMap.get(i)}px)`;
            } else {
                child.style.height = `calc(${undefineSizePercent / undefineLoc.length}% - ${this.itemMinusMap.get(i)}px)`;
            }
        }

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
            getGroupSize: () => this.groupSize,
            getAvailableSize: () => this.availableSize,
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
            getItemMinus: (index) => {
                return this.itemMinusMap.get(index);
            },
        };
    }

    get window(): Window | null {
        return this.groupRef.current.ownerDocument.defaultView as Window ?? null;
    }

    

    render() {
        const { children, direction, className, ...rest } = this.props;

        return (
            <ResizeContext.Provider value={{
                direction: direction,
                registerItem: (ref: RefObject<HTMLDivElement>,
                    min, max, defaultSize,
                    onResizeStart, onChange, onResizeEnd
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
                },
                registerHandler: (ref: RefObject<HTMLDivElement>) => {
                    this.handlerRefs.push(ref);
                    return this.handlerRefs.length - 1;
                },
                notifyResizeStart: this.foundation.onResizeStart,
                getGroupSize: () => {
                    return this.groupSize;
                },
            }}>
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
