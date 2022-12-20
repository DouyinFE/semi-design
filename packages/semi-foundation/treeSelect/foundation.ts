import { isNumber, isFunction, get, isUndefined, isString, cloneDeep, isEmpty, difference } from 'lodash';
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
import isEnterPress from '../utils/isEnterPress';

/* Here ValidateStatus is the same as ValidateStatus in baseComponent */
export type ValidateStatus = 'error' | 'warning' | 'default';

export type Size = 'small' | 'large' | 'default';

export type BasicRenderSelectedItemInMultiple = (
    treeNode: BasicTreeNodeData,
    otherProps: { index: number | string; onClose: (tagContent: any, e: any) => void }
) => {
    isRenderInTag: boolean;
    content: any
};
export type BasicRenderSelectedItemInSingle = (treeNode: BasicTreeNodeData) => any;
export type BasicRenderSelectedItem = BasicRenderSelectedItemInSingle | BasicRenderSelectedItemInMultiple;

export interface BasicTriggerRenderProps {
    [x: string]: any;
    componentProps: BasicTreeSelectProps;
    disabled: boolean;
    inputValue: string;
    placeholder: string;
    value: BasicTreeNodeData[];
    onClear: (e: any) => void
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
    ): void
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
| 'expandAll'
| 'disableStrictly'
| 'aria-label'
| 'checkRelation'
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
    showRestTagsPopover?: boolean;
    restTagsPopoverProps?: any;
    loadData?: (data: BasicTreeNodeData) => Promise<void>;
    onSelect?: (selectedKeys: string, selected: boolean, selectedNode: BasicTreeNodeData) => void;
    searchRender?: (inputProps: any) => any;
    renderSelectedItem?: BasicRenderSelectedItem;
    getPopupContainer?: () => HTMLElement;
    // triggerRender?: (props: BasicTriggerRenderProps) => any;
    onBlur?: (e: any) => void;
    onSearch?: (sunInput: string, filteredExpandedKeys: string[]) => void;
    onChange?: BasicOnChange;
    onFocus?: (e: any) => void;
    onVisibleChange?: (isVisible: boolean) => void;
    onLoad?: (keys: Set<string>, data: BasicTreeNodeData) => void
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
| 'realCheckedKeys'
> {
    inputTriggerFocus: boolean;
    isOpen: boolean;
    isInput: boolean;
    rePosKey: number;
    dropdownMinWidth: null | number;
    isHovering: boolean;
    prevProps: BasicTreeSelectProps
}

export interface TreeSelectAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    updateInputValue: (value: string) => void;
    registerClickOutsideHandler: (cb: (e: any) => void) => void;
    unregisterClickOutsideHandler: () => void;
    rePositionDropdown: () => void;
    updateState: (states: Partial<BasicTreeSelectInnerData>) => void;
    notifySelect: (selectedKeys: string, selected: boolean, selectedNode: BasicTreeNodeData) => void;
    notifySearch: (input: string, filteredExpandedKeys: string[]) => void;
    cacheFlattenNodes: (bool: boolean) => void;
    openMenu: () => void;
    closeMenu: (cb?: () => void) => void;
    getTriggerWidth: () => boolean | number;
    setOptionWrapperWidth: (width: null | number) => void;
    notifyChange: BasicOnChangeWithBasic;
    notifyChangeWithObject: BasicOnChangeWithObject;
    notifyExpand: (expandedKeys: Set<string>, expandedOtherProps: BasicExpandedOtherProps) => void;
    notifyFocus: (e: any) => void;
    notifyBlur: (e: any) => void;
    toggleHovering: (bool: boolean) => void;
    notifyLoad: (newLoadedKeys: Set<string>, data: BasicTreeNodeData) => void;
    updateInputFocus: (bool: boolean) => void;
    updateLoadKeys: (data: BasicTreeNodeData, resolve: (value?: any) => void) => void
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

    findDataForValue(findValue: string) {
        const { value, defaultValue } = this.getProps();
        let valueArr = [];
        if (value) {
            valueArr = Array.isArray(value) ? value : [value];
        } else if (defaultValue) {
            valueArr = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
        }
        return valueArr.find(item => {
            return item.value === findValue || item.key === findValue;
        });
    }

    constructDataForValue(value: string) {
        const { treeNodeLabelProp } = this.getProps();
        return {
            key: value,
            [treeNodeLabelProp]: value
        };    
    }

    getDataForKeyNotInKeyEntities(value: string) {
        const { onChangeWithObject } = this.getProps();
        if (onChangeWithObject) {
            return this.findDataForValue(value);
        } else {
            return this.constructDataForValue(value);
        }
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
            realCheckedKeys = new Set([]),
            keyEntities = {},
            filteredKeys = new Set([]),
            inputValue = '',
            loadedKeys,
            loadingKeys,
            filteredExpandedKeys = new Set([]),
            disabledKeys = new Set([]),
        } = this.getStates();
        const { treeNodeFilterProp, checkRelation } = this.getProps();
        const entity = keyEntities[key];
        const notExist = !entity;
        if (notExist) {
            return null;
        }
        // if checkRelation is invalid, the checked status of node will be false
        let realChecked = false;
        let realHalfChecked = false;
        if (checkRelation === 'related') {
            realChecked = checkedKeys.has(key);
            realHalfChecked = halfCheckedKeys.has(key);
        } else if (checkRelation === 'unRelated') {
            realChecked = realCheckedKeys.has(key);
            realHalfChecked = false;
        }
        const isSearching = Boolean(inputValue);
        const treeNodeProps: BasicTreeNodeProps = {
            eventKey: key,
            expanded: isSearching && !this._isExpandControlled()
                ? filteredExpandedKeys.has(key)
                : expandedKeys.has(key),
            selected: selectedKeys.includes(key),
            checked: realChecked,
            halfChecked: realHalfChecked,
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
                });
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

    /* istanbul ignore next */
    focusInput(bool: boolean) {
        this._adapter.updateInputFocus(bool);
    }

    _notifyMultipleChange(key: string[], e: any) {
        const { keyEntities } = this.getStates();
        const { leafOnly, checkRelation } = this.getProps();
        let keyList = [];
        if (checkRelation === 'related') {
            keyList = normalizeKeyList(key, keyEntities, leafOnly, true);
        } else if (checkRelation === 'unRelated') {
            keyList = key as string[];
        }
        const nodes = keyList.map(key => (keyEntities[key] && keyEntities[key].data.key === key) ? keyEntities[key].data : this.getDataForKeyNotInKeyEntities(key));
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
            this._adapter.updateState({ motionKeys: new Set([]) });
        }
    }

    handleClick(e: any) {
        const isDisabled = this._isDisabled();
        const { isOpen, inputValue } = this.getStates();
        const { searchPosition } = this.getProps();
        if (isDisabled) {
            return;
        } else if (!isOpen) {
            this.open();
            this._notifyFocus(e);
        } else if (isOpen) {
            if (searchPosition === 'trigger' && inputValue) {
                return;
            }
            this.close(e);
        }
    }

    /**
     * A11y: simulate selection click
     */
    /* istanbul ignore next */
    handleSelectionEnterPress(e: any) {
        if (isEnterPress(e)) {
            this.handleClick(e);
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
                realCheckedKeys: new Set([]),
            });
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

    /**
     * A11y: simulate clear button click
     */
    /* istanbul ignore next */
    handleClearEnterPress(e: any) {
        if (isEnterPress(e)) {
            this.handleClear(e);
        }
    }

    removeTag(eventKey: BasicTreeNodeData['key']) {
        const { disableStrictly, checkRelation } = this.getProps();
        const { keyEntities, disabledKeys, realCheckedKeys } = this.getStates();
        const item = (keyEntities[eventKey] && keyEntities[eventKey].data.key === eventKey) ? keyEntities[eventKey].data : this.getDataForKeyNotInKeyEntities(eventKey);
        if (item.disabled || (disableStrictly && disabledKeys.has(eventKey))) {
            return;
        }
        if (checkRelation === 'unRelated') {
            const newRealCheckedKeys = new Set(realCheckedKeys);
            newRealCheckedKeys.delete(eventKey);
            this._notifyChange([...newRealCheckedKeys], null);
            if (!this._isControlledComponent()) {
                this._adapter.updateState({ realCheckedKeys: newRealCheckedKeys } as any);
                this._adapter.rePositionDropdown();
            }
        } else if (checkRelation === 'related') {
            const { checkedKeys, halfCheckedKeys } = this.calcCheckedKeys(eventKey, false);
            this._notifyChange([...checkedKeys], null);
            if (!this._isControlledComponent()) {
                this._adapter.updateState({ checkedKeys, halfCheckedKeys });
                this._adapter.rePositionDropdown();
            }
        }

        this._adapter.notifySelect(eventKey, false, item);

        // reposition dropdown when selected values change
        this._adapter.rePositionDropdown();
    }

    clearInput() {
        const { flattenNodes, expandedKeys, selectedKeys, keyEntities, treeData } = this.getStates();
        const newExpandedKeys: Set<string> = new Set(expandedKeys);
        const isExpandControlled = this._isExpandControlled();
        const expandedOptsKeys = findAncestorKeys(selectedKeys, keyEntities);
        expandedOptsKeys.forEach(item => newExpandedKeys.add(item));
        const newFlattenNodes = flattenTreeData(treeData, newExpandedKeys);

        this._adapter.updateState({
            expandedKeys: isExpandControlled ? expandedKeys : newExpandedKeys,
            flattenNodes: isExpandControlled ? flattenNodes : newFlattenNodes,
            inputValue: '',
            motionKeys: new Set([]),
            filteredKeys: new Set([]),
            filteredExpandedKeys: new Set(expandedOptsKeys),
            filteredShownKeys: new Set([])
        });
    }

    handleInputChange(sugInput: string) {
        // Input is used as controlled component
        this._adapter.updateInputValue(sugInput);
        const { flattenNodes, expandedKeys, selectedKeys, keyEntities, treeData } = this.getStates();
        const { showFilteredOnly, filterTreeNode, treeNodeFilterProp } = this.getProps();
        const newExpandedKeys: Set<string> = new Set(expandedKeys);
        let filteredOptsKeys: string[] = [];
        let expandedOptsKeys = [];
        let newFlattenNodes = [];
        let filteredShownKeys = new Set([]);
        if (!sugInput) {
            expandedOptsKeys = findAncestorKeys(selectedKeys, keyEntities);
            expandedOptsKeys.forEach(item => newExpandedKeys.add(item));
            newFlattenNodes = flattenTreeData(treeData, newExpandedKeys);
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
            newFlattenNodes = flattenTreeData(treeData, new Set(expandedOptsKeys), showFilteredOnly && filteredShownKeys);
        }
        const newFilteredExpandedKeys = new Set(expandedOptsKeys);
        this._adapter.notifySearch(sugInput, Array.from(newFilteredExpandedKeys));
        this._adapter.updateState({
            expandedKeys: this._isExpandControlled() ? expandedKeys : newExpandedKeys,
            flattenNodes: this._isExpandControlled() ? flattenNodes : newFlattenNodes,
            motionKeys: new Set([]),
            filteredKeys: new Set(filteredOptsKeys),
            filteredExpandedKeys: newFilteredExpandedKeys,
            filteredShownKeys,
        });
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
                this._adapter.updateState({ selectedKeys });
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
        const { searchPosition, disableStrictly, checkRelation } = this.getProps();
        const { inputValue, realCheckedKeys } = this.getStates();
        const { checked, eventKey, data } = treeNode;
        if (checkRelation === 'related') {
            const targetStatus = disableStrictly ?
                this.calcCheckedStatus(!checked, eventKey) :
                !checked;

            const { checkedKeys, halfCheckedKeys } = disableStrictly ?
                this.calcNonDisabledCheckedKeys(eventKey, targetStatus) :
                this.calcCheckedKeys(eventKey, targetStatus);
            this._adapter.notifySelect(eventKey, targetStatus, data);
            this._notifyChange([...checkedKeys], e);
            if (!this._isControlledComponent()) {
                this._adapter.updateState({ checkedKeys, halfCheckedKeys });
                this._adapter.rePositionDropdown();
            }
        } else if (checkRelation === 'unRelated') {
            const newRealCheckedKeys: Set<string> = new Set(realCheckedKeys);
            let targetStatus: boolean;
            if (realCheckedKeys.has(eventKey)) {
                newRealCheckedKeys.delete(eventKey);
                targetStatus = false;
            } else {
                newRealCheckedKeys.add(eventKey);
                targetStatus = true;
            }
            this._adapter.notifySelect(eventKey, targetStatus, data);
            this._notifyChange([...newRealCheckedKeys], e);
            if (!this._isControlledComponent()) {
                this._adapter.updateState({ realCheckedKeys: newRealCheckedKeys });
                this._adapter.rePositionDropdown();
            }
        }
        if (searchPosition === strings.SEARCH_POSITION_TRIGGER && inputValue !== '') {
            this._adapter.updateState({ inputValue: '' });
        }
    }

    calcNonDisabledCheckedKeys(eventKey: string, targetStatus: boolean) {
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

    calcCheckedStatus(targetStatus: boolean, eventKey: string) {
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

        // debugger;
        if (!expanded) {
            filteredExpandedKeys.add(eventKey);
        } else if (filteredExpandedKeys.has(eventKey)) {
            filteredExpandedKeys.delete(eventKey);
            motionType = 'hide';
        }

        // cache prev flattenNodes, otherwise the calculation will remove hidden items
        this._adapter.cacheFlattenNodes(motionType === 'hide' && this._isAnimated());

        if (!this._isExpandControlled()) {
            // debugger;
            const flattenNodes = flattenTreeData(treeData, filteredExpandedKeys, showFilteredOnly && filteredShownKeys);
            const motionKeys = this._isAnimated() ? getMotionKeys(eventKey, filteredExpandedKeys, keyEntities) : [];
            const newState = {
                filteredExpandedKeys,
                flattenNodes,
                motionKeys: new Set(motionKeys),
                motionType,
            };

            this._adapter.updateState(newState);
        }

        this._adapter.notifyExpand(filteredExpandedKeys, {
            expanded: !expanded,
            node: data,
        });
    }

    handleNodeExpand(e: any, treeNode: BasicTreeNodeProps) {
        // debugger;
        const { loadData } = this.getProps();
        const { inputValue, keyEntities } = this.getStates();
        const isSearching = Boolean(inputValue);
        if (!loadData && (!treeNode.children || !treeNode.children.length)) {
            return;
        }

        const isExpandControlled = this._isExpandControlled();
        if (isSearching && !isExpandControlled) {
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

        if (!isExpandControlled) {
            // debugger;
            const flattenNodes = flattenTreeData(treeData, expandedKeys);
            const motionKeys = this._isAnimated() ? getMotionKeys(eventKey, expandedKeys, keyEntities) : [];
            const newState = {
                expandedKeys,
                flattenNodes,
                motionKeys: new Set(motionKeys),
                motionType,
            };
            this._adapter.updateState(newState);
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
        let item;
        if (selectedKeys.length) {
            const key = selectedKeys[0];
            item = (keyEntities[key] && keyEntities[key].data.key === key) ? keyEntities[key].data : this.getDataForKeyNotInKeyEntities(key);
        }
        const renderText = item && treeNodeLabelProp in item ? renderSelectedItem(item) : null;
        return renderText;
    }

    /**
     * When the search box is on the trigger, the blur event handling method
     */
    handleInputTriggerBlur() {
        this._adapter.updateState({
            inputTriggerFocus: false
        });
    }

    /**
     * When the search box is on the trigger, the focus event processing method
     */
    handleInputTriggerFocus() {
        this.clearInput();
        this._adapter.updateState({
            inputTriggerFocus: true
        });
    }

    setLoadKeys(data: BasicTreeNodeData, resolve: (value?: any) => void) {
        this._adapter.updateLoadKeys(data, resolve);
    }
}
