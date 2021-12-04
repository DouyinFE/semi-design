/* eslint-disable max-depth */
/* eslint-disable max-len */
import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import NavItem from './NavItem';
import { ItemProps } from './itemFoundation';
import { strings } from './constants';
import { get } from 'lodash';
import isNullOrUndefined from '../utils/isNullOrUndefined';

export interface ItemKey2ParentKeysMap {
    [key: string]: (string | number)[];
}

export interface OnClickData {
    itemKey: string | number;
    domEvent: any;
    isOpen: boolean;
}

export interface OnSelectData extends OnClickData {
    selectedKeys: (string | number)[];
    selectedItems: ItemProps[];
}

export interface OnOpenChangeData extends OnClickData {
    openKeys: (string | number)[];
}

export interface NavItemType {
    props?: ItemProps;
    items?: NavItemType[];
    [key: string]: any;
}

export interface NavigationAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    notifySelect(data: OnSelectData): void;
    notifyOpenChange(data: OnOpenChangeData): void;
    setIsCollapsed(isCollapsed: boolean): void;
    notifyCollapseChange(isCollapsed: boolean): void;
    updateItems(items: ItemProps[]): void;
    setItemKeysMap(map: { [key: string]: (string | number)[] }): void;
    addSelectedKeys(...keys: (string | number)[]): void;
    removeSelectedKeys(...keys: (string | number)[]): void;
    updateSelectedKeys(keys: (string | number)[]): void;
    updateOpenKeys(keys: (string | number)[]): void;
    addOpenKeys(...keys: (string | number)[]): void;
    removeOpenKeys(...keys: (string | number)[]): void;
    setItemsChanged(isChanged: boolean): void;
}

export default class NavigationFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<NavigationAdapter<P, S>, P, S> {
    constructor(adapter: NavigationAdapter<P, S>) {
        super({ ...adapter });
    }

    static getZeroParentKeys(itemKeysMap = {}, ...itemKeys: (string | number)[]) {
        const willAddKeys = [];
        if (itemKeys.length) {
            for (const itemKey of itemKeys) {
                if (Array.isArray(itemKeysMap[itemKey]) && itemKeysMap[itemKey].length) {
                    const levelZeroParentKey = itemKeysMap[itemKey][0];
                    if (!isNullOrUndefined(levelZeroParentKey)) {
                        willAddKeys.push(levelZeroParentKey);
                    }
                }
            }
        }

        return willAddKeys;
    }

    static buildItemKeysMap(items: NavItemType[] = [], keysMap = {}, parentKeys: (string | number)[] = [], keyPropName = 'itemKey') {
        if (Array.isArray(items) && items.length) {
            for (const item of items) {
                if (Array.isArray(item)) {
                    NavigationFoundation.buildItemKeysMap(item, keysMap, [...parentKeys], keyPropName);
                } else {
                    let itemKey;
                    if (item && typeof item === 'object') {
                        itemKey = item[keyPropName] || (item.props && item.props[keyPropName]);
                    }
                    if (itemKey) {
                        keysMap[itemKey] = [...parentKeys];

                        if (Array.isArray(item.items) && item.items.length) {
                            NavigationFoundation.buildItemKeysMap(
                                item.items,
                                keysMap,
                                [...parentKeys, itemKey],
                                keyPropName
                            );
                        } else if (item.props && item.props.children) {
                            const children = Array.isArray(item.props.children)
                                ? item.props.children
                                : [item.props.children];
                            NavigationFoundation.buildItemKeysMap(
                                children,
                                keysMap,
                                [...parentKeys, itemKey],
                                keyPropName
                            );
                        }
                    }
                }
            }
        }

        return keysMap;
    }

    /**
     * init is called in constructor and componentDidMount.
     * if you want to update state in constructor, please add it to return object;
     * if you want to update state in componentDidMount, please call adapter in else logic.
     * @param {*} lifecycle
     * @returns
     */
    init(lifecycle: string) {
        const { defaultSelectedKeys, selectedKeys } = this.getProps();
        let willSelectedKeys = selectedKeys || defaultSelectedKeys || [];
        const { itemKeysMap, willOpenKeys, formatedItems } = this.getCalcState();
        const parentSelectKeys = this.selectLevelZeroParentKeys(itemKeysMap, willSelectedKeys);
        willSelectedKeys = willSelectedKeys.concat(parentSelectKeys);

        if (lifecycle === 'constructor') {
            return {
                selectedKeys: willSelectedKeys,
                itemKeysMap,
                openKeys: willOpenKeys,
                items: formatedItems,
            };
        } else {
            this._adapter.updateSelectedKeys(willSelectedKeys);
            this._adapter.setItemKeysMap(itemKeysMap);
            this._adapter.updateOpenKeys(willOpenKeys);
            this._adapter.updateItems(formatedItems);
            this._adapter.setItemsChanged(true);
        }
        return undefined;
    }

    /**
     * Get the state to be calculated
     */
    getCalcState() {
        const { itemKeysMap, formatedItems } = this.getFormatedItems();
        const willOpenKeys = this.getWillOpenKeys(itemKeysMap);
        return { itemKeysMap, willOpenKeys, formatedItems };
    }

    /**
     * Calculate formatted items and itemsKeyMap
     */
    getFormatedItems() {
        const { items, children } = this.getProps();
        const formatedItems = this.formatItems(items);
        const willHandleItems = Array.isArray(items) && items.length ? formatedItems : children;
        const itemKeysMap = NavigationFoundation.buildItemKeysMap(willHandleItems);
        return {
            itemKeysMap,
            formatedItems
        };
    }

    /**
     * Calculate the keys that will need to be opened soon
     * @param {*} itemKeysMap
     */
    getWillOpenKeys(itemKeysMap: ItemKey2ParentKeysMap) {
        const { defaultOpenKeys, openKeys, defaultSelectedKeys, selectedKeys, mode } = this.getProps();

        let willOpenKeys = openKeys || defaultOpenKeys || [];
        if (
            !(Array.isArray(defaultOpenKeys) ||
            Array.isArray(openKeys)) && mode === strings.MODE_VERTICAL && (Array.isArray(defaultSelectedKeys) || Array.isArray(selectedKeys))
        ) {
            const currentSelectedKeys = Array.isArray(selectedKeys) ? selectedKeys : defaultSelectedKeys;
            willOpenKeys = this.getShouldOpenKeys(itemKeysMap, currentSelectedKeys);
        }
        return [...willOpenKeys];
    }

    getItemKey(item: string | number, keyPropName = 'itemKey') {
        if (item && typeof item === 'object') {
            return item[keyPropName];
        }
        return item;
    }

    getShouldOpenKeys(itemKeysMap: ItemKey2ParentKeysMap = {}, selectedKeys: string | number[] = []) {
        const willOpenKeySet = new Set();

        if (Array.isArray(selectedKeys) && selectedKeys.length) {
            selectedKeys.forEach(item => {
                if (item) {
                    const parentKeys = get(itemKeysMap, this.getItemKey(item));

                    if (Array.isArray(parentKeys)) {
                        parentKeys.forEach(k => willOpenKeySet.add(k));
                    }
                }
            });
        }

        return [...willOpenKeySet];
    }

    destroy() {} // eslint-disable-line

    selectLevelZeroParentKeys(itemKeysMap: ItemKey2ParentKeysMap, ...itemKeys: (string | number)[]) {
        const _itemKeysMap = isNullOrUndefined(itemKeysMap) ? this.getState('itemKeysMap') : itemKeysMap;
        // console.log(itemKeysMap);

        const willAddKeys = [];
        if (itemKeys.length) {
            for (const itemKey of itemKeys) {
                if (Array.isArray(_itemKeysMap[itemKey]) && _itemKeysMap[itemKey].length) {
                    const levelZeroParentKey = _itemKeysMap[itemKey][0];
                    if (!isNullOrUndefined(levelZeroParentKey)) {
                        willAddKeys.push(levelZeroParentKey);
                    }
                }
            }
        }
        if (willAddKeys.length) {
            return willAddKeys;
        }
        return [];
    }

    formatItems(items: ItemProps[] = []) {
        const formatedItems = [];
        for (const item of items) {
            formatedItems.push(new NavItem(item));
        }
        return formatedItems;
    }

    handleSelect(data: OnSelectData) {
        this._adapter.notifySelect(data);
    }

    judgeIfOpen(openKeys: (string | number)[], items: NavItemType[]): boolean {
        let shouldBeOpen = false;

        const _openKeys = Array.isArray(openKeys) ? openKeys : openKeys && [openKeys];

        if (_openKeys && Array.isArray(items) && items.length) {
            for (const item of items) {
                shouldBeOpen = _openKeys.includes(item.itemKey) || this.judgeIfOpen(_openKeys, item.items);
                if (shouldBeOpen) {
                    break;
                }
            }
        }

        return shouldBeOpen;
    }

    handleCollapseChange() {
        const isCollapsed = !this.getState('isCollapsed');

        if (!this._isControlledComponent('isCollapsed')) {
            this._adapter.setIsCollapsed(isCollapsed);
        }
        this._adapter.notifyCollapseChange(isCollapsed);
    }

    handleItemsChange(isChanged: boolean) {
        this._adapter.setItemsChanged(isChanged);
    }
}
