import BaseFoundation, { DefaultAdapter } from '../base/foundation';

export interface DescriptionsAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    getColumns: () => any[]
}

export default class DescriptionsFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<DescriptionsAdapter<P, S>, P, S> {
    constructor(adapter: DescriptionsAdapter<P, S>) {
        super({ ...adapter });
    }

    // 当一行里面的列数没有达到maxColumnPerLine，就让最后一列填满剩余的
    _rowFillRemainder(itemRow: any) {
        const { column: maxColumnPerLine } = this.getProps();
        if (itemRow.length === 0) {
            return;
        }
        const lastSpan = itemRow[itemRow.length - 1];
        // 如果用户设置了span就跳过
        if (lastSpan.span && !isNaN(lastSpan.span)) {
            return;
        }

        let total = 0;
        itemRow.forEach((item: { span: number })=>{
            return total += !isNaN(item.span)?item.span:1;
        });

        if (total < maxColumnPerLine) {
            lastSpan.span = maxColumnPerLine - total + 1;
        }
    }

    getHorizontalList() {
        const { column: maxColumnPerLine } = this.getProps();
        const columns = this._adapter.getColumns();
        const horizontalList = [];
        const curRow = { totalSpan: 0, itemList: [] };
        columns.forEach((item, index) => {
            let itemSpan = item.span || 1;
            let restSpan = maxColumnPerLine - curRow.totalSpan;
            if (itemSpan <= restSpan) {
                curRow.itemList.push(item);
                curRow.totalSpan = curRow.totalSpan + itemSpan;
            } else {
                // 剩余空间放不下当前item，需要另起一行
                // 若新行放不下当前item，极端情况，例如用户给当前span数值远大于 maxColumnPerLine，即使另起新行都无法放得下，itemSpan直接按props.column处理
                itemSpan > maxColumnPerLine ? itemSpan = maxColumnPerLine : null;
                // 新行能放得下当前item，将原有行push到horizontalList中，然后重置curRow，将当前item存到curRow中
                this._rowFillRemainder(curRow.itemList);
                horizontalList.push(curRow.itemList);
                curRow.totalSpan = itemSpan;
                curRow.itemList = [item];
            }
            if (index === columns.length -1) {
                this._rowFillRemainder(curRow.itemList);
                horizontalList.push(curRow.itemList);
            }
        });

        return horizontalList;
    }
}
