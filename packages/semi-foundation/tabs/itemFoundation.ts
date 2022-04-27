import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { get } from 'lodash';
import keyCode, { ENTER_KEY } from './../utils/keyCode';

export interface TabsItemAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    notifyClick: (item: any, e: any) => void;
}

export default class TabsItemFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<TabsItemAdapter<P, S>, P, S> {

    constructor(adapter: TabsItemAdapter<P, S>) {
        super({ ...adapter });
    }

    // handleNewActiveKey(activeKey: string): void {
    //     const { activeKey: stateActiveKey } = this.getStates();
    //     if (stateActiveKey !== activeKey) {
    //         this._adapter.setNewActiveKey(activeKey);
    //     }
    // }

    handleKeyDown(event: any): void {
        console.log("key", event);
        const key = get(event, 'key');
        console.log("key", key, key === keyCode.LEFT);

        switch (key) {
            case "ArrowLeft":
            case 'ArrowRight':
                this.determineOrientation(event);
                break;
            // case keys.delete:
            //     determineDeletable(event);
            //     break;
            case ENTER_KEY:
            // case keys.space:
                // activateTab(event.target);
                // break;
        }
    }

    determineOrientation(event: any): void {
        const { tabPosition } = this.getProps();
        const key = get(event, 'key');
        const isVertical = tabPosition === 'left';
        console.log("key", key);

        if (isVertical) {
            if (key === keyCode.UP || key === keyCode.DOWN) {
                event.preventDefault();
                this.switchTabOnArrowPress(event);
            }
        } else {
            if (key === keyCode.LEFT || key === keyCode.RIGHT) {
                this.switchTabOnArrowPress(event);
            }
        }
    }

    switchTabOnArrowPress(event: any): void {
        const key = get(event, 'key');
        const tabs = document.querySelectorAll('[role="tab"]');

        const direction = {
            37: -1,
            38: -1,
            39: 1,
            40: 1,
        };

        if (direction[key]) {
            const target = event.target;
            if (target.index !== undefined) {
                if (tabs[target.index + direction[key]]) {
                    // tabs[target.index + direction[key]].focus();
                } else if (key === keyCode.LEFT || key === keyCode.UP) {
                    // focusLastTab();
                } else if (key === keyCode.RIGHT || key == keyCode.DOWN) {
                    // focusFirstTab();
                }
            }
        }
    }

}
