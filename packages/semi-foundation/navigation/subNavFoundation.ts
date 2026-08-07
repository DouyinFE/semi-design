import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import isEnterPress from '../utils/isEnterPress';

const addKeys = function addKeys(originKeys: (string | number)[] = [], ...willAddKeys: (string | number)[]) {
    const keySet = new Set(originKeys);
    willAddKeys.forEach(key => key && keySet.add(key));
    return Array.from(keySet);
};

const removeKeys = function removeKeys(originKeys: (string | number)[] = [], ...willRemoveKeys: (string | number)[]) {
    const keySet = new Set(originKeys);
    willRemoveKeys.forEach(key => key && keySet.delete(key));
    return Array.from(keySet);
};

const hasKeys = function hasKeys(originKeys: (string | number)[] = [], ...willCheckKeys: (string | number)[]) {
    const keySet = new Set(originKeys);
    return willCheckKeys.some(key => key && keySet.has(key));   
};

export interface OnOpenChangeData {
    itemKey: string | number;
    openKeys: (string | number)[];
    isOpen: boolean
}

export interface OnClickData extends OnOpenChangeData {
    domEvent: any
}

export interface OnSelectData extends OnOpenChangeData {
    domEvent: any
}

export interface SubNavAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    updateIsHovered(isHovered: boolean): void;
    getOpenKeys(): (string | number)[];
    getOpenKeysIsControlled(): boolean;
    getCanUpdateOpenKeys(): boolean;
    notifyGlobalOpenChange(data: OnOpenChangeData): void;
    notifyGlobalOnSelect(data: OnSelectData): void;
    notifyGlobalOnClick(data: OnClickData): void;
    getIsSelected(itemKey: string | number): boolean;
    getIsOpen(): boolean;
    updateOpenKeys(openKeys: (string | number)[]): void
}

export default class SubNavFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<SubNavAdapter<P, S>, P, S> {
    constructor(adapter: SubNavAdapter<P, S>) {
        super({ ...adapter });
    }

    _timer: number;
    _currentHoverAlreadyOpen: null | number | string;

    init() {
        // this.log('invoke SubNavFoundation init()');
        this._timer = null;
        this._currentHoverAlreadyOpen = null;
    }

    destroy() {
        this.clearDelayTimer();
    }

    clearDelayTimer() {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
    }

    isValidKey(itemKey: string | number) {
        return itemKey != null && (typeof itemKey === 'number' || typeof itemKey === 'string');
    }

    handleDropdownVisibleChange(visible: boolean) {
        const itemKey = this.getProp('itemKey');

        const openKeysIsControlled = this._adapter.getOpenKeysIsControlled();
        const canUpdateOpenKeys = this._adapter.getCanUpdateOpenKeys();
        const rawOpenKeys = this._adapter.getOpenKeys();

        let openKeys = rawOpenKeys;

        if (visible) {
            if (hasKeys(rawOpenKeys, itemKey)) {
                // 如果 state.openKeys已经存在，说明他之前就已经处于open态，不需要再次将其写入 state.openKeys中
            } else {
                // 如果 itemKey 跟 _currentHoverAlreadyOpen 不相同，说明是新的 hover，正常更新 state.openKeys
                openKeys = addKeys(rawOpenKeys, itemKey);
            }
            this._currentHoverAlreadyOpen = itemKey;
        } else {
            if (itemKey !== this._currentHoverAlreadyOpen) {
                openKeys = removeKeys(rawOpenKeys, itemKey);
            }
            this._currentHoverAlreadyOpen = null;
        }

        this.clearDelayTimer();

        if (!openKeysIsControlled) {
            if (canUpdateOpenKeys) {
                this._adapter.updateOpenKeys(openKeys);
            }
            // this._adapter.updateIsHovered(visible);
        }

        this._adapter.notifyGlobalOpenChange({ itemKey, openKeys, isOpen: visible });
    }

    /**
     *
     * @param {Event} e
     * @param {HTMLElement} titleRef
     */
    handleClick(e: any, titleRef: any) {
        const { itemKey, disabled } = this.getProps();
        if (disabled) {
            return;
        }
        // this.log(e, titleRef, titleRef.contains(e.target));
        const clickedDomIsTitle = titleRef && titleRef.contains(e.target);
        let isOpen = Boolean(this._adapter.getIsOpen());
        if (!clickedDomIsTitle) {
            isOpen = false;
        } else {
            isOpen = !isOpen;
        }

        const openKeys = isOpen
            ? addKeys(this._adapter.getOpenKeys(), itemKey)
            : removeKeys(this._adapter.getOpenKeys(), itemKey);

        const cbVal = { itemKey, openKeys, isOpen, domEvent: e };

        const openKeysIsControlled = this._adapter.getOpenKeysIsControlled();
        const canUpdateOpenKeys = this._adapter.getCanUpdateOpenKeys();

        if (!openKeysIsControlled && canUpdateOpenKeys) {
            this._adapter.updateOpenKeys(openKeys);
        }
        this._adapter.notifyGlobalOpenChange(cbVal);
        this._adapter.notifyGlobalOnClick(cbVal);
    }

    /**
     * A11y: simulate sub nav click
     * @param e 
     * @param titleRef 
     */
    handleKeyPress(e: any, titleRef: any) {
        if (isEnterPress(e)) {
            this.handleClick(e, titleRef);
        }
    }
}
