import BaseFoundation, { DefaultAdapter } from '../base/foundation';

export interface DescriptionsAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    getColumns: () => any[]
}

export default class DescriptionsFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<DescriptionsAdapter<P, S>, P, S> {
    constructor(adapter: DescriptionsAdapter<P, S>) {
        super({ ...adapter });
    }

    getHorizontalList() {
        const { column, data, children } = this.getProps();
        const columns = this._adapter.getColumns();
        const horizontalList = [];
        const curSpan = { totalSpan: 0, itemList: [] };
        for (const item of columns) {
            curSpan.totalSpan += item.span || 1;
            curSpan.itemList.push(item);
            if (curSpan.totalSpan >= column) {
                horizontalList.push(curSpan.itemList);
                curSpan.itemList = [];
                curSpan.totalSpan = 0;
            }
        }
        if (curSpan.itemList.length != 0) horizontalList.push(curSpan.itemList);
        return horizontalList;
    }
}
