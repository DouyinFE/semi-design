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
}



class ResizeGroup extends BaseComponent<ResizeGroupProps, ResizeGroupState> {
    static propTypes = {
    };

    static defaultProps: Partial<ResizeGroupProps> = {
        direction: 'vertical'
    };

    constructor(props: ResizeGroupProps) {
        super(props);
        this.state = {
        };
        this.constraintsMap = new Map();
        this.groupRef = createRef();
        this.foundation = new ResizeGroupFoundation(this.adapter);
    }

    groupRef: React.RefObject<HTMLDivElement>;
    constraintsMap: Map<number, [number, number]>;
    itemMinWidth: number = 10;
    componentDidMount() {
        this.foundation.init();

    }

    updateConstraints() {
        // this item constaint last / next handler
        let lastConstraints = new Map(), nextConstraints = new Map();
        if (this.props.direction === 'horizontal') {
            const parentWidth = this.groupRef.current.getBoundingClientRect().width;
            for (let i = 0; i < this.childRefs.length; i++) {
                const child = this.childRefs[i].current;
                
                if ((child instanceof ResizeItem)) {
                    const minWidth = child.props.minWidth ? Number(child.props.minWidth.replace('%', '')) / 100 * parentWidth : 0;
                    const rect = child.foundation.resizable.getBoundingClientRect();
                    let { borderLeftWidth, borderRightWidth } = child.foundation.window.getComputedStyle(child.foundation.resizable);
                    borderLeftWidth = Number(borderLeftWidth.replace('px', ''));
                    borderRightWidth = Number(borderRightWidth.replace('px', ''));
                    let borderWidth = borderLeftWidth + borderRightWidth + this.itemMinWidth; 

                    let nextLeftConstraint = rect.left + minWidth + borderWidth, nextRightConstraint = undefined;
                    let lastRightConstraint = rect.right - minWidth - borderWidth, lastLeftConstraint = undefined;
                    if (child.props.maxWidth) {
                        const maxWidth = Number(child.props.maxWidth.replace('%', '')) / 100 * parentWidth;
                        nextRightConstraint = rect.left + maxWidth - borderWidth;
                        lastLeftConstraint = rect.right - maxWidth + borderWidth;
                    }

                    lastConstraints.set(i - 1, [lastLeftConstraint, lastRightConstraint]);
                    nextConstraints.set(i + 1, [nextLeftConstraint, nextRightConstraint]);
                }
            }
        } else {
            const parentHeight = this.groupRef.current.getBoundingClientRect().height;
            for (let i = 0; i < this.childRefs.length; i++) {
                const child = this.childRefs[i].current;
                if ((child instanceof ResizeItem)) {
                    const minHeight = child.props.minHeight ? Number(child.props.minHeight.replace('%', '')) / 100 * parentHeight : 0;
                    const rect = child.foundation.resizable.getBoundingClientRect();
                    let { borderTopWidth, borderBottomWidth } = child.foundation.window.getComputedStyle(child.foundation.resizable);
                    borderTopWidth = Number(borderTopWidth.replace('px', ''));
                    borderBottomWidth = Number(borderBottomWidth.replace('px', ''));
                    let borderWidth = (borderTopWidth + borderBottomWidth) + this.itemMinWidth;
                    
                    let nextTopConstraint = rect.top + minHeight + borderWidth, nextBottomConstraint = undefined;
                    let lastBottomConstraint = rect.bottom - minHeight - borderWidth, lastTopConstraint = undefined;
                    if (child.props.maxHeight) {
                        const maxHeight = Number(child.props.maxHeight.replace('%', '')) / 100 * parentHeight;
                        nextBottomConstraint = rect.top + maxHeight - borderWidth;
                        lastTopConstraint = rect.bottom - maxHeight + borderWidth;
                    }

                    lastConstraints.set(i - 1, [lastTopConstraint, lastBottomConstraint]);
                    nextConstraints.set(i + 1, [nextTopConstraint, nextBottomConstraint]);
                }
            }
        }

        for (let i = 0; i < this.childRefs.length; i++) {
            const child = this.childRefs[i].current;
            if ((child instanceof ResizeHandler)) {
                // lastBack and nextFront wont be undefined
                let [lastFront, lastBack] = lastConstraints.get(i);
                let [nextFront, nextBack] = nextConstraints.get(i);
                let front = lastFront === undefined ? nextFront : Math.max(lastFront, nextFront);
                let back = nextBack === undefined ? lastBack : Math.min(lastBack, nextBack);
                this.constraintsMap.set(i, [front, back]);
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
        };
    }

    static contextType = ResizeContext;
    context: ResizeGroupProps;
    childRefs: RefObject<any>[] = [];

    render() {
        const { children, direction, className } = this.props;
        this.childRefs = [];
        
        const childrenWithRefs = React.Children.map(children, (child, index) => {
            if (React.isValidElement(child)) {
                const ref = React.createRef();
                this.childRefs.push(ref);
                if (child.type === ResizeItem) {
                    return React.cloneElement(child as React.ReactElement, { ref });
                } else if (child.type === ResizeHandler) {
                    const onResizeStart = (e: MouseEvent) => {
                        this.updateConstraints();
                        let [dir_last, dir_next] = getItemDirection(direction);

                        this.childRefs[index - 1].current.foundation.curHandlerId = index;
                        this.childRefs[index - 1].current.foundation.onResizeStart(e, dir_last);

                        if (index < this.childRefs.length - 1) {
                            this.childRefs[index + 1].current.foundation.curHandlerId = index;
                            this.childRefs[index + 1].current.foundation.onResizeStart(e, dir_next);
                        }
                        
                    };
                    return React.cloneElement(child as React.ReactElement, { ref, direction: getHandlerDirection(direction), onResizeStart });
                }
            }
            return child;
        });

        return (
            <ResizeContext.Provider value={{ 
                direction: this.props.direction,
                getConstraintById: (id: number) => {
                    return this.constraintsMap.get(id);
                }
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
                >
                    {childrenWithRefs}
                </div>
            </ResizeContext.Provider>
        );
    }
}

export default ResizeGroup;
