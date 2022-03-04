/* eslint-disable arrow-body-style */
import React, { CSSProperties, ReactNode, MutableRefObject, RefCallback, Key, ReactElement } from 'react';
import cls from 'classnames';
import BaseComponent from '../_base/baseComponent';
import PropTypes from 'prop-types';
import { isEqual, omit, isNull, isUndefined, isFunction, get } from 'lodash';
import { cssClasses, strings } from '@douyinfe/semi-foundation/overflowList/constants';
import ResizeObserver, { ResizeEntry } from '../resizeObserver';
import IntersectionObserver from './intersectionObserver';

import OverflowListFoundation, { OverflowListAdapter } from '@douyinfe/semi-foundation/overflowList/foundation';

import '@douyinfe/semi-foundation/overflowList/overflowList.scss';

const prefixCls = cssClasses.PREFIX;
const Boundary = strings.BOUNDARY_MAP;
const OverflowDirection = strings.OVERFLOW_DIR;
const RenderMode = strings.MODE_MAP;

export { ReactIntersectionObserverProps } from './intersectionObserver';
export type OverflowItem = Record<string, any>;

export interface OverflowListProps {
    className?: string;
    collapseFrom?: 'start' | 'end';
    items?: Array<OverflowItem>;
    minVisibleItems?: number;
    onIntersect?: (res: { [key: string]: IntersectionObserverEntry }) => void;
    onOverflow?: (overflowItems: Array<OverflowItem>) => void;
    overflowRenderer?: (overflowItems: Array<OverflowItem>) => ReactNode | ReactNode[];
    renderMode?: 'collapse' | 'scroll';
    style?: CSSProperties;
    threshold?: number;
    visibleItemRenderer?: (item: OverflowItem, index: number) => ReactElement;
    wrapperClassName?: string;
    wrapperStyle?: CSSProperties;
    itemKey?: Key | ((item: OverflowItem) => Key);
}

export interface OverflowListState {
    direction?: typeof OverflowDirection.GROW;
    lastOverflowCount?: number;
    overflow?: Array<OverflowItem>;
    visible?: Array<OverflowItem>;
    visibleState?: Map<string, boolean>;
    prevProps?: OverflowListProps;
    itemSizeMap?: Map<Key, number>;
    containerWidth?: number;
    overflowStatus?: 'calculating' | 'overflowed' | 'normal';
    pivot?: number;
    overflowWidth?: number;
}

// reference to https://github.com/palantir/blueprint/blob/1aa71605/packages/core/src/components/overflow-list/overflowList.tsx#L34
class OverflowList extends BaseComponent<OverflowListProps, OverflowListState> {
    static defaultProps = {
        collapseFrom: 'end',
        minVisibleItems: 0,
        overflowRenderer: (): ReactElement => null,
        renderMode: 'collapse',
        threshold: 0.75,
        visibleItemRenderer: (): ReactElement => null,
        onOverflow: () => null,
    };
    static propTypes = {
        // if render in scroll mode, key is required in items
        className: PropTypes.string,
        collapseFrom: PropTypes.oneOf(strings.BOUNDARY_SET),
        direction: PropTypes.oneOf(strings.POSITION_SET),
        items: PropTypes.array,
        minVisibleItems: PropTypes.number,
        onIntersect: PropTypes.func,
        onOverflow: PropTypes.func,
        overflowRenderer: PropTypes.func,
        renderMode: PropTypes.oneOf(strings.MODE_SET),
        style: PropTypes.object,
        threshold: PropTypes.number,
        visibleItemRenderer: PropTypes.func,
        wrapperClassName: PropTypes.string,
        wrapperStyle: PropTypes.object,
    };

    constructor(props: OverflowListProps) {
        super(props);
        this.state = {
            direction: OverflowDirection.GROW,
            lastOverflowCount: 0,
            overflow: [],
            visible: [],
            containerWidth: 0,
            visibleState: new Map(),
            itemSizeMap: new Map(),
            overflowStatus: "calculating",
            pivot: 0,
            overflowWidth: 0,
        };
        this.foundation = new OverflowListFoundation(this.adapter);
        this.previousWidths = new Map();
        this.itemRefs = {};
        this.itemSizeMap = new Map();
    }

    static getDerivedStateFromProps(props: OverflowListProps, prevState: OverflowListState): OverflowListState {
        const { prevProps } = prevState;
        const newState: OverflowListState = {};
        newState.prevProps = props;

        const needUpdate = (name: string): boolean => {
            return (!prevProps && name in props) || (prevProps && !isEqual(prevProps[name], props[name]));
        };
        if (needUpdate('items') || needUpdate('style')) {
            // reset visible state if the above props change.
            newState.direction = OverflowDirection.GROW;
            newState.lastOverflowCount = 0;
            if (props.renderMode === RenderMode.SCROLL){
                newState.visible = props.items;
                newState.overflow = [];
            } else {
                newState.visible = [];
                newState.overflow = [];
            }
            newState.pivot = 0;
            newState.overflowStatus = "calculating";
        }
        return newState;
    }

    get adapter(): OverflowListAdapter {
        return {
            ...super.adapter,
            updateVisibleState: (visibleState): void => {
                this.setState({ visibleState });
            },
            updateStates: (states): void => {
                this.setState({ ...states });
            },
            notifyIntersect: (res): void => {
                this.props.onIntersect && this.props.onIntersect(res);
            },
            getItemSizeMap: () => this.itemSizeMap
        };
    }

    itemRefs: Record<string, any>;

    scroller: HTMLDivElement = null;
    spacer: HTMLDivElement = null;

    previousWidths: Map<Element, number>;

    itemSizeMap: Map<string, number>;

    isScrollMode = (): boolean => {
        const { renderMode } = this.props;
        return renderMode === RenderMode.SCROLL;
    };

    componentDidMount(): void {
        this.repartition(false);
        const { direction, overflow, lastOverflowCount,containerWidth } = this.state;
        if (!this.isScrollMode()){

        }
    }

    // shouldComponentUpdate(_nextProps: OverflowListProps, nextState: OverflowListState): boolean {
    //     // We want this component to always re-render, even when props haven't changed, so that
    //     // changes in the renderers' behavior can be reflected.
    //     // The following statement prevents re-rendering only in the case where the state changes
    //     // identity (i.e. setState was called), but the state is still the same when
    //     // shallow-compared to the previous state.
    //     const currState = this.state
    //     const comingState = nextState
    //     console.log('🚀 ~~~~~~ OverflowList ~~~~~~ shouldComponentUpdate ~~~~~~ !(currState !== comingState && isEqual(currState, comingState))', !(currState !== comingState && isEqual(currState, comingState)))
    //     return !(currState !== comingState && isEqual(currState, comingState));
    // }

    componentDidUpdate(prevProps: OverflowListProps, prevState: OverflowListState): void {


        if (!isEqual(prevProps.items, this.props.items)) {
            this.itemRefs = {};
        }


        if (!isEqual(omit(prevState, 'prevProps'), omit(this.state, 'prevProps'))) {
            this.repartition(false);
        }
        const { direction, overflow, lastOverflowCount,containerWidth,visible,overflowStatus, overflowWidth } = this.state;
        
        if (this.isScrollMode() || overflowStatus !== "calculating") {
            return;
        }
        if (visible.length === 0 && this.props.items.length !== 0){// 第一次按照最大可能数量渲染
            const pivot = Math.min(this.props.items.length, Math.floor(containerWidth/4));
            this.setState({
                overflowStatus: 'calculating',
                visible: this.props.items.slice(0, pivot),
                overflow: this.props.items.slice(pivot),
            });
        } else {
            this.foundation.handleCollapseOverflow();
        }
    }

    resize = (entries: Array<ResizeEntry> = []): void => {
        const containerWidth = entries[0]?.target.clientWidth;
        this.setState({
            containerWidth,
            overflowStatus: 'calculating',
        });
        // if any parent is growing, assume we have more room than before
        const growing = entries.some(entry => {
            const previousWidth = this.previousWidths.get(entry.target) || 0;
            return entry.contentRect.width > previousWidth;
        });
        // this.repartition(growing);
        // entries.forEach(entry => this.previousWidths.set(entry.target, entry.contentRect.width));
    };

    repartition = (growing: boolean): void => {
        // if not mounted or scroll mode, we do not
        // if (isNull(this.spacer) || isUndefined(this.spacer) || this.isScrollMode()) {
        //     return;
        // }
        // // spacer has flex-shrink and width 1px so if it's much smaller then we know to shrink
        // const state = growing ?
        //     OverflowDirection.GROW :
        //     this.spacer.getBoundingClientRect().width < 0.9 ? OverflowDirection.SHRINK : OverflowDirection.NONE;
        // this.foundation.handlePartition(state);
    };

    reintersect = (entries: Array<IntersectionObserverEntry>): void => {
        this.foundation.handleIntersect(entries);
    };

    mergeRef = (ref: RefCallback<any> | MutableRefObject<any> | null, node: Element, key: Key): void => {
        this.itemRefs[key] = node;
        if (typeof ref === 'function') {
            ref(node);
        } else if (typeof ref === 'object' && ref && 'current' in ref) {
            ref.current = node;
        }
    };

    renderOverflow = (): ReactNode | ReactNode[] => {
        const { pivot, overflowStatus, overflow } = this.state;
        // const { items } = this.props;
        // const overflow = overflowStatus !== "calculating" ? items.splice(pivot) : [];
        return this.props.overflowRenderer(overflow);
    };

    getItemKey = (item, defalutKey?: Key) => {
        const { itemKey } = this.props;
        if (isFunction(itemKey)) {
            return itemKey(item);
        }
        return get(item, itemKey || 'key', defalutKey);
    }

    renderItemList = () => {
        const { className, wrapperClassName, wrapperStyle, style, visibleItemRenderer, renderMode, collapseFrom, items } = this.props;

        const { visible, pivot, overflowStatus } = this.state;
        let overflow = this.renderOverflow();
        if (!this.isScrollMode() && overflow){
            // TODO, overflow 是数组的情况
            const child = React.cloneElement(overflow, {
                style: {
                    ...overflow.props.style,
                    visibility: overflowStatus !== 'calculating' ? "visible" : 'hidden'
                } as CSSProperties,
            });
            overflow = (<ResizeObserver
                key={'overflow-items'}
                onResize={([entry]) => {
                    // entry.target.clientWidth
                    this.setState({
                        overflowWidth: entry.target.clientWidth,
                        overflowStatus: 'calculating'
                    });
                }}
            >
                {child}
            </ResizeObserver>);
        }
        const inner =
            renderMode === RenderMode.SCROLL ?
                [
                    overflow[0],
                    <div
                        className={cls(wrapperClassName, `${prefixCls}-scroll-wrapper`)}
                        ref={(ref): void => {
                            this.scroller = ref;
                        }}
                        style={{ ...wrapperStyle }}
                        key={`${prefixCls}-scroll-wrapper`}
                    >
                        {visible.map(visibleItemRenderer).map((item: ReactElement, ind) => {
                            const { forwardRef, key } = item as any;
                            return React.cloneElement(item, {
                                ref: (node: any) => this.mergeRef(forwardRef, node, key),
                                'data-scrollkey': `${key}`,
                                key,
                            });
                        })}
                    </div>,
                    overflow[1],
                ] :
                [
                    collapseFrom === Boundary.START ? overflow : null,
                    // visible.map(visibleItemRenderer),
                    visible.map((item, idx) => {
                        const { key } = item;
                        const element = visibleItemRenderer(item, idx);
                        const child = React.cloneElement(element, {
                            style: {
                                ...element.props.style,
                                visibility: idx < pivot ? "visible" : 'hidden'
                            } as CSSProperties,
                        });
                        return (
                            <ResizeObserver
                                key={key}
                                onResize={([entry]) => this.onItemResize(entry, item, idx)}
                            >
                                {child}
                            </ResizeObserver>);
                    }),
                    collapseFrom === Boundary.END ? overflow : null,
                    // <div className={`${prefixCls}-spacer`} ref={ref => (this.spacer = ref)} key={`${prefixCls}-spacer`} />,
                ];
        const list = React.createElement(
            'div',
            {
                className: cls(`${prefixCls}`, className),
                style: {
                    ...style,
                    maxWidth: '100%'
                },
            },
            ...inner
        );
        return list;
    };

    onItemResize = (entry: ResizeEntry, item: OverflowItem, idx: number) => {
        const key = this.getItemKey(item, idx);
        const width = this.itemSizeMap.get(key);
        if (!width) {
            this.itemSizeMap.set(key, entry.target.clientWidth);
            return;
        } else if (width !== entry.target.clientWidth){
            // 某个item发生resize后，重新计算
            this.itemSizeMap.set(key, entry.target.clientWidth);
            this.setState({
                overflowStatus: 'calculating'
            });
        }
    }

    render(): ReactNode {
        const list = this.renderItemList();
        const { renderMode } = this.props;
        if (renderMode === RenderMode.SCROLL) {
            return (
                <IntersectionObserver
                    onIntersect={this.reintersect}
                    root={this.scroller}
                    threshold={this.props.threshold}
                    items={this.itemRefs}
                >
                    {list}
                </IntersectionObserver>
            );
        }
        return <ResizeObserver onResize={this.resize}>{list}</ResizeObserver>;
    }
}

export default OverflowList;