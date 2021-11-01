import { isNumber, isFunction, get, isUndefined, isString, cloneDeep, isEmpty, difference } from 'lodash-es';
import { strings } from '../treeSelect/constants';
import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import {
    flattenTreeData,
    findDescendantKeys,
    findAncestorKeys,
    filter,
    normalizedArr,
    normalizeKeyList,
    getMotionKeys,
    calcCheckedKeysForChecked,
    calcCheckedKeys,
    calcCheckedKeysForUnchecked,
    getValueOrKey
} from '../tree/treeUtil';
import {
    BasicTreeInnerData,
    BasicTreeProps,
    BasicTreeNodeData,
    BasicTreeNodeProps,
    BasicKeyEntity,
    BasicExpandedOtherProps
} from '../tree/foundation';
import { Motion } from '../utils/type';

/* Here ValidateStatus is the same as ValidateStatus in baseComponent */
export type ValidateStatus = 'error' | 'warning' | 'default';

export type Size = 'small' | 'large' | 'default';

export interface BasicRenderSelectedItem {
    (treeNode: BasicTreeNodeData): any;
    (treeNode: BasicTreeNodeData, otherProps: { index: number | string; onClose: (tagContent: any, e: any) => void }):
    {
        isRenderInTag: boolean;
        content: any;
    };
}

export interface BasicTriggerRenderProps {
    [x: string]: any;
    componentProps: BasicTreeSelectProps;
    disabled: boolean;
    inputValue: string;
    placeholder: string;
    value: BasicTreeNodeData[];
    onClear: (e: any) => void;
}

export type BasicOnChangeWithObject = (node: BasicTreeNodeData[] | BasicTreeNodeData, e: any) => void;
export type BasicOnChangeWithBasic = (
    value: BasicTreeNodeData['value'],
    node: BasicTreeNodeData[] | BasicTreeNodeData,
    e: any
) => void;

export interface BasicOnChange {
    (node: BasicTreeNodeData[] | BasicTreeNodeData, e: any): void;
    (
        value: BasicTreeNodeData['value'] | Array<BasicTreeNodeData['value']>,
        node: BasicTreeNodeData[] | BasicTreeNodeData,
        e: any
    ): void;
}

export interface BasicTreeSelectProps extends Pick<BasicTreeProps,
'virtualize'
| 'renderFullLabel'
| 'renderLabel'
| 'autoExpandParent'
| 'className'
| 'defaultExpandAll'
| 'defaultExpandedKeys'
| 'defaultValue'
| 'disabled'
| 'emptyContent'
| 'expandAction'
| 'expandedKeys'
| 'filterTreeNode'
| 'labelEllipsis'
| 'leafOnly'
| 'multiple'
| 'onChangeWithObject'
| 'showClear'
| 'showFilteredOnly'
| 'style'
| 'treeData'
| 'treeNodeFilterProp'
| 'value'
| 'onExpand'
| 'onSearch'
| 'expandAll'
| 'disableStrictly'
> {
    motion?: Motion;
    mouseEnterDelay?: number;
    mouseLeaveDelay?: number;
    arrowIcon?: any;
    autoAdjustOverflow?: boolean;
    clickToHide?: boolean;
    defaultOpen?: boolean;
    dropdownClassName?: string;
    dropdownMatchSelectWidth?: boolean;
    dropdownStyle?: any;
    insetLabel?: any;
    maxTagCount?: number;
    motionExpand?: boolean;
    optionListStyle?: any;
    outerBottomSlot?: any;
    outerTopSlot?: any;
    placeholder?: string;
    prefix?: any;
    searchAutoFocus?: boolean;
    searchPlaceholder?: string;
    showSearchClear?: boolean;
    size?: Size;
    suffix?: any;
    treeNodeLabelProp?: string;
    validateStatus?: ValidateStatus;
    zIndex?: number;
    searchPosition?: string;
    stopPropagation?: boolean | string;
    loadedKeys?: string[];
    loadData?: (data: BasicTreeNodeData) => Promise<void>;
    onSelect?: (selectedKeys: string, selected: boolean, selectedNode: BasicTreeNodeData) => void;
    searchRender?: (inputProps: any) => any;
    renderSelectedItem?: BasicRenderSelectedItem;
    getPopupContainer?: () => HTMLElement;
    triggerRender?: (props: BasicTriggerRenderProps) => any;
    onBlur?: (e: any) => void;
    onChange?: BasicOnChange;
    onFocus?: (e: any) => void;
    onVisibleChange?: (isVisible: boolean) => void;
    onLoad?: (keys: Set<string>, data: BasicTreeNodeData) => void;
}

export interface BasicTreeSelectInnerData extends Pick<BasicTreeInnerData,
'keyEntities'
| 'treeData'
| 'flattenNodes'
| 'selectedKeys'
| 'checkedKeys'
| 'halfCheckedKeys'
| 'motionKeys'
| 'motionType'
| 'expandedKeys'
| 'filteredKeys'
| 'filteredExpandedKeys'
| 'filteredShownKeys'
| 'cachedKeyValuePairs'
| 'inputValue'
| 'disabledKeys'
| 'loadedKeys'
| 'loadingKeys'
> {
    inputTriggerFocus: boolean;
    isOpen: boolean;
    isInput: boolean;
    rePosKey: number;
    dropdownMinWidth: null | number;
    isHovering: boolean;
    prevProps: BasicTreeSelectProps;
}

export interface TreeSelectAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    updateInputValue: (value: string) => void;
    registerClickOutsideHandler: (cb: (e: any) => void) => void;
    unregisterClickOutsideHandler: () => void;
    rePositionDropdown: () => void;
    updateState: (states: Pick<S, keyof S>) => void;
    notifySelect: (selectedKeys: string, selected: boolean, selectedNode: BasicTreeNodeData) => void;
    notifySearch: (input: string) => void;
    cacheFlattenNodes: (bool: boolean) => void;
    openMenu: () => void;
    closeMenu: (cb?: () => void) => void;
    getTriggerWidth: () => boolean | number;
    setOptionWrapperWidth: (width: null | number) => void;
    notifyChange: BasicOnChangeWithBasic;
    notifyChangeWithObject: BasicOnChangeWithObject;
    notifyExpand: (expandedKeys: Set<string>, expanedOtherProps: BasicExpandedOtherProps) => void;
    notifyFocus: (e: any) => void;
    notifyBlur: (e: any) => void;
    toggleHovering: (bool: boolean) => void;
    notifyLoad: (newLoadedKeys: Set<string>, data: BasicTreeNodeData) => void;
    updateInputFocus: (bool: boolean) => void;
    updateLoadKeys: (data: BasicTreeNodeData, resolve: (value?: any) => void) => void;
}

// eslint-disable-next-line max-len
export default class TreeSelectFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<TreeSelectAdapter<P, S>, P, S> {

    constructor(adapter: TreeSelectAdapter<P, S>) {
        super({ ...adapter });
    }

    init() {
        const { searchAutoFocus, searchPosition, filterTreeNode } = this.getProps();
        const triggerSearch = searchPosition === strings.SEARCH_POSITION_TRIGGER && filterTreeNode;
        const triggerSearchAutoFocus = searchAutoFocus && triggerSearch;
        this._setDropdownWidth();
        const isOpen = (this.getProp('defaultOpen') || triggerSearchAutoFocus) && !this._isDisabled();
        if (isOpen) {
            this.open();
        }
    }

    destroy() {
        // Ensure that event monitoring will be uninstalled, and the user may not trigger closePanel
        this._adapter.unregisterClickOutsideHandler();
    }

    _setDropdownWidth() {
        const { style, dropdownMatchSelectWidth } = this.getProps();
        let width;
        if (dropdownMatchSelectWidth) {
            if (style && isNumber(style.width)) {
                width = style.width;
            } else if (style && isString(style.width) && !style.width.includes('%')) {
                width = style.width;
            } else {
                width = this._adapter.getTriggerWidth();
            }
            this._adapter.setOptionWrapperWidth(width);
        }
    }

    _isMultiple() {
        return this.getProp('multiple');
    }

    _isAnimated() {
        return this.getProp('motionExpand');
    }

    _isDisabled(treeNode = {} as BasicTreeNodeProps) {
        return this.getProp('disabled') || treeNode.disabled;
    }

    _isExpandControlled() {
        return this.getProp('expandedKeys');
    }

    _isSelectToClose() {
        return !this.getProp('expandAction');
    }

    _isLoadControlled() {
        return this.getProp('loadedKeys');
    }

    _showFilteredOnly() {
        const { inputValue } = this.getStates();
        const { showFilteredOnly } = this.getProps();
        return Boolean(inputValue) && showFilteredOnly;
    }

    getCopyFromState(items: string | string[]) {
        const res = {};
        normalizedArr(items).forEach(key => {
            res[key] = cloneDeep(this.getState(key));
        });
        return res as BasicTreeInnerData;
    }

    getTreeNodeProps(key: string) {
        const {
            expandedKeys = new Set([]),
            selectedKeys = [],
            checkedKeys = new Set([]),
            halfCheckedKeys = new Set([]),
            keyEntities = {},
            filteredKeys = new Set([]),
            inputValue = '',
            loadedKeys,
            loadingKeys,
            filteredExpandedKeys = new Set([]),
            disabledKeys = new Set([]),
        } = this.getStates();
        const { treeNodeFilterProp } = this.getProps();
        const entity = keyEntities[key];
        const notExist = !entity;
        if (notExist) {
            return null;
        }
        const isSearching = Boolean(inputValue);
        const treeNodeProps: BasicTreeNodeProps = {
            eventKey: key,
            expanded: isSearching ? filteredExpandedKeys.has(key) : expandedKeys.has(key),
            selected: selectedKeys.includes(key),
            checked: checkedKeys.has(key),
            halfChecked: halfCheckedKeys.has(key),
            pos: String(entity ? entity.pos : ''),
            level: entity.level,
            filtered: filteredKeys.has(key),
            keyword: inputValue,
            treeNodeFilterProp,
            loading: loadingKeys.has(key) && !loadedKeys.has(key),
            loaded: loadedKeys.has(key),
        };

        if (this.getProp('disableStrictly') && disabledKeys.has(key)) {
            treeNodeProps.disabled = true;
        }

        return treeNodeProps;
    }

    handleNodeLoad(loadedKeys: Set<string>, loadingKeys: Set<string>, data: BasicTreeNodeData, resolve: (value?: any) => void) {
        const { loadData } = this.getProps();
        const { key } = data;
        if (!loadData || loadedKeys.has(key) || loadingKeys.has(key)) {
            return {};
        }
        loadData(data).then(() => {
            const {
                loadedKeys: prevLoadedKeys,
                loadingKeys: prevLoadingKeys
            } = this.getCopyFromState(['loadedKeys', 'loadingKeys']);
            const newLoadedKeys: Set<string> = prevLoadedKeys.add(key);
            const newLoadingKeys: Set<string> = new Set([...prevLoadingKeys]);
            newLoadingKeys.delete(key);
            this._adapter.notifyLoad(newLoadedKeys, data);
            if (!this._isLoadControlled()) {
                this._adapter.updateState({
                    loadedKeys: newLoadedKeys,
                } as any);
            }
            this._adapter.setState({
                loadingKeys: newLoadingKeys,
            } as any);
            resolve();
        });
        return {
            loadingKeys: loadingKeys.add(key),
        };
    }

    focusInput(bool: boolean) {
        this._adapter.updateInputFocus(bool);
    }

    _notifyMultipleChange(key: string[], e: any) {
        const { keyEntities } = this.getStates();
        const { leafOnly } = this.getProps();
        const keyList = normalizeKeyList(key, keyEntities, leafOnly);
        const nodes = keyList.map(i => keyEntities[i].data);
        if (this.getProp('onChangeWithObject')) {
            this._adapter.notifyChangeWithObject(nodes, e);
        } else {
            const value = getValueOrKey(nodes);
            this._adapter.notifyChange(value, nodes, e);
        }
    }

    _notifyChange(key: any, e: any) {
        const { keyEntities } = this.getStates();
        if (this._isMultiple() && Array.isArray(key)) {
            this._notifyMultipleChange(key, e);
        } else {
            const nodes = isUndefined(key) ? key : keyEntities[key].data;
            const value = isUndefined(key) ? key : getValueOrKey(nodes);
            if (this.getProp('onChangeWithObject')) {
                this._adapter.notifyChangeWithObject(nodes, e);
            } else {
                this._adapter.notifyChange(value, nodes, e);
            }
        }
    }

    // Scenes that may trigger focus:
    //  1、click selection
    _notifyFocus(e: any) {
        this._adapter.notifyFocus(e);
    }

    // Scenes that may trigger blur
    //  1、clickOutSide
    //  2、click option / press enter, and then select complete（when multiple is false
    //  3、press esc when dropdown list open
    _notifyBlur(e: any) {
        this._adapter.notifyBlur(e);
    }

    toggleHoverState(bool: boolean) {
        this._adapter.toggleHovering(bool);
    }

    open() {
        this._adapter.openMenu();
        this._setDropdownWidth();
        this._adapter.registerClickOutsideHandler(e => {
            this.close(e);
        });
    }

    close(e: any) {
        this._adapter.closeMenu();
        this._adapter.unregisterClickOutsideHandler();
        this._notifyBlur(e);
        if (this.getProp('motionExpand')) {
            this._adapter.updateState({ motionKeys: new Set([]) } as any);
        }
    }

    handleClick(e: any) {
        const isDisabled = this._isDisabled();
        const { isOpen } = this.getStates();
        if (isDisabled) {
            return;
        } else if (!isOpen) {
            this.open();
            this._notifyFocus(e);
        } else if (isOpen) {
            this.close(e);
        }
    }

    handleClear(e: any) {
        const { searchPosition, filterTreeNode } = this.getProps();
        const { inputValue, selectedKeys } = this.getStates();
        const isMultiple = this._isMultiple();
        const isControlled = this._isControlledComponent();
        const value: string | string[] | undefined = isMultiple ? [] : undefined;
        this._notifyChange(value, e);
        if (!isControlled) {
            // reposition dropdown when selected values change
            this._adapter.rePositionDropdown();
            this._adapter.updateState({
                selectedKeys: [],
                checkedKeys: new Set(),
                halfCheckedKeys: new Set(),
            } as any);
        }
        // When triggerSearch, clicking the clear button will trigger to clear Input
        if (filterTreeNode && searchPosition === strings.SEARCH_POSITION_TRIGGER) {
            if (inputValue !== '') {
                if (isEmpty(selectedKeys)) {
                    this.handleInputChange('');
                } else {
                    this.clearInput();
                }
            }
        }
    }

    removeTag(eventKey: BasicTreeNodeData['key']) {
        const { disableStrictly } = this.getProps();
        const { keyEntities, disabledKeys } = this.getStates();
        const item = keyEntities[eventKey].data;
        if (item.disabled || (disableStrictly && disabledKeys.has(eventKey))) {
            return;
        }
        const { checkedKeys, halfCheckedKeys } = this.calcCheckedKeys(eventKey, false);
        this._notifyChange([...checkedKeys], null);
        if (!this._isControlledComponent()) {
            this._adapter.updateState({ checkedKeys, halfCheckedKeys } as any);
            this._adapter.rePositionDropdown();
        }
        this._adapter.notifySelect(eventKey, false, item);

        // reposition dropdown when selected values change
        this._adapter.rePositionDropdown();
    }

    clearInput() {
        const { expandedKeys, selectedKeys, keyEntities, treeData } = this.getStates();
        const expandedOptsKeys = findAncestorKeys(selectedKeys, keyEntities);
        expandedOptsKeys.forEach(item => expandedKeys.add(item));
        const flattenNodes = flattenTreeData(treeData, expandedKeys);

        this._adapter.updateState({
            expandedKeys,
            flattenNodes,
            inputValue: '',
            motionKeys: new Set([]),
            filteredKeys: new Set([]),
            filteredExpandedKeys: new Set(expandedOptsKeys),
            filteredShownKeys: new Set([])
        } as any);
    }

    handleInputChange(sugInput: string) {
        // Input is used as controlled component
        this._adapter.updateInputValue(sugInput);
        const { expandedKeys, selectedKeys, keyEntities, treeData } = this.getStates();
        const { showFilteredOnly, filterTreeNode, treeNodeFilterProp } = this.getProps();
        let filteredOptsKeys: string[] = [];
        let expandedOptsKeys = [];
        let flattenNodes = [];
        let filteredShownKeys = new Set([]);
        if (!sugInput) {
            expandedOptsKeys = findAncestorKeys(selectedKeys, keyEntities);
            expandedOptsKeys.forEach(item => expandedKeys.add(item));
            flattenNodes = flattenTreeData(treeData, expandedKeys);
        } else {
            filteredOptsKeys = Object.values(keyEntities)
                .filter((item: BasicKeyEntity) => {
                    const { data } = item;
                    return filter(sugInput, data, filterTreeNode, treeNodeFilterProp);
                })
                .map((item: BasicKeyEntity) => item.key);
            expandedOptsKeys = findAncestorKeys(filteredOptsKeys, keyEntities, false);
            const shownChildKeys = findDescendantKeys(filteredOptsKeys, keyEntities, true);
            filteredShownKeys = new Set([...shownChildKeys, ...expandedOptsKeys]);
            flattenNodes = flattenTreeData(treeData, new Set(expandedOptsKeys), showFilteredOnly && filteredShownKeys);
        }
        this._adapter.notifySearch(sugInput);
        this._adapter.updateState({
            expandedKeys,
            flattenNodes,
            motionKeys: new Set([]),
            filteredKeys: new Set(filteredOptsKeys),
            filteredExpandedKeys: new Set(expandedOptsKeys),
            filteredShownKeys,
        } as any);
    }

    handleNodeSelect(e: any, treeNode: BasicTreeNodeProps) {
        const isDisabled = this._isDisabled(treeNode);
        if (isDisabled) {
            return;
        }
        if (!this._isMultiple()) {
            this.handleSingleSelect(e, treeNode);
        } else {
            this.handleMultipleSelect(e, treeNode);
        }
    }

    handleSingleSelect(e: any, treeNode: BasicTreeNodeProps) {
        let { selectedKeys } = this.getCopyFromState('selectedKeys');
        const { clickToHide } = this.getProps();
        const { selected, eventKey, data } = treeNode;
        this._adapter.notifySelect(eventKey, true, data);

        if (!selectedKeys.includes(eventKey) && !selected) {
            selectedKeys = [eventKey];
            this._notifyChange(eventKey, e);
            if (!this._isControlledComponent()) {
                this._adapter.updateState({ selectedKeys } as any);
            }
        }
        if (clickToHide && (this._isSelectToClose() || !data.children)) {
            this.close(e);
        }
    }

    calcCheckedKeys(eventKey: BasicTreeNodeProps['eventKey'], targetStatus: boolean) {
        const { keyEntities } = this.getStates();
        const {
            checkedKeys,
            halfCheckedKeys
        } = this.getCopyFromState(['checkedKeys', 'halfCheckedKeys']);
        if (targetStatus) {
            return calcCheckedKeysForChecked(eventKey, keyEntities, checkedKeys, halfCheckedKeys);
        } else {
            return calcCheckedKeysForUnchecked(eventKey, keyEntities, checkedKeys, halfCheckedKeys);
        }
    }

    handleMultipleSelect(e: any, treeNode: BasicTreeNodeProps) {
        const { searchPosition, disableStrictly } = this.getProps();
        const { inputValue } = this.getStates();
        const { checked, eventKey, data } = treeNode;
        const targetStatus = disableStrictly ?
            this.calcChekcedStatus(!checked, eventKey) :
            !checked;

        const { checkedKeys, halfCheckedKeys } = disableStrictly ?
            this.calcNonDisabedCheckedKeys(eventKey, targetStatus) :
            this.calcCheckedKeys(eventKey, targetStatus);
        this._adapter.notifySelect(eventKey, targetStatus, data);
        this._notifyChange([...checkedKeys], e);
        if (searchPosition === strings.SEARCH_POSITION_TRIGGER && inputValue !== '') {
            this._adapter.updateState({ inputValue: '' } as any);
        }
        if (!this._isControlledComponent()) {
            this._adapter.updateState({ checkedKeys, halfCheckedKeys } as any);
            this._adapter.rePositionDropdown();
        }
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
        const newCheckedKeys = targetStatus ?
            [...nonDisabled, ...checkedKeys] :
            difference(normalizeKeyList([...checkedKeys], keyEntities, true), nonDisabled);
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
    handleNodeExpandInSearch(e: any, treeNode: BasicTreeNodeProps) {
        const { treeData, filteredShownKeys, keyEntities } = this.getStates();
        const showFilteredOnly = this._showFilteredOnly();
        // clone otherwise will be modified unexpectedly
        const { filteredExpandedKeys } = this.getCopyFromState('filteredExpandedKeys');
        let motionType = 'show';
        const { eventKey, expanded, data } = treeNode;

        if (!expanded) {
            filteredExpandedKeys.add(eventKey);
        } else if (filteredExpandedKeys.has(eventKey)) {
            filteredExpandedKeys.delete(eventKey);
            motionType = 'hide';
        }

        // cache prev flattenNodes, otherwise the calculation will remove hidden items
        this._adapter.cacheFlattenNodes(motionType === 'hide' && this._isAnimated());

        if (!this._isExpandControlled()) {
            const flattenNodes = flattenTreeData(treeData, filteredExpandedKeys, showFilteredOnly && filteredShownKeys);
            const motionKeys = this._isAnimated() ? getMotionKeys(eventKey, filteredExpandedKeys, keyEntities) : [];
            const newState = {
                filteredExpandedKeys,
                flattenNodes,
                motionKeys: new Set(motionKeys),
                motionType,
            };

            this._adapter.updateState(newState as any);
        }

        this._adapter.notifyExpand(filteredExpandedKeys, {
            expanded: !expanded,
            node: data,
        });
    }

    handleNodeExpand(e: any, treeNode: BasicTreeNodeProps) {
        const { loadData } = this.getProps();
        const { inputValue, keyEntities } = this.getStates();
        const isSearching = Boolean(inputValue);
        if (!loadData && (!treeNode.children || !treeNode.children.length)) {
            return;
        }

        if (isSearching) {
            this.handleNodeExpandInSearch(e, treeNode);
            return;
        }

        const { treeData } = this.getStates();
        // clone otherwise will be modified unexpectedly
        const { expandedKeys } = this.getCopyFromState('expandedKeys');
        let motionType = 'show';
        const { eventKey, expanded, data } = treeNode;
        if (!expanded) {
            expandedKeys.add(eventKey);
        } else if (expandedKeys.has(eventKey)) {
            expandedKeys.delete(eventKey);
            motionType = 'hide';
        }
        this._adapter.cacheFlattenNodes(motionType === 'hide' && this._isAnimated());

        if (!this._isExpandControlled()) {
            const flattenNodes = flattenTreeData(treeData, expandedKeys);
            const motionKeys = this._isAnimated() ? getMotionKeys(eventKey, expandedKeys, keyEntities) : [];
            const newState = {
                expandedKeys,
                flattenNodes,
                motionKeys: new Set(motionKeys),
                motionType,
            };
            this._adapter.updateState(newState as any);
        }

        this._adapter.notifyExpand(expandedKeys, {
            expanded: !expanded,
            node: data,
        });
    }

    /**
     * The selected items that need to be displayed in the search box when obtaining a single selection
     */
    getRenderTextInSingle() {
        const { renderSelectedItem: propRenderSelectedItem, treeNodeLabelProp } = this.getProps();
        const { selectedKeys, keyEntities } = this.getStates();
        const renderSelectedItem = isFunction(propRenderSelectedItem) ?
            propRenderSelectedItem :
            (item: BasicTreeNodeData) => get(item, treeNodeLabelProp, null);
        const item = selectedKeys.length && keyEntities[selectedKeys[0]] ?
            keyEntities[selectedKeys[0]].data :
            undefined;
        const renderText = item && treeNodeLabelProp in item ? renderSelectedItem(item) : null;
        return renderText;
    }

    /**
     * When the search box is on the trigger, the blur event handling method
     */
    handleInputTriggerBlur() {
        this._adapter.updateState({
            inputTriggerFocus: false
        } as any);
    }

    /**
     * When the search box is on the trigger, the focus event processing method
     */
    handleInputTriggerFocus() {
        this.clearInput();
        this._adapter.updateState({
            inputTriggerFocus: true
        } as any);
    }

    setLoadKeys(data: BasicTreeNodeData, resolve: (value?: any) => void) {
        this._adapter.updateLoadKeys(data, resolve);
    }
}
