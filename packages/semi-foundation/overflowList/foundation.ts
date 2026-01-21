import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { strings } from './constants';
import { noop, get, cloneDeep } from 'lodash';
const Boundary = strings.BOUNDARY_MAP;
const OverflowDirection = strings.OVERFLOW_DIR;

export interface OverflowListAdapter extends DefaultAdapter {
    updateStates: (state: any) => void;
    updateVisibleState: (visible: Map<string, boolean>) => void;
    notifyIntersect: (res: any) => void;
    getItemSizeMap: () => Map<string, number>
}

// 防抖稳定性检测的时间阈值（毫秒）
const STABILITY_THRESHOLD_MS = 150;

class OverflowListFoundation extends BaseFoundation<OverflowListAdapter> {
    // 记录上次的 overflow 结果，用于稳定性检测
    previousOverflowResult: Array<Array<Record<string, any>>> = [[], []];
    
    // 记录每个 item 的状态变化历史（时间戳）
    stateChangeHistory: Map<string, number[]> = new Map();
    
    // 最后一次稳定更新的时间戳
    lastStableUpdateTimestamp: number = 0;

    constructor(adapter: OverflowListAdapter) {
        super({ ...adapter });
    }

    previousY = undefined;

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

        const overflowList: Array<Array<Record<string, any>>> = [];
        overflowList[0] = visibleStart >= 0 ? items.slice(0, visibleStart) : [];
        overflowList[1] = visibleEnd >= 0 ? items.slice(visibleEnd + 1, items.length) : items;
        
        // 稳定性检测：比较新旧 overflow 结果
        const isResultChanged = this.isOverflowResultChanged(overflowList);
        
        if (isResultChanged) {
            const now = Date.now();
            const timeSinceLastUpdate = now - this.lastStableUpdateTimestamp;
            
            // 如果距离上次稳定更新时间太短，说明可能在抖动，返回上次稳定结果
            if (timeSinceLastUpdate < STABILITY_THRESHOLD_MS && this.previousOverflowResult[0].length + this.previousOverflowResult[1].length > 0) {
                return this.previousOverflowResult;
            }
            
            // 更新稳定状态
            this.lastStableUpdateTimestamp = now;
            this.previousOverflowResult = overflowList;
        }
        
        return overflowList;
    }
    
    /**
     * 检查 overflow 结果是否发生变化
     */
    isOverflowResultChanged(newResult: Array<Array<Record<string, any>>>): boolean {
        const prevLeft = this.previousOverflowResult[0];
        const prevRight = this.previousOverflowResult[1];
        const newLeft = newResult[0];
        const newRight = newResult[1];
        
        if (prevLeft.length !== newLeft.length || prevRight.length !== newRight.length) {
            return true;
        }
        
        // 比较 key 是否一致
        const prevLeftKeys = prevLeft.map(item => item.key).join(',');
        const prevRightKeys = prevRight.map(item => item.key).join(',');
        const newLeftKeys = newLeft.map(item => item.key).join(',');
        const newRightKeys = newRight.map(item => item.key).join(',');
        
        return prevLeftKeys !== newLeftKeys || prevRightKeys !== newRightKeys;
    }

    handleIntersect(entries: Array<IntersectionObserverEntry>): void {
        const visibleState = cloneDeep(this.getState('visibleState'));

        const res = {};
        entries.forEach(entry => {
            const itemKey: string = get(entry, 'target.dataset.scrollkey');
            const visible = entry.isIntersecting;
            res[itemKey] = entry;
            visibleState.set(itemKey, visible);
        });
        let someItemVisible = false;
        for (const value of visibleState.values()) {
            if (value) {
                someItemVisible = true;
                break;
            }
        }
        // Any item is visible, indicating that the List is visible
        const wholeListVisible = someItemVisible;
        // If scrolling in the vertical direction makes the List invisible, no processing is required. 
        // If this.previousY is undefined, it means that the List is mounted for the first time and will not be processed.
        const [entry1] = entries;
        const currentY = entry1.boundingClientRect.y;
        if (!wholeListVisible && this.previousY !== undefined && currentY !== this.previousY) {
            this.previousY = currentY;
            return;
        }
        this.previousY = currentY;
        this._adapter.updateVisibleState(visibleState);
        this._adapter.notifyIntersect(res);
    }

    getReversedItems = ()=>{
        const { items } = this.getProps();
        return cloneDeep(items).reverse();
    }
    handleCollapseOverflow() {
        const { minVisibleItems, collapseFrom } = this.getProps();
        const { overflowWidth, containerWidth, pivot: statePivot, overflowStatus } = this.getStates();
        const { items, onOverflow } = this.getProps();
        let itemWidths = overflowWidth, _pivot = 0;
        let overflowed = false;
        for (const size of this._adapter.getItemSizeMap().values()) {
            itemWidths += size;
            // 触发overflow
            if (itemWidths > containerWidth) {
                overflowed = true;
                break;
            }
            // 顺利遍历完整个列表，说明不存在overflow，直接渲染全部
            if (_pivot === items.length - 1) {
                this._adapter.updateStates({
                    overflowStatus: "normal",
                    pivot: items.length - 1,
                    visible: items,
                    overflow: []
                });
                break;
            }
            _pivot++;
        }
        if (overflowed) {
            const pivot = Math.max(minVisibleItems, _pivot);
            const isCollapseFromStart = collapseFrom === Boundary.START;
            const visible = isCollapseFromStart ? this.getReversedItems().slice(0, pivot).reverse() : items.slice(0, pivot);
            const overflow = isCollapseFromStart ? this.getReversedItems().slice(pivot).reverse() : items.slice(pivot);
            this._adapter.updateStates({
                overflowStatus: "overflowed",
                pivot: pivot,
                visible,
                overflow,
            });
            // trigger onOverflow
            if (statePivot !== pivot) {
                onOverflow(overflow);
            }
            return;
        }
    }

}

export default OverflowListFoundation;