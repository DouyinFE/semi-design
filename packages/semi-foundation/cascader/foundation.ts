import { isEqual, get, difference, isUndefined, assign, cloneDeep, isEmpty, isNumber, includes } from 'lodash';
import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import {
    filter,
    findAncestorKeys,
    calcCheckedKeysForUnchecked,
    calcCheckedKeysForChecked,
    calcCheckedKeys,
    findDescendantKeys,
    normalizeKeyList
} from '../tree/treeUtil';
import { Motion } from '../utils/type';
import {
    convertDataToEntities,
    findKeysForValues,
    normalizedArr,
    isValid,
    calcMergeType
} from './util';
import { strings } from './constants';

export interface BasicData {
    data: BasicCascaderData;
    disabled: boolean;
    key: string;
    searchText: any[];
}

export interface BasicEntities {
    [idx: string]: BasicEntity;
}

export interface BasicEntity {
    _notExist?: boolean;
    /* children list */
    children?: Array<BasicEntity>;
    /* treedata */
    data: BasicCascaderData;
    /* index */
    ind: number;
    /* key */
    key: string;
    /* node level */
    level: number;
    /* parent data */
    parent?: BasicEntity;
    /* parent key */
    parentKey?: string;
    /* key path */
    path: Array<string>;
    /* value path */
    valuePath: Array<string>;
}

export interface BasicCascaderData {
    [x: string]: any;
    value: string | number;
    label: any;
    disabled?: boolean;
    isLeaf?: boolean;
    loading?: boolean;
    children?: BasicCascaderData[];
}

export type CascaderType = 'large' | 'small' | 'default';

/* The basic type of the value of Cascader */
export type BasicSimpleValueType = string | number | BasicCascaderData;

/* The value of Cascader */
export type BasicValue = BasicSimpleValueType | Array<BasicSimpleValueType> | Array<Array<BasicSimpleValueType>>;

export type ShowNextType = 'click' | 'hover';

export interface BasicTriggerRenderProps {
    /* Props passed to Cascader by all users */
    componentProps: BasicCascaderProps;
    /* Whether to disable Cascader */
    disabled: boolean;
    /** The hierarchical position of the selected node in treeData,
     * as in the following example, when Zhejiang-Hangzhou-Xiaoshan
     * District is selected, the value here is 0-0-1 */
    value?: string | Set<string>;
    /* The input value of the current input box */
    inputValue: string;
    /* Cascader's placeholder */
    placeholder?: string;
    /** The function used to update the value of the input box. You
     * should call this function when the value of the Input component
     * customized by triggerRender is updated to synchronize the state
     * with Cascader. */
    onChange: (inputValue: string) => void;
    /* Function to clear the value */
    onClear: (e: any) => void;
}

export interface BasicScrollPanelProps {
    panelIndex: number;
    activeNode: BasicCascaderData;
}

export interface BasicCascaderProps {
    mouseEnterDelay?: number;
    mouseLeaveDelay?: number;
    separator?: string;
    arrowIcon?: any;
    changeOnSelect?: boolean;
    multiple?: boolean;
    autoMergeValue?: boolean;
    defaultValue?: BasicValue;
    disabled?: boolean;
    dropdownClassName?: string;
    dropdownStyle?: any;
    emptyContent?: any;
    filterLeafOnly?: boolean;
    motion?: Motion;
    filterTreeNode?: ((inputValue: string, treeNodeString: string) => boolean) | boolean;
    placeholder?: string;
    searchPlaceholder?: string;
    size?: CascaderType;
    className?: string;
    treeData?: Array<BasicCascaderData>;
    treeNodeFilterProp?: string;
    displayProp?: string;
    maxTagCount?: number;
    max?: number;
    showRestTagsPopover?: boolean;
    restTagsPopoverProps?: any;
    children?: any;
    zIndex?: number;
    value?: BasicValue;
    prefix?: any;
    suffix?: any;
    insetLabel?: any;
    style?: any;
    stopPropagation?: boolean | string;
    showClear?: boolean;
    autoAdjustOverflow?: boolean;
    defaultOpen?: boolean;
    onChangeWithObject?: boolean;
    bottomSlot?: any;
    topSlot?: any;
    showNext?: ShowNextType;
    disableStrictly?: boolean;
    leafOnly?: boolean;
    enableLeafClick?: boolean;
    onClear?: () => void;
    triggerRender?: (props: BasicTriggerRenderProps) => any;
    onListScroll?: (e: any, panel: BasicScrollPanelProps) => void;
    loadData?: (selectOptions: BasicCascaderData[]) => Promise<void>;
    onLoad?: (newLoadedKeys: Set<string>, data: BasicCascaderData) => void;
    onDropdownVisibleChange?: (visible: boolean) => void;
    getPopupContainer?: () => HTMLElement;
    onChange?: (value: BasicValue) => void;
    onSearch?: (value: string) => void;
    onSelect?: (value: string | number | Array<string | number>) => void;
    onExceed?: (checkedItem: BasicEntity[]) => void;
    displayRender?: (selected: Array<string> | BasicEntity, idx?: number) => any;
    onBlur?: (e: any) => void;
    onFocus?: (e: any) => void;
}

export interface BasicCascaderInnerData {
    isOpen: boolean;
    rePosKey: number;
    keyEntities: BasicEntities;
    selectedKeys: Set<string>;
    activeKeys: Set<string>;
    filteredKeys: Set<string>;
    inputValue: string;
    isSearching: boolean;
    inputPlaceHolder: string;
    prevProps: BasicCascaderProps;
    isHovering: boolean;
    checkedKeys: Set<string>;
    halfCheckedKeys: Set<string>;
    resolvedCheckedKeys: Set<string>;
    loadedKeys: Set<string>;
    loadingKeys: Set<string>;
    loading: boolean;
    treeData?: Array<BasicCascaderData>;
    isFocus?: boolean;
    isInput?: boolean;
    disabledKeys?: Set<string>;
}

export interface CascaderAdapter extends DefaultAdapter<BasicCascaderProps, BasicCascaderInnerData> {
    notifyClear?: () => void;
    updateInputValue: (value: string) => void;
    updateInputPlaceHolder: (value: string) => void;
    focusInput: () => void;
    registerClickOutsideHandler: (cb: (e: any) => void) => void;
    unregisterClickOutsideHandler: () => void;
    rePositionDropdown: () => void;
    updateStates: (states: Partial<BasicCascaderInnerData>) => void;
    openMenu: () => void;
    closeMenu: (cb?: () => void) => void;
    updateSelection: (selectedKeys: Set<string>) => void;
    notifyChange: (value: BasicValue) => void;
    notifySelect: (selected: string | number | Array<string | number>) => void;
    notifyOnSearch: (input: string) => void;
    notifyFocus: (e: any) => void;
    notifyBlur: (e: any) => void;
    notifyDropdownVisibleChange: (visible: boolean) => void;
    toggleHovering: (bool: boolean) => void;
    notifyLoadData: (selectedOpt: BasicCascaderData[], callback: (data?: BasicEntities) => void) => void;
    notifyOnLoad: (newLoadedKeys: Set<string>, data: BasicCascaderData) => void;
    notifyListScroll: (e: any, panel: BasicScrollPanelProps) => void;
    notifyOnExceed: (data: BasicEntity[]) => void;
}

// eslint-disable-next-line max-len
export default class CascaderFoundation extends BaseFoundation<CascaderAdapter, BasicCascaderProps, BasicCascaderInnerData> {

    constructor(adapter: CascaderAdapter) {
        super({ ...adapter });
    }

    init() {
        const isOpen = this.getProp('open') || this.getProp('defaultOpen');
        this.collectOptions(true);

        if (isOpen && !this._isDisabled()) {
            this.open();
        }
    }

    destroy() {
        this._adapter.unregisterClickOutsideHandler();
    }

    _isDisabled() {
        return this.getProp('disabled');
    }

    _isFilterable() {
        return Boolean(this.getProp('filterTreeNode')); // filter can be boolean or function
    }

    _notifyChange(item: BasicEntity | BasicData | Set<string>) {
        const { onChangeWithObject, multiple } = this.getProps();
        const valueProp: string | any[] = onChangeWithObject ? [] : 'value';
        if (multiple) {
            const valuePath: BasicValue = [];
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore 
            item.forEach((checkedKey: string) => {
                const valuePathItem = this.getItemPropPath(checkedKey, valueProp);
                valuePath.push(valuePathItem as any);
            });
            this._adapter.notifyChange(valuePath);
        } else {
            const valuePath = isUndefined(item) || !('key' in item) ?
                [] :
                this.getItemPropPath(item.key, valueProp);
            this._adapter.notifyChange(valuePath);
        }
    }

    _isLeaf(item: BasicCascaderData) {
        if (this.getProp('loadData')) {
            return Boolean(item.isLeaf);
        }
        return !item.children || !item.children.length;
    }

    _clearInput() {
        this._adapter.updateInputValue('');
    }

    // Scenes that may trigger blur:
    //  1、clickOutSide
    _notifyBlur(e: any) {
        this._adapter.notifyBlur(e);
    }

    // Scenes that may trigger focus:
    //  1、click selection
    _notifyFocus(e: any) {
        this._adapter.notifyFocus(e);
    }

    _isOptionDisabled(key: string, keyEntities: BasicEntities) {
        const isDisabled = findAncestorKeys([key], keyEntities, true)
            .some(item => keyEntities[item].data.disabled);
        return isDisabled;
    }

    getCopyFromState(items: string | string[]) {
        const res: Partial<BasicCascaderInnerData> = {};
        normalizedArr(items).forEach(key => {
            res[key] = cloneDeep(this.getState(key));
        });
        return res;
    }

    // prop: is array, return all data
    getItemPropPath(selectedKey: string, prop: string | any[], keyEntities?: BasicEntities) {
        const searchMap = keyEntities || this.getState('keyEntities');
        const selectedItem = searchMap[selectedKey];
        let path = [];
        if (!selectedItem) {
            // do nothing
        } else if (selectedItem._notExist) {
            path = selectedItem.path;
        } else {
            const keyPath = selectedItem.path;
            path = Array.isArray(prop) ?
                keyPath.map((key: string) => searchMap[key].data) :
                keyPath.map((key: string) => searchMap[key].data[prop]);
        }
        return path;
    }

    _getCacheValue(keyEntities: BasicEntities) {
        const { selectedKeys } = this.getStates();
        const selectedKey = Array.from(selectedKeys as Set<string>)[0];
        let cacheValue;
        /* selectedKeys does not match keyEntities */
        if (isEmpty(keyEntities[selectedKey])) {
            if (includes(selectedKey, 'not-exist-')) {
                /* Get the value behind not-exist- */
                // eslint-disable-next-line prefer-destructuring
                const targetValue = selectedKey.match(/not-exist-(\S*)/)[1];
                // eslint-disable-next-line max-depth
                if (isEmpty(keyEntities[targetValue])) {
                    cacheValue = targetValue;
                } else {
                    /**
                     * 典型的场景是: 假设我们选中了 0-0 这个节点，此时 selectedKeys=Set('0-0')，
                     * 输入框会显示 0-0 的 label。当 treeData 发生更新，假设此时 0-0 在 treeData
                     * 中不存在，则 selectedKeys=Set('not-exist-0-0')，此时输入框显示的是 0-0，
                     * 也就是显示 not-exist- 后的内容。当treeData再次更新，假设此时 0-0 在 treeData
                     * 中存在，则 selectedKeys=Set('0-0')，此时输入框显示 0-0 的 label。 这个地
                     * 方做的操作就是，为了例子中第二次更新后 0-0 label 能够正常显示。
                     */
                    /**
                     * The typical scenario is: suppose we select the 0-0 node, at this time
                     *  selectedKeys=Set('0-0'), the input box will display a 0-0 label. When
                     *  treeData is updated, assuming 0-0 does not exist in treeData at this
                     *  time, then selectedKeys=Set('not-exist-0-0'), at this time the input
                     *  box displays 0-0, which means not-exist -After the content. When treeData
                     *  is updated again, assuming that 0-0 exists in treeData at this time,
                     *  then selectedKeys=Set('0-0'), and the input box displays a label of
                     *  0-0 at this time. The operation done here is for the 0-0 label to be
                     *  displayed normally after the second update in the example.
                     */
                    cacheValue = keyEntities[targetValue].valuePath;
                }
            } else {
                cacheValue = selectedKey;
            }
            /* selectedKeys match keyEntities */
        } else {
        /* selectedKeys match keyEntities */
            cacheValue = keyEntities[selectedKey].valuePath;
        }
        return cacheValue;
    }

    collectOptions(init = false) {
        const { treeData, value, defaultValue } = this.getProps();
        const keyEntities = convertDataToEntities(treeData);
        this._adapter.rePositionDropdown();
        let cacheValue;
        /* when mount */
        if (init) {
            cacheValue = defaultValue;
        } else if (!isEmpty(keyEntities)) {
            cacheValue = this._getCacheValue(keyEntities);
        }

        const selectedValue = !this._isControlledComponent() ? cacheValue : value;
        if (isValid(selectedValue)) {
            this.updateSelectedKey(selectedValue, keyEntities);
        } else {
            this._adapter.updateStates({ keyEntities });
        }
    }

    // call when props.value change
    handleValueChange(value: BasicValue) {
        const { keyEntities } = this.getStates();
        const { multiple } = this.getProps();
        !multiple && this.updateSelectedKey(value, keyEntities);
    }

    /**
     * When single selection, the clear objects of
     * selectedKeys, activeKeys, filteredKeys, input, etc.
     */
    _getClearSelectedKey(filterable: boolean) {
        const updateStates: Partial<BasicCascaderInnerData> = {};
        const { searchPlaceholder, placeholder, multiple } = this.getProps();
        updateStates.selectedKeys = new Set([]);
        updateStates.activeKeys = new Set([]);
        updateStates.filteredKeys = new Set([]);
        if (filterable && !multiple) {
            updateStates.inputPlaceHolder = searchPlaceholder || placeholder || '';
            updateStates.inputValue = '';
        }
        return updateStates;
    }

    updateSelectedKey(value: BasicValue, keyEntities: BasicEntities) {
        const { changeOnSelect, onChangeWithObject, multiple } = this.getProps();
        const {
            activeKeys,
            loadingKeys,
            loading,
            keyEntities: keyEntitieState,
            selectedKeys: selectedKeysState
        } = this.getStates();
        const filterable = this._isFilterable();
        const loadingActive = [...activeKeys].filter(i => loadingKeys.has(i));

        const valuePath = onChangeWithObject ? normalizedArr(value).map(i => i.value) : normalizedArr(value);
        const selectedKeys = findKeysForValues(valuePath, keyEntities);
        let updateStates: Partial<BasicCascaderInnerData> = {};

        if (selectedKeys.length) {
            const selectedKey = selectedKeys[0];
            const selectedItem = keyEntities[selectedKey];
            /**
             * When changeOnSelect is turned on, or the target option is a leaf option,
             * the option is considered to be selected, even if the option is disabled
             */
            if (changeOnSelect || this._isLeaf(selectedItem.data)) {
                updateStates.selectedKeys = new Set([selectedKey]);
                if (!loadingActive.length) {
                    updateStates.activeKeys = new Set(selectedItem.path);
                }
                if (filterable && !multiple) {
                    const displayText = this.renderDisplayText(selectedKey, keyEntities);
                    updateStates.inputPlaceHolder = displayText;
                    updateStates.inputValue = displayText;
                }
            /**
             * If selectedKeys does not meet the update conditions,
             * and state.selectedKeys is the same as selectedKeys
             * at this time, state.selectedKeys should be cleared.
             * A typical scenario is:
             * The originally selected node is the leaf node, but
             * after props.treeData is dynamically updated, the node
             * is a non-leaf node. At this point, selectedKeys should
             * be cleared.
             */
            } else if (isEqual(selectedKeys, Array.from(selectedKeysState))) {
                updateStates = this._getClearSelectedKey(filterable);
            }
        } else if (value && (value as any).length) {
            const val = valuePath[valuePath.length - 1];
            const key = `not-exist-${val}`;
            const optionNotExist = {
                data: {
                    label: val,
                    value: val,
                },
                key,
                path: valuePath,
                _notExist: true,
            };
            updateStates.selectedKeys = new Set([key]);
            if (filterable && !multiple) {
                const displayText = this._defaultRenderText(valuePath);
                updateStates.inputPlaceHolder = displayText;
                updateStates.inputValue = displayText;
            }
            keyEntities[key] = optionNotExist as BasicEntity;
            // Fix: 1155, if the data is loaded asynchronously to update treeData, the emptying operation should not be done when entering the updateSelectedKey method
        } else if (loading) {
            // Use assign to avoid overwriting the'not-exist- * 'property of keyEntities after asynchronous loading
            // Overwriting'not-exist- * 'will cause selectionContent to be emptied unexpectedly when clicking on a dropDown item
            updateStates.keyEntities = assign(keyEntitieState, keyEntities);
            this._adapter.updateStates(updateStates);
            return;
        } else {
            updateStates = this._getClearSelectedKey(filterable);
        }
        updateStates.keyEntities = keyEntities;
        this._adapter.updateStates(updateStates);
    }

    open() {
        const filterable = this._isFilterable();
        this._adapter.openMenu();
        if (filterable) {
            this._clearInput();
        }
        if (this._isControlledComponent()) {
            this.reCalcActiveKeys();
        }
        this._adapter.notifyDropdownVisibleChange(true);
        this._adapter.registerClickOutsideHandler(e => this.close(e));
    }

    reCalcActiveKeys() {
        const { selectedKeys, activeKeys, keyEntities } = this.getStates();
        const selectedKey = [...selectedKeys][0];
        const selectedItem = keyEntities[selectedKey];
        if (!selectedItem) {
            return;
        }
        const newActiveKeys: Set<string> = new Set(selectedItem.path);
        if (!isEqual(newActiveKeys, activeKeys)) {
            this._adapter.updateStates({
                activeKeys: newActiveKeys,
            });
        }
    }

    close(e: any, key?: string) {
        const { multiple } = this.getProps();
        this._adapter.closeMenu();
        this._adapter.notifyDropdownVisibleChange(false);
        this._adapter.unregisterClickOutsideHandler();
        if (this._isFilterable()) {
            const { selectedKeys } = this.getStates();
            let inputValue = '';
            if (key && !multiple) {
                inputValue = this.renderDisplayText(key);
            } else if (selectedKeys.size && !multiple) {
                inputValue = this.renderDisplayText([...selectedKeys][0]);
            }
            this._adapter.updateStates({ inputValue });
        }
        this._notifyBlur(e);
    }

    getMergedMotion = () => {
        const { motion } = this.getProps();
        const { isSearching } = this.getStates();
        if (isSearching) {
            const mergedMotion =
                typeof motion === 'undefined' || motion ?
                    {
                        ...motion,
                        didLeave: (...args: any) => {
                            const didLeave = get(motion, 'didLeave');
                            if (typeof didLeave === 'function') {
                                didLeave(...args);
                            }
                            this._adapter.updateStates({ isSearching: false });
                        },
                    } :
                    false;
            return mergedMotion;
        }
        return motion;
    };

    handleItemClick(e: any, item: BasicEntity | BasicData) {
        const isDisabled = this._isDisabled();
        if (isDisabled) {
            return;
        }
        this.handleSingleSelect(e, item);
        this._adapter.rePositionDropdown();
    }

    handleItemHover(e: any, item: BasicEntity) {
        const isDisabled = this._isDisabled();
        if (isDisabled) {
            return;
        }
        this.handleShowNextByHover(item);
    }

    handleShowNextByHover(item: BasicEntity) {
        const { keyEntities } = this.getStates();
        const { data, key } = item;
        const isLeaf = this._isLeaf(data);
        const activeKeys = keyEntities[key].path;
        this._adapter.updateStates({
            activeKeys: new Set(activeKeys)
        });
        if (!isLeaf) {
            this.notifyIfLoadData(item);
        }
    }

    onItemCheckboxClick(item: BasicEntity | BasicData) {
        const isDisabled = this._isDisabled();
        if (isDisabled) {
            return;
        }
        this._handleMultipleSelect(item);
        this._adapter.rePositionDropdown();
    }

    handleClick(e: any) {
        const isDisabled = this._isDisabled();
        const isFilterable = this._isFilterable();
        const { isOpen } = this.getStates();
        if (isDisabled) {
            return;
        } else if (!isOpen) {
            this.open();
            this._notifyFocus(e);
        } else if (isOpen && !isFilterable) {
            this.close(e);
        }
    }

    toggleHoverState(bool: boolean) {
        this._adapter.toggleHovering(bool);
    }

    _defaultRenderText(path: any[], displayRender?: BasicCascaderProps['displayRender']) {
        const separator = this.getProp('separator');
        if (displayRender && typeof displayRender === 'function') {
            return displayRender(path);
        } else {
            return path.join(separator);
        }
    }

    renderDisplayText(targetKey: string, keyEntities?: BasicEntities) {
        const renderFunc = this.getProp('displayRender');
        const displayProp = this.getProp('displayProp');
        const displayPath = this.getItemPropPath(targetKey, displayProp, keyEntities);
        return this._defaultRenderText(displayPath, renderFunc);
    }

    handleNodeLoad(item: BasicEntity | BasicData) {
        const { data, key } = item;
        const {
            loadedKeys: prevLoadedKeys,
            loadingKeys: prevLoadingKeys
        } = this.getCopyFromState(['loadedKeys', 'loadingKeys']);
        const newLoadedKeys = prevLoadedKeys.add(key);
        const newLoadingKeys = new Set([...prevLoadingKeys]);
        newLoadingKeys.delete(key);

        // onLoad should trigger before internal setState to avoid `loadData` trigger twice.
        this._adapter.notifyOnLoad(newLoadedKeys, data);
        this._adapter.updateStates({
            loadingKeys: newLoadingKeys,
        });
    }

    notifyIfLoadData(item: BasicEntity | BasicData) {
        const { data, key } = item;
        this._adapter.updateStates({ loading: false });
        if (!data.isLeaf && !data.children && this.getProp('loadData')) {
            const { loadedKeys, loadingKeys } = this.getCopyFromState(['loadedKeys', 'loadingKeys']);
            if (loadedKeys.has(key) || loadingKeys.has(key)) {
                return;
            }
            this._adapter.updateStates({ loading: true });
            const { keyEntities } = this.getStates();
            const optionPath = this.getItemPropPath(key, [], keyEntities);
            this._adapter.updateStates({ loadingKeys: loadingKeys.add(key) });
            this._adapter.notifyLoadData(optionPath, this.handleNodeLoad.bind(this, item));
        }
    }

    handleSingleSelect(e: any, item: BasicEntity | BasicData) {
        const { changeOnSelect: allowChange, filterLeafOnly, multiple, enableLeafClick } = this.getProps();
        const { keyEntities, selectedKeys, isSearching } = this.getStates();
        const filterable = this._isFilterable();
        const { data, key } = item;

        const isLeaf = this._isLeaf(data);

        const activeKeys = keyEntities[key].path;
        const selectedKey = [key];
        const hasChanged = key !== [...selectedKeys][0];

        if (!isLeaf && !allowChange && !isSearching) {
            this._adapter.updateStates({ activeKeys: new Set(activeKeys) });
            this.notifyIfLoadData(item);
            return;
        }
        if (multiple) {
            this._adapter.updateStates({ activeKeys: new Set(activeKeys) });
            if (isLeaf && enableLeafClick) {
                this.onItemCheckboxClick(item);
            }
        } else {
            this._adapter.notifySelect(data.value);
            if (hasChanged) {
                this._notifyChange(item);
                this.notifyIfLoadData(item);
                if (this._isControlledComponent()) {
                    this._adapter.updateStates({ activeKeys: new Set(activeKeys) });
                    if (isLeaf) {
                        this.close(e);
                    }
                    return;
                }

                this._adapter.updateStates({
                    activeKeys: new Set(activeKeys),
                    selectedKeys: new Set(selectedKey),
                });

                const displayText = this.renderDisplayText(key);
                if (filterable) {
                    this._adapter.updateInputPlaceHolder(displayText);
                }

                if (isLeaf) {
                    this.close(e, key);
                } else if (!filterLeafOnly && isSearching) {
                    this.close(e, key);
                }
            } else {
                this.close(e);
            }
        }
    }

    _handleMultipleSelect(item: BasicEntity | BasicData) {
        const { key } = item;
        const { checkedKeys, keyEntities, resolvedCheckedKeys } = this.getStates();
        const { autoMergeValue, max, disableStrictly, leafOnly } = this.getProps();
        // prev checked status
        const prevCheckedStatus = checkedKeys.has(key);
        // next checked status
        const curCheckedStatus = disableStrictly ?
            this.calcChekcedStatus(!prevCheckedStatus, key) :
            !prevCheckedStatus;
        // calculate all key of nodes that are checked or half checked
        const {
            checkedKeys: curCheckedKeys,
            halfCheckedKeys: curHalfCheckedKeys
        } = disableStrictly ?
            this.calcNonDisabedCheckedKeys(key, curCheckedStatus) :
            this.calcCheckedKeys(key, curCheckedStatus);

        const mergeType = calcMergeType(autoMergeValue, leafOnly);
        const isLeafOnlyMerge = mergeType === strings.LEAF_ONLY_MERGE_TYPE;
        const isNoneMerge = mergeType === strings.NONE_MERGE_TYPE;

        const curResolvedCheckedKeys = new Set(normalizeKeyList(curCheckedKeys, keyEntities, isLeafOnlyMerge));

        const curRealCheckedKeys = isNoneMerge
            ? curCheckedKeys
            : curResolvedCheckedKeys;

        if (isNumber(max)) {
            if (!isNoneMerge) {
                // When it exceeds max, the quantity is allowed to be reduced, and no further increase is allowed
                if (resolvedCheckedKeys.size < curResolvedCheckedKeys.size && curResolvedCheckedKeys.size > max) {
                    const checkedEntities: BasicEntity[] = [];
                    curResolvedCheckedKeys.forEach(itemKey => {
                        checkedEntities.push(keyEntities[itemKey]);
                    });
                    this._adapter.notifyOnExceed(checkedEntities);
                    return;
                }
            } else {
                // When it exceeds max, the quantity is allowed to be reduced, and no further increase is allowed
                if (checkedKeys.size < curCheckedKeys.size && curCheckedKeys.size > max) {
                    const checkedEntities: BasicEntity[] = [];
                    curCheckedKeys.forEach((itemKey: string) => {
                        checkedEntities.push(keyEntities[itemKey]);
                    });
                    this._adapter.notifyOnExceed(checkedEntities);
                    return;
                }
            }
        }
        if (!this._isControlledComponent()) {
            this._adapter.updateStates({
                checkedKeys: curCheckedKeys,
                halfCheckedKeys: curHalfCheckedKeys,
                resolvedCheckedKeys: curResolvedCheckedKeys
            });
        }

        // The click event during multiple selection will definitely cause the checked state of node to change,
        // so there is no need to judge the value to change.
        this._notifyChange(curRealCheckedKeys);

        if (curCheckedStatus) {
            this._notifySelect(curRealCheckedKeys);
        }

        this._adapter.updateStates({ inputValue: '' });
    }

    calcNonDisabedCheckedKeys(eventKey: string, targetStatus: boolean) {
        const { keyEntities, disabledKeys } = this.getStates();
        const { checkedKeys } = this.getCopyFromState(['checkedKeys']);
        const descendantKeys = normalizeKeyList(findDescendantKeys([eventKey], keyEntities, false), keyEntities, true);
        const hasDisabled = descendantKeys.some(key => disabledKeys.has(key));
        if (!hasDisabled) {
            return this.calcCheckedKeys(eventKey, targetStatus);
        }

        const nonDisabled = descendantKeys.filter(key => !disabledKeys.has(key));
        const newCheckedKeys = targetStatus
            ? [...nonDisabled, ...checkedKeys]
            : difference(normalizeKeyList([...checkedKeys], keyEntities, true), nonDisabled);
        return calcCheckedKeys(newCheckedKeys, keyEntities);
    }

    calcChekcedStatus(targetStatus: boolean, eventKey: string) {
        if (!targetStatus) {
            return targetStatus;
        }
        const { checkedKeys, keyEntities, disabledKeys } = this.getStates();
        const descendantKeys = normalizeKeyList(findDescendantKeys([eventKey], keyEntities, false), keyEntities, true);
        const hasDisabled = descendantKeys.some(key => disabledKeys.has(key));
        if (!hasDisabled) {
            return targetStatus;
        }
        const nonDisabledKeys = descendantKeys.filter(key => !disabledKeys.has(key));
        const allChecked = nonDisabledKeys.every(key => checkedKeys.has(key));
        return !allChecked;
    }

    _notifySelect(keys: Set<string>) {
        const { keyEntities } = this.getStates();
        const values: (string | number)[] = [];
        keys.forEach(key => {
            if (!isEmpty(keyEntities) && !isEmpty(keyEntities[key])) {
                const valueItem = keyEntities[key].data.value;
                values.push(valueItem);
            }
        });
        const formatValue: number | string | Array<string | number> = values.length === 1 ?
            values[0] :
            values;
        this._adapter.notifySelect(formatValue);
    }

    /**
     * calculate all key of nodes that are checked or half checked
     * @param {string} key key of node
     * @param {boolean} curCheckedStatus checked status of node
     */
    calcCheckedKeys(key: string, curCheckedStatus: boolean) {
        const { keyEntities } = this.getStates();
        const { checkedKeys, halfCheckedKeys } = this.getCopyFromState(['checkedKeys', 'halfCheckedKeys']);
        return curCheckedStatus ?
            calcCheckedKeysForChecked(key, keyEntities, checkedKeys, halfCheckedKeys) :
            calcCheckedKeysForUnchecked(key, keyEntities, checkedKeys, halfCheckedKeys);
    }

    handleInputChange(sugInput: string) {
        this._adapter.updateInputValue(sugInput);
        const { keyEntities } = this.getStates();
        const { treeNodeFilterProp, filterTreeNode, filterLeafOnly } = this.getProps();
        let filteredKeys: string[] = [];
        if (sugInput) {
            filteredKeys = (Object.values(keyEntities) as BasicEntity[])
                .filter(item => {
                    const { key, _notExist } = item;
                    if (_notExist) {
                        return false;
                    }
                    const filteredPath = this.getItemPropPath(key, treeNodeFilterProp).join();
                    return filter(sugInput, filteredPath, filterTreeNode, false);
                })
                .filter(
                    item => (filterTreeNode && !filterLeafOnly) ||
                    this._isLeaf(item as unknown as BasicCascaderData)
                )
                .map(item => item.key);
        }

        this._adapter.updateStates({
            isSearching: Boolean(sugInput),
            filteredKeys: new Set(filteredKeys),
        });
        this._adapter.notifyOnSearch(sugInput);
    }

    handleClear() {
        const { isSearching } = this.getStates();
        const { searchPlaceholder, placeholder, multiple } = this.getProps();
        const isFilterable = this._isFilterable();
        const isControlled = this._isControlledComponent();
        const newState: Partial<BasicCascaderInnerData> = {};
        if (multiple) {
            this._adapter.updateInputValue('');
            this._adapter.notifyOnSearch('');
            newState.checkedKeys = new Set([]);
            newState.halfCheckedKeys = new Set([]);
            newState.selectedKeys = new Set([]);
            newState.activeKeys = new Set([]);
            newState.resolvedCheckedKeys = new Set([]);
            this._adapter.notifyChange([]);
        } else {
            // if click clearBtn when not searching, clear selected and active values as well
            if (isFilterable && isSearching) {
                newState.isSearching = false;
                this._adapter.updateInputValue('');
                this._adapter.notifyOnSearch('');
            } else {
                if (isFilterable) {
                    newState.inputValue = '';
                    newState.inputPlaceHolder = searchPlaceholder || placeholder || '';
                    this._adapter.updateInputValue('');
                    this._adapter.notifyOnSearch('');
                }
                if (!isControlled) {
                    newState.selectedKeys = new Set([]);
                }
                newState.activeKeys = new Set([]);
                newState.filteredKeys = new Set([]);
                this._adapter.notifyChange([]);
            }
        }

        this._adapter.updateStates(newState);
        this._adapter.notifyClear();
        this._adapter.rePositionDropdown();
    }

    getRenderData() {
        const { keyEntities, isSearching } = this.getStates();
        const isFilterable = this._isFilterable();
        if (isSearching && isFilterable) {
            return this.getFilteredData();
        }
        return (Object.values(keyEntities) as BasicEntity[])
            .filter(item => item.parentKey === null && !item._notExist)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .sort((a, b) => parseInt(a.ind, 10) - parseInt(b.ind, 10));
    }

    getFilteredData() {
        const { treeNodeFilterProp } = this.getProps();
        const { filteredKeys, keyEntities } = this.getStates();
        const filteredList: BasicData[] = [];
        const filteredKeyArr = [...filteredKeys];
        filteredKeyArr.forEach(key => {
            const item = keyEntities[key];
            if (!item) {
                return;
            }
            const itemSearchPath = this.getItemPropPath(key, treeNodeFilterProp);
            const isDisabled = this._isOptionDisabled(key, keyEntities);
            filteredList.push({
                data: item.data,
                key,
                disabled: isDisabled,
                searchText: itemSearchPath
            });
        });
        return filteredList;
    }

    handleListScroll(e: any, ind: number) {
        const { activeKeys, keyEntities } = this.getStates();
        const lastActiveKey = [...activeKeys][activeKeys.size - 1];
        const data = lastActiveKey ? get(keyEntities, [lastActiveKey, 'data'], null) : null;
        this._adapter.notifyListScroll(e, { panelIndex: ind, activeNode: data });
    }

    handleTagRemove(e: any, tagValuePath: string[]) {
        const { keyEntities } = this.getStates();
        const { disabled } = this.getProps();
        if (disabled) {
            return;
        }
        const removedItem = (Object.values(keyEntities) as BasicEntity[])
            .filter(item => isEqual(item.valuePath, tagValuePath))[0];
        !isEmpty(removedItem) &&
        !removedItem.data.disabled &&
        this._handleMultipleSelect(removedItem);
    }
}
