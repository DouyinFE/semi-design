/* eslint-disable arrow-body-style */
import React, { CSSProperties, ReactNode, MutableRefObject, RefCallback, Key, ReactElement } from 'react';
import cls from 'classnames';
import BaseComponent from '../_base/baseComponent';
import PropTypes from 'prop-types';
import { isEqual, omit, isNull, isUndefined } from 'lodash';
import { cssClasses, strings } from '@douyinfe/semi-foundation/overflowList/constants';
import ResizeObserver, { ResizeEntry } from '../resizeObserver';
import IntersectionObserver from './intersectionObserver';

import OverflowListFoundation, { OverflowListAdapter } from '@douyinfe/semi-foundation/overflowList/foundation';

import '@douyinfe/semi-foundation/overflowList/overflowList.scss';

const prefixCls = cssClasses.PREFIX;
const Boundary = strings.BOUNDARY_MAP;
const OverflowDirection = strings.OVERFLOW_DIR;
const RenderMode = strings.MODE_MAP;

export type { ReactIntersectionObserverProps } from './intersectionObserver';
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
    wrapperStyle?: CSSProperties
}

export interface OverflowListState {
    direction?: typeof OverflowDirection.GROW;
    lastOverflowCount?: number;
    overflow?: Array<OverflowItem>;
    visible?: Array<OverflowItem>;
    visibleState?: Map<string, boolean>;
    prevProps?: OverflowListProps
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
            visible: props.items,
            visibleState: new Map(),
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
            newState.overflow = [];
            newState.visible = props.items;
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
            }
        };
    }

    itemRefs: Record<string, any>;

    scroller: HTMLDivElement = null;
    spacer: HTMLDivElement = null;

    previousWidths: Map<Element, number>;

    itemSizeMap: Map<string, any>;

    isScrollMode = (): boolean => {
        const { renderMode } = this.props;
        return renderMode === RenderMode.SCROLL;
    };

    componentDidMount(): void {
        this.repartition(false);
    }

    shouldComponentUpdate(_nextProps: OverflowListProps, nextState: OverflowListState): boolean {
        // We want this component to always re-render, even when props haven't changed, so that
        // changes in the renderers' behavior can be reflected.
        // The following statement prevents re-rendering only in the case where the state changes
        // identity (i.e. setState was called), but the state is still the same when
        // shallow-compared to the previous state.
        const currState = omit(this.state, 'prevProps');
        const comingState = omit(nextState, 'prevProps');
        return !(currState !== comingState && isEqual(currState, comingState));
    }

    componentDidUpdate(prevProps: OverflowListProps, prevState: OverflowListState): void {


        if (!isEqual(prevProps.items, this.props.items)) {
            this.itemRefs = {};
        }


        if (!isEqual(omit(prevState, 'prevProps'), omit(this.state, 'prevProps'))) {
            this.repartition(false);
        }
        const { direction, overflow, lastOverflowCount } = this.state;
        if (
            // if a resize operation has just completed (transition to NONE)
            direction === OverflowDirection.NONE &&
            direction !== prevState.direction &&
            overflow.length !== lastOverflowCount
        ) {
            this.props.onOverflow && this.props.onOverflow(overflow);
        }
    }

    resize = (entries: Array<ResizeEntry> = []): void => {
        // if any parent is growing, assume we have more room than before
        const growing = entries.some(entry => {
            const previousWidth = this.previousWidths.get(entry.target) || 0;
            return entry.contentRect.width > previousWidth;
        });
        this.repartition(growing);
        entries.forEach(entry => this.previousWidths.set(entry.target, entry.contentRect.width));
    };

    repartition = (growing: boolean): void => {
        // if not mounted or scroll mode, we do not
        if (isNull(this.spacer) || isUndefined(this.spacer) || this.isScrollMode()) {
            return;
        }
        // spacer has flex-shrink and width 1px so if it's much smaller then we know to shrink
        const state = growing ?
            OverflowDirection.GROW :
            this.spacer.getBoundingClientRect().width < 0.9 ? OverflowDirection.SHRINK : OverflowDirection.NONE;
        this.foundation.handlePartition(state);
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
        const overflow = this.foundation.getOverflowItem();
        return this.props.overflowRenderer(overflow);
    };

    renderItemList = () => {
        const { className, wrapperClassName, wrapperStyle, style, visibleItemRenderer, renderMode, collapseFrom } = this.props;

        const { visible } = this.state;
        const overflow = this.renderOverflow();
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
                    visible.map(visibleItemRenderer),
                    collapseFrom === Boundary.END ? overflow : null,
                    <div className={`${prefixCls}-spacer`} ref={ref => (this.spacer = ref)} key={`${prefixCls}-spacer`} />,
                ];
        const list = React.createElement(
            'div',
            {
                className: cls(`${prefixCls}`, className),
                style,
            },
            ...inner
        );
        return list;
    };

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