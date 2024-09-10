import React, { createContext, createRef, ReactNode, Ref, RefObject } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ResizeGroupFoundation, ResizeGroupAdapter } from '@douyinfe/semi-foundation/resizable/foundation';
import { cssClasses } from '@douyinfe/semi-foundation/resizable/constants';
import BaseComponent from '../../_base/baseComponent';
import { ResizeContext } from './resizeContext';
import { ResizeCallback, ResizeStartCallback } from '@douyinfe/semi-foundation/resizable/singleConstants';
import { getPixelSize } from '@douyinfe/semi-foundation/resizable/groupConstants';

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
        nextOffset: number;
    };
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
            curHandler: null,
            curConstraint: null
        };
        
        this.groupRef = createRef();
        this.foundation = new ResizeGroupFoundation(this.adapter);
    }

    groupRef: React.RefObject<HTMLDivElement>;
    static contextType = ResizeContext;
    context: ResizeGroupProps;
    itemRefs: RefObject<HTMLDivElement>[] = [];
    itemMinMap: Map<number, string> = new Map();
    itemMaxMap: Map<number, string> = new Map();
    itemDefaultSizeList: string[] = []
    itemResizeStart: Map<number, ResizeStartCallback> = new Map();
    itemResizing: Map<number, ResizeCallback> = new Map();
    itemResizeEnd: Map<number, ResizeCallback> = new Map();
    handlerRefs: RefObject<HTMLDivElement>[] = [];

    componentDidMount() {
        this.foundation.init();

        // allocate size for items which don't have default size
        let totalSizePercent = 0;
        let undefineLoc = []
        let parentSize = this.props.direction === 'horizontal' ? this.groupRef.current.offsetWidth : this.groupRef.current.offsetHeight;
        for (let i = 0; i < this.itemRefs.length; i++) {
            const child = this.itemRefs[i].current;
            let minSize = this.itemMinMap.get(i), maxSize = this.itemMaxMap.get(i);
            let minSizePercent = minSize ? getPixelSize(minSize, parentSize) / parentSize * 100 : 0,
                maxSizePercent = maxSize ? getPixelSize(maxSize, parentSize) / parentSize * 100 : 100;
            if (minSizePercent > maxSizePercent) {
                console.warn('min size bigger than max size');
            }    
            if (this.props.direction === 'horizontal') {
                child.style.minWidth = minSize ?? '0%';
                child.style.maxWidth = maxSize ?? '100%';
            } else {
                child.style.minHeight = minSize ?? '0%';
                child.style.maxHeight = maxSize ?? '100%';
            }
            if (this.itemDefaultSizeList[i]) {
                let itemSizePercent: number;
                if (this.itemDefaultSizeList[i].endsWith('%')) {
                    itemSizePercent = parseInt(this.itemDefaultSizeList[i].slice(0, -1));
                } else if (this.itemDefaultSizeList[i].endsWith('px')) {
                    itemSizePercent = parseInt(this.itemDefaultSizeList[i].slice(0, -2)) / parentSize * 100;
                }
                totalSizePercent += itemSizePercent;
                
                
                if (itemSizePercent < minSizePercent) {
                    console.warn('item size smaller than min size');
                } 
                if (itemSizePercent > maxSizePercent) {
                    console.warn('item size bigger than max size');
                }
            } else {
                undefineLoc.push(i);
            }
        }
        let undefineSizePercent = 100 - totalSizePercent;
        if (totalSizePercent > 100) {
            console.warn('total Size bigger than 100%');
            undefineSizePercent = 10 // 如果总和超过100%，则保留10%的空间均分给未定义的item
        }
    
        for (let i = 0; i < undefineLoc.length; i++) {
            const child = this.itemRefs[undefineLoc[i]].current;
            if (this.props.direction === 'horizontal') {
                child.style.width = undefineSizePercent / undefineLoc.length + '%';
            } else {
                child.style.height = undefineSizePercent / undefineLoc.length + '%';
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
                    return {
                        width: this.groupRef.current.offsetWidth,
                        height: this.groupRef.current.offsetHeight,
                    }
                },
            }}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: direction === 'vertical' ? 'column' : 'row',
                        width: '100%',
                        height: '100%',
                        boxSizing: 'border-box'
                    }}
                    ref={this.groupRef}
                    className={classNames(className, prefixCls + '-group')}
                    {...rest}
                >
                    {children}
                </div>
            </ResizeContext.Provider>
        );
    }
}

export default ResizeGroup;
