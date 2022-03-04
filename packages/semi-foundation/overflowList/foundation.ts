import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { strings } from './constants';
import { noop, get, cloneDeep } from 'lodash';
const Boundary = strings.BOUNDARY_MAP;
const OverflowDirection = strings.OVERFLOW_DIR;

export interface OverflowListAdapter extends DefaultAdapter {
    updateStates: (state: any) => void;
    updateVisibleState: (visible: Map<string, boolean>) => void;
    notifyIntersect: (res: any) => void;
    getItemSizeMap: ()=>Map<string, number>;
}

class OverflowListFoundation extends BaseFoundation<OverflowListAdapter> {

    constructor(adapter: OverflowListAdapter) {
        super({ ...adapter });
    }

    isScrollMode = (): boolean => {
        const { renderMode } = this.getProps();
        return renderMode === 'scroll';
    };

    getOverflowItem(): Array<Array<Record<string, any>>> {
        const { items } = this.getProps();
        const { visibleState, overflow } = this.getStates();
        if (!this.isScrollMode()) {
            return overflow;
        }

        const visibleStateArr = items.map(({ key }: { key: string }) => Boolean(visibleState.get(key)));
        const visibleStart = visibleStateArr.indexOf(true);
        const visibleEnd = visibleStateArr.lastIndexOf(true);

        const overflowList = [];
        overflowList[0] = visibleStart >= 0 ? items.slice(0, visibleStart) : [];
        overflowList[1] = visibleEnd >= 0 ? items.slice(visibleEnd + 1, items.length) : items;
        return overflowList;
    }

    handleIntersect(entries: Array<IntersectionObserverEntry>): void {
        const visibleState = cloneDeep(this.getState('visibleState'));

        const res = {};
        entries.forEach(entry => {
            const itemKey = get(entry, 'target.dataset.scrollkey');
            const visible = entry.isIntersecting;
            res[itemKey] = entry;
            visibleState.set(itemKey, visible);
        });
        this._adapter.updateVisibleState(visibleState);
        this._adapter.notifyIntersect(res);
    }

    handlePartition(growing: number): void {
        const { direction, overflow, lastOverflowCount, visible } = this.getStates();
        const { minVisibleItems, collapseFrom, items } = this.getProps();
        let updateState = {};
        if (growing === OverflowDirection.NONE) {
            updateState = { direction: OverflowDirection.NONE };
        }
        if (growing === OverflowDirection.GROW) {
            const updatedOverflowCount = direction === OverflowDirection.NONE ? overflow.length : lastOverflowCount;
            updateState = {
                direction: OverflowDirection.GROW,
                lastOverflowCount: updatedOverflowCount,
                overflow: [],
                visible: items,
            };
        }
        if (growing === OverflowDirection.SHRINK && visible.length > minVisibleItems) {
            const collapseFromStart = collapseFrom === Boundary.START;
            const newVisible = visible.slice();
            const next = collapseFromStart ? newVisible.shift() : newVisible.pop();
            if (next !== undefined) {
                updateState = {
                    // set SHRINK mode unless a GROW is already in progress.
                    // GROW shows all items then shrinks until it settles, so we
                    // preserve the fact that the original trigger was a GROW.
                    direction: direction !== OverflowDirection.GROW ? OverflowDirection.SHRINK : direction,
                    overflow: collapseFromStart ? [...overflow, next] : [next, ...overflow],
                    visible: newVisible
                };
            }
        }
        this._adapter.updateStates(updateState);
    }

    handleCollapseOverflow(){
        const { overflowWidth, containerWidth, pivot: statePivot } = this.getStates();
        const { items, onOverflow } = this.getProps();
        let itemWidths = overflowWidth, pivot = 0;
        let overflowed = false;
        for (const size of this._adapter.getItemSizeMap().values()) {
            itemWidths += size;
            // 触发overflow
            if (itemWidths > containerWidth) {
                overflowed = true;
                break;
            }
            // 顺利遍历完整个列表，说明不存在overflow，直接渲染全部
            if (pivot === items.length - 1) {
                this._adapter.updateStates({
                    overflowStatus: "normal",
                    pivot: items.length - 1,
                    visible: items,
                    overflow: []
                });
            }
            pivot++;
        }
        if (overflowed) {
            const visible = items.slice(0, pivot), overflow = items.slice(pivot);
            this._adapter.updateStates({
                overflowStatus: "overflowed",
                pivot,
                visible,
                overflow,
            });
            // trigger onOverflow
            if (statePivot !== pivot){
                onOverflow(overflow);
            }
            return;
        }
    }

}

export default OverflowListFoundation;