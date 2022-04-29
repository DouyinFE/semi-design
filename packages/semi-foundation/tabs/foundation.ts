import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { get, noop } from 'lodash';
import keyCode, { ENTER_KEY } from './../utils/keyCode';

export interface TabsAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    collectPane: () => void;
    collectActiveKey: () => void;
    notifyTabClick: (activeKey: string, event: any) => void;
    notifyChange: (activeKey: string) => void;
    setNewActiveKey: (activeKey: string) => void;
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
        this._adapter.collectActiveKey();
    }

    handleTabDelete(tabKey: string): void {
        this._adapter.notifyTabDelete(tabKey);
    }

    handleKeyDown = (event: any, index: number, closable: boolean) => {
        switch (event.key) {
            case "ArrowLeft":
            case "ArrowRight":
            case "ArrowUp":
            case "ArrowDown":
                this.determineOrientation(event, index);
                break;
            case "Delete":
                this.determineDeletable(event, closable);
                break;
            case "Enter":
                this.handleTabClick(event.target.id.split('semiTab')[1], event);
                break;
        }
    }

    determineOrientation(event: any, index: number): void {
        const { tabPosition } = this.getProps();
        const isVertical = tabPosition === 'left';

        if (isVertical) {
            if (event.key ===  "ArrowUp" || event.key ===  "ArrowDown") {
                event.preventDefault();
                this.switchTabOnArrowPress(event, index);
            }
        } else {
            if (event.key ===  "ArrowLeft" || event.key === "ArrowRight") {
                this.switchTabOnArrowPress(event, index);
            }
        }
    }

    determineDeletable(event: any, closable: boolean): void {
        if (closable) {
            this.handleTabDelete(event.target.id.split('semiTab')[1]);
        }
    }

    switchTabOnArrowPress(event: any, index: number): void {
        // get all sibling nodes
        const tabs = event.target.parentNode.childNodes;

        const direction = {
            37: -1,
            38: -1,
            39: 1,
            40: 1,
        };

        if (direction[event.keyCode]) {
            if (index !== undefined) {
                if (tabs[index + direction[event.keyCode]]) {
                    tabs[index+ direction[event.keyCode]].focus();
                } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                    tabs[tabs.length - 1].focus(); // focus last tab
                } else if (event.key ===  "ArrowRight" || event.key == "ArrowDown") {
                    tabs[0].focus(); // focus first tab
                }
            }
        }
    }

}

export default TabsFoundation;
