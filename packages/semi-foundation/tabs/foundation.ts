import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { noop } from 'lodash';

export interface TabsAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    collectPane: () => void;
    notifyTabClick: (activeKey: string, event: any) => void;
    notifyChange: (activeKey: string) => void;
    setNewActiveKey: (activeKey: string) => void;
    getDefaultActiveKeyFromChildren: () => string;
}

class TabsFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<TabsAdapter<P, S>, P, S> {
    constructor(adapter: TabsAdapter<P, S>) {
        super({ ...adapter });
    }

    init(): void {
        this._adapter.collectPane();
    }

    destroy = noop;

    _notifyChange(activeKey: string): void {
        const { activeKey: stateActiveKey } = this.getStates();
        if (stateActiveKey !== activeKey) {
            this._adapter.notifyChange(activeKey);
        }
    }

    handleTabClick(activeKey: string, event: any): void {
        const isControledComponent = this._isInProps('activeKey');
        if (isControledComponent) {
            this._notifyChange(activeKey);
        } else {
            this._notifyChange(activeKey);
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
}

export default TabsFoundation;