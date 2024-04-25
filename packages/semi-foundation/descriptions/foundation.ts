import BaseFoundation, { DefaultAdapter } from '../base/foundation';

export interface DescriptionsAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    getColumns: () => any[]
}

export default class DescriptionsFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<DescriptionsAdapter<P, S>, P, S> {
    constructor(adapter: DescriptionsAdapter<P, S>) {
        super({ ...adapter });
    }

    getHorizontalList() {
        const { column } = this.getProps();
        const columns = this._adapter.getColumns();
        const horizontalList = [];
        const curSpan = { totalSpan: 0, itemList: [] };
        for (const item of columns) {
            curSpan.totalSpan += item.span || 1;
            if (curSpan.totalSpan > column) {
                if (curSpan.itemList.length < column) {
                    const lastSpan = curSpan.itemList[curSpan.itemList.length - 1];
                    if (isNaN(lastSpan.span)) {
                        lastSpan.span = column - curSpan.itemList.length + (lastSpan.span || 1);
                    }
                }
                horizontalList.push(curSpan.itemList);
                curSpan.itemList = [];
                curSpan.totalSpan = item.span || 1;
            }
            curSpan.itemList.push(item);
        }

        if (curSpan.itemList.length != 0) {
            const lastSpan = curSpan.itemList[curSpan.itemList.length - 1];
            if (isNaN(lastSpan.span)) {
                let total = 0;
                curSpan.itemList.forEach(item=>{
                    return total += !isNaN(item.span)?item.span:1;
                });
                if (total < column) {
                    lastSpan.span = column - total + 1;
                }
            }
            horizontalList.push(curSpan.itemList);
        }
        return horizontalList;
    }
}
