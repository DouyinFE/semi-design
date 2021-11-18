import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { noop } from 'lodash-es';

export interface TabsAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    collectPane: () => void;
    notifyTabClick: (activeKey: string, event: any) => void;
    notifyChange: (activeKey: string) => void;
    setNewActiveKey: (activeKey: string) => void;
    notifyPanesUpdate: (panes: Array<any>) => void;
    getDefaultActiveKeyFromChildren: () => string;
    notifyTabDelete: (tabKey: string) => void;
}

class TabsFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<TabsAdapter<P, S>, P, S> {
    constructor(adapter: TabsAdapter<P, S>) {
        super({ ...adapter });
    }

    init(): void {
        this._adapter.collectPane();
    }

    destroy = noop;

    handleTabClick(activeKey: string, event: any): void {
        const isControlledComponent = this._isInProps('activeKey');
        if (isControlledComponent) {
            this._adapter.notifyChange(activeKey);
        } else {
            this._adapter.notifyChange(activeKey);
            this.handleNewActiveKey(activeKey);
        }
        this._adapter.notifyTabClick(activeKey, event);
    }

    handleNewActiveKey(activeKey: string): void {
        const { activeKey: stateActiveKey } = this.getStates();
        if (stateActiveKey !== activeKey) {
            this._adapter.setNewActiveKey(activeKey);
        }
    }

    getDefaultActiveKey(): string {
        let activeKey;
        const props = this.getProps();
        if ('activeKey' in props) {
            activeKey = props.activeKey;
        } else if ('defaultActiveKey' in props) {
            activeKey = props.defaultActiveKey;
        } else {
            activeKey = this._adapter.getDefaultActiveKeyFromChildren();
        }
        return activeKey;
    }

    handleTabListChange(): void {
        this._adapter.collectPane();
    }

    handleTabPanesChange(): void {
        this._adapter.collectPane();

        let activeKey = this.getState('activeKey');
        if (typeof activeKey === 'undefined') {
            activeKey = this._adapter.getDefaultActiveKeyFromChildren();
        }
        if (typeof activeKey !== 'undefined') {
            this.handleNewActiveKey(activeKey);
        }
    }

    handleTabDelete(tabKey: string): void {
        this._adapter.collectPane();
        const activeKey = this.getState('activeKey');
        const panes = this.getState('panes');

        if (tabKey === activeKey) {
            const activeIndex = panes.findIndex(e => e.itemKey === tabKey) === 0 ?
                0 : panes.findIndex(e => e.itemKey === tabKey) - 1;
            const newPanes = panes.filter(pane => pane.itemKey !== tabKey)
            this._adapter.notifyPanesUpdate(newPanes);
            this._adapter.setNewActiveKey(newPanes[activeIndex].itemKey);
        } else {
            this._adapter.notifyPanesUpdate(panes.filter(pane => pane.itemKey !== tabKey));
        }
        this._adapter.notifyTabDelete(tabKey);
    }
}

export default TabsFoundation;
