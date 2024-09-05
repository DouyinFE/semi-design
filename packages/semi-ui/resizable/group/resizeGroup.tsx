import React, { createContext, createRef, ReactNode, Ref, RefObject } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ResizeGroupFoundation, ResizeGroupAdapter } from '@douyinfe/semi-foundation/resizable/foundation';
import { cssClasses } from '@douyinfe/semi-foundation/resizable/constants';
import { getItemDirection, getHandlerDirection } from '@douyinfe/semi-foundation/resizable/groupConstants';
import BaseComponent from '../../_base/baseComponent';
import { ResizeContext } from './resizeContext';
import ResizeItem from './resizeItem';
import ResizeHandler from './resizeHandler';

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
            },
            curHandler: null,
            curConstraint: null
        };
        this.constraintsMap = new Map();
        this.groupRef = createRef();
        this.foundation = new ResizeGroupFoundation(this.adapter);
    }

    groupRef: React.RefObject<HTMLDivElement>;
    constraintsMap: Map<number, [number, number]>;
    itemMinSize: number = 0; // 需要是handler的宽度 / 2
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
        };
    }

    static contextType = ResizeContext;
    context: ResizeGroupProps;
    itemRefs: RefObject<HTMLDivElement>[] = [];
    itemMinMap: Map<number, string> = new Map();
    itemMaxMap: Map<number, string> = new Map();
    handlerRefs: RefObject<HTMLDivElement>[] = [];

    get window(): Window | null {
        return this.groupRef.current.ownerDocument.defaultView as Window ?? null;
    }

    registerEvents = () => {
        if (this.window) {
            this.window.addEventListener('mousemove', this.onResizing);
            this.window.addEventListener('mouseup', this.onResizeEnd);
            this.window.addEventListener('mouseleave', this.onResizeEnd);
        }
    }

    unregisterEvents = () => {
        if (this.window) {
            this.window.removeEventListener('mousemove', this.onResizing);
            this.window.removeEventListener('mouseup', this.onResizeEnd);
            this.window.removeEventListener('mouseleave', this.onResizeEnd);
        }
    }

    updateConstraints = () => {
        // this item constaint last / next handler
        let lastConstraints = new Map(), nextConstraints = new Map();
        if (this.props.direction === 'horizontal') {
            const parentWidth = this.groupRef.current.getBoundingClientRect().width;
            for (let i = 0; i < this.itemRefs.length; i++) {
                const child = this.itemRefs[i].current;
            
                const minWidth = this.itemMinMap.get(i) ? Number(this.itemMinMap.get(i).replace('%', '')) / 100 * parentWidth : 0;
                const rect = child.getBoundingClientRect();
                let { borderLeftWidth, borderRightWidth } = this.window.getComputedStyle(child);
                let leftWidth = Number(borderLeftWidth.replace('px', ''));
                let rightWidth = Number(borderRightWidth.replace('px', ''));
                let borderWidth = leftWidth + rightWidth + this.itemMinSize; 

                let nextLeftConstraint = rect.left + minWidth + borderWidth, nextRightConstraint = undefined;
                let lastRightConstraint = rect.right - minWidth - borderWidth, lastLeftConstraint = undefined;
                if (this.itemMaxMap.get(i)) {
                    const maxWidth = Number(this.itemMaxMap.get(i).replace('%', '')) / 100 * parentWidth;
                    nextRightConstraint = rect.left + maxWidth - borderWidth;
                    lastLeftConstraint = rect.right - maxWidth + borderWidth;
                }

                lastConstraints.set(i - 1, [lastLeftConstraint, lastRightConstraint]);
                nextConstraints.set(i, [nextLeftConstraint, nextRightConstraint]);
            }
        } else {
            const parentHeight = this.groupRef.current.getBoundingClientRect().height;
            for (let i = 0; i < this.itemRefs.length; i++) {
                const child = this.itemRefs[i].current;
                
                const minHeight = this.itemMinMap.get(i) ? Number(this.itemMinMap.get(i).replace('%', '')) / 100 * parentHeight : 0;
                const rect = child.getBoundingClientRect();
                let { borderTopWidth, borderBottomWidth } = this.window.getComputedStyle(child);
                let topWidth = Number(borderTopWidth.replace('px', ''));
                let bottomWidth = Number(borderBottomWidth.replace('px', ''));
                let borderWidth = (topWidth + bottomWidth) + this.itemMinSize;
                
                let nextTopConstraint = rect.top + minHeight + borderWidth, nextBottomConstraint = undefined;
                let lastBottomConstraint = rect.bottom - minHeight - borderWidth, lastTopConstraint = undefined;
                if (this.itemMaxMap.get(i)) {
                    const maxHeight = Number(this.itemMaxMap.get(i).replace('%', '')) / 100 * parentHeight;
                    nextBottomConstraint = rect.top + maxHeight - borderWidth;
                    lastTopConstraint = rect.bottom - maxHeight + borderWidth;
                }

                lastConstraints.set(i - 1, [lastTopConstraint, lastBottomConstraint]);
                nextConstraints.set(i, [nextTopConstraint, nextBottomConstraint]);
                
            }
        }

        for (let i = 0; i < this.handlerRefs.length; i++) {
            // lastBack and nextFront wont be undefined
            let [lastFront, lastBack] = lastConstraints.get(i);
            let [nextFront, nextBack] = nextConstraints.get(i);
            let front = lastFront === undefined ? nextFront : Math.max(lastFront, nextFront);
            let back = nextBack === undefined ? lastBack : Math.min(lastBack, nextBack);
            this.constraintsMap.set(i, [front, back]);
        }
    }


    onResizing = (e: MouseEvent) => {
        if (!this.state.isResizing) {
            return
        }
        const { curHandler, originalPosition, curConstraint } = this.state;
        const { x:initX, y:initY, lastItemSize, nextItemSize } = originalPosition;
        const { clientX, clientY } = e;
        
        if (curConstraint) {
            if (this.props.direction === 'horizontal') {
                if (clientX <= curConstraint[0] || clientX >= curConstraint[1]) {
                    return
                } 
            } else if (this.props.direction === 'vertical') {
                if (clientY <= curConstraint[0] || clientY >= curConstraint[1]) {
                    return
                }
            }
        }

        const { direction } = this.props;
        let lastItem = this.itemRefs[curHandler], nextItem = this.itemRefs[curHandler + 1];
        
        if (direction === 'horizontal') {
            let delta = clientX - initX;
            lastItem.current.style.width = lastItemSize + delta + 'px';
            nextItem.current.style.width = nextItemSize - delta + 'px';
        } else if (direction === 'vertical') {
            let delta = clientY - initY;
            lastItem.current.style.height = lastItemSize + delta + 'px';
            nextItem.current.style.height = nextItemSize - delta + 'px';
        }

        // TODO: item onchange
    }

    onResizeEnd = (e: MouseEvent) => {
        this.setState({
            isResizing: false
        })
        this.unregisterEvents();
        // TODO: item onresizeend
    }

    render() {
        const { children, direction, className, ...rest } = this.props;
        this.itemRefs = [];
        this.handlerRefs = [];

        return (
            <ResizeContext.Provider value={{ 
                direction: direction,
                getConstraintById: (id: number) => {
                    return this.constraintsMap.get(id);
                },
                registerItem: (ref: RefObject<HTMLDivElement>, min, max) => {
                    this.itemRefs.push(ref);
                    let index = this.itemRefs.length - 1;
                    this.itemMinMap.set(index, min);
                    this.itemMaxMap.set(index, max);
                    return index;
                },
                registerHandler: (ref: RefObject<HTMLDivElement>) => {
                    this.handlerRefs.push(ref);
                    return this.handlerRefs.length - 1;
                },
                notifyResizeStart: (handlerIndex, e) => { // handler ref
                    let { clientX, clientY } = e;
                    let lastItem = this.itemRefs[handlerIndex], nextItem = this.itemRefs[handlerIndex + 1];
                    let curHandler = this.handlerRefs[handlerIndex].current;
                    
                    if (this.props.direction === 'horizontal') {
                        this.itemMinSize = this.handlerRefs[handlerIndex].current.offsetWidth;
                    } else if (this.props.direction === 'vertical') {
                        this.itemMinSize = this.handlerRefs[handlerIndex].current.offsetHeight;
                    }
                    this.updateConstraints();
                    this.setState({
                        isResizing: true,
                        originalPosition: {
                            x: clientX,
                            y: clientY,
                            lastItemSize: this.props.direction === 'horizontal' ? lastItem.current.offsetWidth : lastItem.current.offsetHeight,
                            nextItemSize: this.props.direction === 'horizontal' ? nextItem.current.offsetWidth : nextItem.current.offsetHeight,
                        },
                        curHandler: handlerIndex,
                        curConstraint: this.constraintsMap.get(handlerIndex),
                    })
                    this.registerEvents();
                    // TODO: onresizestart
                },
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
