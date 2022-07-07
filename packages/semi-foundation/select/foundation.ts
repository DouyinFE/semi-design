/* argus-disable unPkgSensitiveInfo */
/* eslint-disable max-len */
import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { isNumber, isString, isEqual, omit } from 'lodash';
import KeyCode, { ENTER_KEY } from '../utils/keyCode';
import warning from '../utils/warning';
import isNullOrUndefined from '../utils/isNullOrUndefined';
import { BasicOptionProps } from './optionFoundation';
import isEnterPress from '../utils/isEnterPress';
import { handlePrevent } from '../utils/a11y';

export interface SelectAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    getTriggerWidth(): number;
    setOptionsWidth?(): any;
    updateFocusState(focus: boolean): void;
    focusTrigger(): void;
    unregisterClickOutsideHandler(): void;
    setOptionWrapperWidth(width: string | number): void;
    getOptionsFromChildren(): BasicOptionProps[];
    updateOptions(options: BasicOptionProps[]): void;
    rePositionDropdown(): void;
    updateFocusIndex(index: number): void;
    updateSelection(selection: Map<any, any>): void;
    openMenu(): void;
    notifyDropdownVisibleChange(visible: boolean): void;
    registerClickOutsideHandler(event: any): void;
    toggleInputShow(show: boolean, cb: () => void): void;
    closeMenu(): void;
    notifyCreate(option: BasicOptionProps): void;
    getMaxLimit(): number;
    getSelections(): Map<any, any>;
    notifyMaxLimit(arg: BasicOptionProps): void;
    notifyClear(): void;
    updateInputValue(inputValue: string): void;
    focusInput(): void;
    notifySearch(inputValue: string): void;
    registerKeyDown(handler: () => void): void;
    unregisterKeyDown(): void;
    notifyChange(value: string | BasicOptionProps | (string | BasicOptionProps)[]): void;
    notifySelect(value: BasicOptionProps['value'], option: BasicOptionProps): void;
    notifyDeselect(value: BasicOptionProps['value'], option: BasicOptionProps): void;
    notifyBlur(event: any): void;
    notifyFocus(event: any): void;
    notifyListScroll(event: any): void;
    notifyMouseLeave(event: any): void;
    notifyMouseEnter(event: any): void;
    updateHovering(isHover: boolean): void;
    updateScrollTop(index?: number): void;
    getContainer(): any;
    getFocusableElements(node: any): any[];
    getActiveElement(): any;
    setIsFocusInContainer(isFocusInContainer: boolean): void;
    getIsFocusInContainer(): boolean;
}

type LabelValue = string | number;
type PropValue = LabelValue | Record<string, any>;
export default class SelectFoundation extends BaseFoundation<SelectAdapter> {

    constructor(adapter: SelectAdapter) {
        super({ ...adapter });
    }

    // keyboard event listner
    // eslint-disable-next-line @typescript-eslint/member-ordering
    _keydownHandler: (...arg: any[]) => void | null = null;

    init() {
        this._setDropdownWidth();
        const isDefaultOpen = this.getProp('defaultOpen');
        const isOpen = this.getProp('open');
        const originalOptions = this._collectOptions();
        this._setDefaultSelection(originalOptions);

        if (isDefaultOpen || isOpen) {
            this.open(undefined, originalOptions);
        }

        const autoFocus = this.getProp('autoFocus');
        if (autoFocus) {
            this.focus();
        }
    }

    focus() {
        this._focusTrigger();
        const isFilterable = this._isFilterable();
        this._adapter.updateFocusState(true);
        if (isFilterable) {
            this.toggle2SearchInput(true);
        }
    }

    _focusTrigger() {
        this._adapter.focusTrigger();
        // this.bindKeyBoardEvent();
    }

    destroy() {
        this._adapter.unregisterClickOutsideHandler();
        // this.unBindKeyBoardEvent();
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

    _collectOptions() {
        const originalOptions = this._adapter.getOptionsFromChildren();
        this._adapter.updateOptions(originalOptions);
        // Reposition the drop-down layer
        this._adapter.rePositionDropdown();
        return originalOptions;
    }

    _setDefaultSelection(originalOptions: BasicOptionProps[]) {
        let { value } = this.getProps();
        const { defaultValue } = this.getProps();
        if (this._isControlledComponent()) {
            // do nothing
        } else {
            value = defaultValue;
        }
        this._update(value, originalOptions);
    }

    // call when props.optionList change
    handleOptionListChange() {
        const newOptionList = this._collectOptions();
        const { selections } = this.getStates();
        this.updateOptionsActiveStatus(selections, newOptionList);
        // reset focusIndex
        const { defaultActiveFirstOption } = this.getProps();
        if (defaultActiveFirstOption) {
            this._adapter.updateFocusIndex(0);
        }
    }

    // In uncontrolled mode, when props.optionList change,
    // but already had defaultValue or choose some option
    handleOptionListChangeHadDefaultValue() {
        const selections = this.getState('selections');
        let value;
        const { onChangeWithObject } = this.getProps();
        const isMultiple = this._isMultiple();

        switch (true) {
            case isMultiple && Boolean(selections.size):
                try {
                    value = [...selections].map(item =>
                    // At this point item1 is directly the object
                        (onChangeWithObject ? item[1] : item[1].value)
                    );
                } catch (error) {
                    value = [];
                }
                break;
            case isMultiple && !selections.size:
                value = [];
                break;
            case !isMultiple && Boolean(selections.size):
                try {
                    value = onChangeWithObject ? [...selections][0][1] : [...selections][0][1].value;
                } catch (error) {}
                break;
            case !isMultiple && !selections.size:
                break;
            default:
                break;
        }
        const originalOptions = this._adapter.getOptionsFromChildren();
        this._update(value, originalOptions);
    }

    // call when props.value change
    handleValueChange(value: PropValue) {
        const { allowCreate } = this.getProps();
        let originalOptions;
        // AllowCreate and controlled mode, no need to re-collect optionList
        if (allowCreate && this._isControlledComponent()) {
            originalOptions = this.getState('options') as BasicOptionProps[];
            originalOptions.forEach(item => (item._show = true));
        } else {
            // originalOptions = this.getState('options');
            // The options in state cannot be used directly here, because it is possible to update the optionList and props.value at the same time, and the options in state are still old at this time
            originalOptions = this._adapter.getOptionsFromChildren();
        }
        // Multi-selection, controlled mode, you need to reposition the drop-down menu after updating
        this._adapter.rePositionDropdown();
        this._update(value, originalOptions);
    }

    // Update the selected item in the selection box
    _update(propValue: PropValue, originalOptions: BasicOptionProps[]) {
        let selections;
        if (!this._isMultiple()) {
            // Radio
            selections = this._updateSingle(propValue, originalOptions);
        } else {
            selections = this._updateMultiple(propValue as (PropValue)[], originalOptions);
        }
        // Update the text in the selection box
        this._adapter.updateSelection(selections);
        // Update the selected item in the drop-down box
        this.updateOptionsActiveStatus(selections, originalOptions);
    }

    // Optionally selected updates (when components are mounted, or after value changes)
    _updateSingle(propValue: PropValue, originalOptions: BasicOptionProps[]) {
        const selections = new Map();

        const { onChangeWithObject } = this.getProps();

        // When onChangeWithObject is true, the defaultValue or Value passed by the props should be the object, which corresponds to the result returned by onChange, so the value of the object needs to be taken as a judgment comparison
        const selectedValue = onChangeWithObject && typeof propValue !== 'undefined' ? (propValue as BasicOptionProps).value : propValue;
        const selectedOptions = originalOptions.filter(option => option.value === selectedValue);

        const noMatchOptionInList = !selectedOptions.length && typeof selectedValue !== 'undefined';

        // If the current value, there is a matching option in the optionList
        if (selectedOptions.length) {
            const selectedOption = selectedOptions[0];
            const optionExist = { ...selectedOption };
            // if (onChangeWithObject) {
            //     OptionExist = {... propValue }; // value is the object with the'value 'Key
            // }
            selections.set(optionExist.label, optionExist);
        } else if (noMatchOptionInList) {
            // If the current value does not have a corresponding item in the optionList, construct an option and update it to the selection. However, it does not need to be inserted into the list
            let optionNotExist = { value: propValue, label: propValue, _notExist: true, _scrollIndex: -1 } as BasicOptionProps;
            if (onChangeWithObject) {
                optionNotExist = { ...propValue as BasicOptionProps, _notExist: true, _scrollIndex: -1 };
            }
            selections.set(optionNotExist.label, optionNotExist);
        }
        return selections;
    }

    // Multi-selected option update (when the component is mounted, or after the value changes)
    _updateMultiple(propValue: PropValue[], originalOptions: BasicOptionProps[]) {
        const nowSelections = this.getState('selections');
        let selectedOptionList: any[] = [];
        // Multiple selection is to determine whether it is an array to avoid the problem of defaultValue/value incoming string error
        const propValueIsArray = Array.isArray(propValue);
        this.checkMultipleProps();
        // If N values are currently selected, the corresponding option data is retrieved from the current selections for retrieval. Because these selected options may not exist in the new optionList
        if (nowSelections.size) {
            selectedOptionList = [...nowSelections].map(item => item[1]);
        }

        const selections = new Map();
        let selectedValues = propValue;

        const { onChangeWithObject } = this.getProps();

        // When onChangeWithObject is true
        if (onChangeWithObject && propValueIsArray) {
            selectedValues = (propValue as BasicOptionProps[]).map(item => item.value);
        }

        if (propValueIsArray && selectedValues.length) {
            (selectedValues as LabelValue[]).forEach((selectedValue, i: number) => {
                // The current value exists in the current optionList
                const index = originalOptions.findIndex(option => option.value === selectedValue);
                if (index !== -1) {
                    selections.set(originalOptions[index].label, originalOptions[index]);
                } else {
                    // The current value exists in the optionList that has been selected before the change, and does not exist in the current optionList, then directly take the corresponding value from the selections, no need to construct a new option
                    const indexInSelectedList = selectedOptionList.findIndex(option => option.value === selectedValue);
                    if (indexInSelectedList !== -1) {
                        const option = selectedOptionList[indexInSelectedList];
                        selections.set(option.label, option);
                    } else {
                        // The current value does not exist in the current optionList or the list before the change. Construct an option and update it to the selection
                        let optionNotExist = { value: selectedValue, label: selectedValue, _notExist: true };
                        onChangeWithObject ? (optionNotExist = { ...propValue[i] as any, _notExist: true }) : null;
                        selections.set(optionNotExist.label, { ...optionNotExist, _scrollIndex: -1 });
                    }
                }
            });
        }

        return selections;
    }

    _isMultiple() {
        return this.getProp('multiple');
    }

    _isDisabled() {
        return this.getProp('disabled');
    }

    _isFilterable() {
        return Boolean(this.getProp('filter')); // filter can be boolean or function
    }

    handleClick(e: any) {
        const { clickToHide } = this.getProps();
        const { isOpen } = this.getStates();
        const isDisabled = this._isDisabled();

        if (isDisabled) {
            return;
        } else if (!isOpen) {
            this.open();
            this._notifyFocus(e);
        } else if (isOpen && clickToHide) {
            this.close(e);
        } else if (isOpen && !clickToHide) {
            this.focusInput();
        }
    }

    open(acInput?: string, originalOptions?: BasicOptionProps[]) {
        const isFilterable = this._isFilterable();
        const options = originalOptions || this.getState('options');
        // When searchable, when the drop-down box expands
        if (isFilterable) {
            // Also clears the options filter to show all candidates
            // Options created dynamically but not selected are also filtered out
            const sugInput = '';
            const newOptions = this._filterOption(options, sugInput).filter(item => !item._inputCreateOnly);
            this._adapter.updateOptions(newOptions);
            this.toggle2SearchInput(true);
        }
        this._adapter.openMenu();
        this._setDropdownWidth();
        this._adapter.notifyDropdownVisibleChange(true);

        this.bindKeyBoardEvent();

        this._adapter.registerClickOutsideHandler((e: MouseEvent) => {
            this.close(e);
        });
    }

    toggle2SearchInput(isShow: boolean) {
        if (isShow) {
            this._adapter.toggleInputShow(isShow, () => this.focusInput());
        } else {
            this._adapter.toggleInputShow(isShow, () => undefined);
        }
    }

    close(e?: any) {
        // to support A11y, closing the panel trigger does not necessarily lose focus
        const isFilterable = this._isFilterable();
        if (isFilterable) {
            // this.unBindKeyBoardEvent();
            this.clearInput();
            // this.toggle2SearchInput(false);
        }

        this._adapter.closeMenu();
        this._adapter.notifyDropdownVisibleChange(false);
        // this.unBindKeyBoardEvent();
        // this._notifyBlur(e);
        this._adapter.unregisterClickOutsideHandler();
        // this._adapter.updateFocusState(false);
    }

    onSelect(option: BasicOptionProps, optionIndex: number, event: MouseEvent | KeyboardEvent) {
        const isDisabled = this._isDisabled();
        if (isDisabled) {
            return;
        }

        // If the allowCreate dynamically created option is selected, onCreate needs to be triggered
        if (option._inputCreateOnly) {
            this._adapter.notifyCreate(option);
        }

        const isMultiple = this._isMultiple();
        if (!isMultiple) {
            this._handleSingleSelect(option, event);
            this._focusTrigger();
        } else {
            this._handleMultipleSelect(option, event);
            this._isFilterable() && this.focusInput();
        }
        this._adapter.updateFocusIndex(optionIndex);
    }

    _handleSingleSelect({ value, label, ...rest }: BasicOptionProps, event: any) {
        const selections = new Map().set(label, { value, label, ...rest });
        // First trigger onSelect, then trigger onChange
        this._notifySelect(value, { value, label, ...rest });

        // If it is a controlled component, directly notify
        if (this._isControlledComponent()) {
            this._notifyChange(selections);
            this.close(event);
        } else {
            this._adapter.updateSelection(selections);
            // notify user
            this._notifyChange(selections);
            // Update the selected item in the drop-down box
            this.close(event);
            this.updateOptionsActiveStatus(selections);
        }
    }

    _handleMultipleSelect({ value, label, ...rest }: BasicOptionProps, event: MouseEvent | KeyboardEvent) {
        const maxLimit = this._adapter.getMaxLimit();
        const selections = this._adapter.getSelections();
        const { autoClearSearchValue } = this.getProps();
        if (selections.has(label)) {
            this._notifyDeselect(value, { value, label, ...rest });
            selections.delete(label);
        } else if (maxLimit && selections.size === maxLimit) {
            this._adapter.notifyMaxLimit({ value, label, ...omit(rest, '_scrollIndex') });
            return;
        } else {
            this._notifySelect(value, { value, label, ...rest });
            selections.set(label, { value, label, ...rest });
        }
        if (this._isControlledComponent()) {
            // Controlled components, directly notified
            this._notifyChange(selections);
            if (this._isFilterable()) {
                if (autoClearSearchValue) {
                    this.clearInput();
                }
                this.focusInput();
            }
        } else {
            // Uncontrolled components, update ui
            this._adapter.updateSelection(selections);
            // In multi-select mode, the drop-down pop-up layer is repositioned every time the value is changed, because the height selection of the selection box may have changed
            this._adapter.rePositionDropdown();
            let { options } = this.getStates();
            // Searchable filtering, when selected, resets Input
            if (this._isFilterable()) {
                // When filter active，if autoClearSearchValue is true，reset input after select
                if (autoClearSearchValue) {
                    this.clearInput();
                    // At the same time, the filtering of options is also cleared, in order to show all candidates
                    const sugInput = '';
                    options = this._filterOption(options, sugInput);
                }
                this.focusInput();
            }
            this.updateOptionsActiveStatus(selections, options);
            this._notifyChange(selections);
        }
    }

    clearSelected() {
        const selections = new Map();
        if (this._isControlledComponent()) {
            this._notifyChange(selections);
            this._adapter.notifyClear();
        } else {
            this._adapter.updateSelection(selections);
            this.updateOptionsActiveStatus(selections);
            this._notifyChange(selections);
            this._adapter.notifyClear();
        }
        // when call manually by ref method
        const { isOpen } = this.getStates();
        if (isOpen) {
            this._adapter.rePositionDropdown();
        }
    }

    // Update the selected item in the drop-down box
    updateOptionsActiveStatus(selections: Map<any, any>, options: BasicOptionProps[] = this.getState('options')) {
        const { allowCreate } = this.getProps();
        const newOptions = options.map(option => {
            if (selections.has(option.label)) {
                option._selected = true;
                if (allowCreate) {
                    delete option._inputCreateOnly;
                }
            } else {
                if (option._inputCreateOnly) {
                    option._show = false;
                }
                option._selected = false;
            }
            return option;
        });
        this._adapter.updateOptions(newOptions);
    }

    removeTag(item: BasicOptionProps) {
        const selections = this._adapter.getSelections();
        selections.delete(item.label);

        if (this._isControlledComponent()) {
            this._notifyDeselect(item.value, item);
            this._notifyChange(selections);
        } else {
            this._notifyDeselect(item.value, item);
            this._adapter.updateSelection(selections);
            this.updateOptionsActiveStatus(selections);
            // Repostion drop-down layer, because the selection may have changed the number of rows, resulting in a height change
            this._adapter.rePositionDropdown();
            this._notifyChange(selections);
        }
    }

    clearInput() {
        this._adapter.updateInputValue('');
        this._adapter.notifySearch('');
        // reset options filter
        const { options } = this.getStates();
        const { remote } = this.getProps();
        let optionsAfterFilter = options;
        if (!remote) {
            optionsAfterFilter = this._filterOption(options, '');
        }
        this._adapter.updateOptions(optionsAfterFilter);
    }

    focusInput() {
        this._adapter.focusInput();
        this._adapter.updateFocusState(true);
    }

    handleInputChange(sugInput: string) {
        // Input is a controlled component, so the value needs to be updated
        this._adapter.updateInputValue(sugInput);
        const { options, isOpen } = this.getStates();
        const { allowCreate, remote } = this.getProps();

        let optionsAfterFilter = options;
        if (!remote) {
            // Filter options based on input
            optionsAfterFilter = this._filterOption(options, sugInput);
        }

        // When allowClear is true, an entry can be created. You need to include the current input as a new Option input
        optionsAfterFilter = this._createOptionByInput(allowCreate, optionsAfterFilter, sugInput);

        this._adapter.updateOptions(optionsAfterFilter);
        this._adapter.notifySearch(sugInput);
        // In multi-select mode, the drop-down box is repositioned each time you enter, because it may cause a line break as the input changes
        if (this._isMultiple()) {
            this._adapter.rePositionDropdown();
        }
    }

    _filterOption(originalOptions: BasicOptionProps[], sugInput: string) {
        const filter = this.getProp('filter');
        if (!filter) {
            // 1. No filtering
            return originalOptions;
        } else if (typeof filter === 'boolean' && filter) {
            // 2. When true, the default filter is used
            const input = sugInput.toLowerCase();

            return originalOptions.map(option => {
                const label = option.label.toString().toLowerCase();
                const groupLabel = option._parentGroup && option._parentGroup.label;
                const matchOption = label.includes(input);
                const matchGroup = isString(groupLabel) && groupLabel.toLowerCase().includes(input);
                if (matchOption || matchGroup) {
                    option._show = true;
                } else {
                    option._show = false;
                }
                return option;
            });
        } else if (typeof filter === 'function') {
            // 3. When passing in a custom function, use a custom function for filtering
            return originalOptions.map(option => {
                filter(sugInput, option) ? (option._show = true) : (option._show = false);
                return option;
            });
        }
        return undefined;
    }

    _createOptionByInput(allowCreate: boolean, optionsAfterFilter: BasicOptionProps[], sugInput: string) {
        if (allowCreate) {
            if (sugInput) {
                // optionsAfterFilter clone ??? needClone ?
                const newOptionByInput = {
                    _show: true,
                    _selected: false,
                    value: sugInput,
                    label: sugInput,
                    // True indicates that the option was dynamically created during user filtering
                    _inputCreateOnly: true,
                };

                let createOptionIndex = -1;
                let matchOptionIndex = -1;
                optionsAfterFilter.forEach((option, index) => {
                    if (!option._show && !option._inputCreateOnly) {
                        return;
                    }
                    // The matching algorithm is not necessarily through labels?
                    if (option.label === sugInput) {
                        matchOptionIndex = index;
                    }
                    if (option._inputCreateOnly) {
                        createOptionIndex = index;
                        option.value = sugInput;
                        option.label = sugInput;
                        option._show = true;
                    }
                });

                if (createOptionIndex === -1 && matchOptionIndex === -1) {
                    optionsAfterFilter.push(newOptionByInput);
                }
                if (matchOptionIndex !== -1) {
                    optionsAfterFilter = optionsAfterFilter.filter(item => !item._inputCreateOnly);
                }
            } else {
                // Delete input unselected items
                optionsAfterFilter = optionsAfterFilter.filter(item => !item._inputCreateOnly);
            }
        }
        // TODO Promise supports asynchronous creation
        return optionsAfterFilter;
    }

    bindKeyBoardEvent() {
        this._keydownHandler = event => {
            this._handleKeyDown(event);
        };
        this._adapter.registerKeyDown(this._keydownHandler);
    }

    unBindKeyBoardEvent() {
        if (this._keydownHandler) {
            this._adapter.unregisterKeyDown();
        }
    }

    _handleKeyDown(event: KeyboardEvent) {
        const key = event.keyCode;
        const { isOpen } = this.getStates();
        const { loading } = this.getProps();

        if (loading) {
            return;
        }
        switch (key) {
            case KeyCode.UP:
                // Prevent Input's cursor from following
                // Prevent Input cursor from following
                event.preventDefault();
                this._handleArrowKeyDown(-1);
                break;
            case KeyCode.DOWN:
                // Prevent Input's cursor from following
                // Prevent Input cursor from following
                event.preventDefault();
                this._handleArrowKeyDown(1);
                break;
            case KeyCode.BACKSPACE:
                this._handleBackspaceKeyDown();
                break;
            case KeyCode.ENTER:
                // internal-issues:302
                // prevent trigger form’s submit when use in form
                handlePrevent(event);
                this._handleEnterKeyDown(event);
                break;
            case KeyCode.ESC:
                this.close(event);
                break;
            case KeyCode.TAB:
                // check if slot have focusable element
                this._handleTabKeyDown(event);
                break;
            default:
                break;
        }
    }

    handleContainerKeyDown(event: any) {
        // when focus in contanier, handle the key down
        const key = event.keyCode;
        const { isOpen } = this.getStates();

        switch (key) {
            case KeyCode.TAB:
                isOpen && this._handleTabKeyDown(event);
                break;
            default:
                break;
        }
    }

    _getEnableFocusIndex(offset: number) {
        const { focusIndex, options } = this.getStates();
        const visibleOptions = options.filter((item: BasicOptionProps) => item._show);
        // let visibleOptions = options;
        const optionsLength = visibleOptions.length;
        let index = focusIndex + offset;
        if (index < 0) {
            index = optionsLength - 1;
        }
        if (index >= optionsLength) {
            index = 0;
        }
        // avoid newIndex option is disabled
        if (offset > 0) {
            let nearestActiveOption = -1;
            for (let i = 0; i < visibleOptions.length; i++) {
                const optionIsActive = !visibleOptions[i].disabled;
                if (optionIsActive) {
                    nearestActiveOption = i;
                }
                if (nearestActiveOption >= index) {
                    break;
                }
            }
            index = nearestActiveOption;
        } else {
            let nearestActiveOption = visibleOptions.length;
            for (let i = optionsLength - 1; i >= 0; i--) {
                const optionIsActive = !visibleOptions[i].disabled;
                if (optionIsActive) {
                    nearestActiveOption = i;
                }
                if (nearestActiveOption <= index) {
                    break;
                }
            }
            index = nearestActiveOption;
        }
        // console.log('new:' + index);
        this._adapter.updateFocusIndex(index);
        this._adapter.updateScrollTop(index);
    }

    _handleArrowKeyDown(offset: number) {
        const { isOpen } = this.getStates();
        isOpen ? this._getEnableFocusIndex(offset) : this.open();
    }

    _handleTabKeyDown(event: KeyboardEvent){
        const { filter, multiple } = this.getProps();
        const { isOpen } = this.getStates();

        if (isOpen){
            const container = this._adapter.getContainer();
            const focusableElements = this._adapter.getFocusableElements(container);
            const focusableNum = focusableElements.length;

            if (focusableNum > 0){
                // Shift + Tab will move focus backward
                if (event.shiftKey) {
                    this._handlePanelOpenShiftTabKeyDown(focusableElements, event);
                } else {
                    this._handlePanelOpenTabKeyDown(focusableElements, event);
                }
            } else {
                this.close();
            }
        }
    }

    _handlePanelOpenTabKeyDown(focusableElements: any[], event: any) {
        const activeElement = this._adapter.getActiveElement();
        const isFocusInContainer = this._adapter.getIsFocusInContainer();
        if (!isFocusInContainer){
            // focus in trigger, set next focus to the first element in container
            focusableElements[0].focus();
            this._adapter.setIsFocusInContainer(true);
            handlePrevent(event);
        } else if (activeElement === focusableElements[focusableElements.length - 1]) {
            // focus in the last element in container, focus back to trigger and close panel
            this._focusTrigger(); 
            this._adapter.setIsFocusInContainer(false);
            this.close();
            handlePrevent(event);
        }
    }

    _handlePanelOpenShiftTabKeyDown(focusableElements: any[], event: any) {
        const activeElement = this._adapter.getActiveElement();
        const isFocusInContainer = this._adapter.getIsFocusInContainer();

        if (!isFocusInContainer) {
            // focus in trigger, close the panel
            this.close();
        } else if (activeElement === focusableElements[0]) {
            // focus in the first element in container, focus back to trigger
            this._focusTrigger(); 
            this._adapter.setIsFocusInContainer(false);
            handlePrevent(event);
        }
    }

    _handleEnterKeyDown(event: KeyboardEvent) {
        const { isOpen, options, focusIndex } = this.getStates();
        if (!isOpen){
            this.open();
        } else {
            if (focusIndex !== -1) {
                const visibleOptions = options.filter((item: BasicOptionProps) => item._show);
                const { length } = visibleOptions;
                // fix issue 1201
                if (length <= focusIndex) {
                    return;
                }
                if (visibleOptions && length) {
                    const selectedOption = visibleOptions[focusIndex];
                    if (selectedOption.disabled) {
                        return;
                    }
                    this.onSelect(selectedOption, focusIndex, event);
                }
            } else {
                this.close();
            }
        }
    }

    _handleBackspaceKeyDown() {
        if (this._isMultiple()) {
            const selections = this._adapter.getSelections();
            const { inputValue } = this.getStates();
            const length = selections.size;
            if (length && !inputValue) {
                const keys = [...selections.keys()];
                let index = length - 1;
                let targetLabel = keys[index];
                let targetItem = selections.get(targetLabel);
                let isAllDisabled = false;
                // can skip disabled item when remove trigger by backspace
                if (targetItem.disabled && index === 0) {
                    return;
                }
                while (targetItem.disabled && index !== 0) {
                    index = index - 1;
                    targetLabel = keys[index];
                    targetItem = selections.get(targetLabel);
                    // eslint-disable-next-line
                    if (index == 0 && targetItem.disabled) {
                        isAllDisabled = true;
                    }
                }
                if (!isAllDisabled) {
                    this.removeTag(targetItem);
                }
            }
        }
    }

    _notifyChange(selections: Map<any, any>) {
        const { onChangeWithObject } = this.getProps();
        const stateSelections = this.getState('selections');

        let notifyVal;
        const selectionsProps = [...selections.values()];
        const isMultiple = this._isMultiple();
        const hasChange = this._diffSelections(selections, stateSelections, isMultiple);

        if (!hasChange) {
            return;
        }
        switch (true) {
            case onChangeWithObject:
                this._notifyChangeWithObject(selections);
                break;
            case !onChangeWithObject && !isMultiple:
                notifyVal = selectionsProps.length ? selectionsProps[0].value : undefined;
                this._adapter.notifyChange(notifyVal);
                break;
            case !onChangeWithObject && isMultiple:
                notifyVal = selectionsProps.length ? selectionsProps.map(props => props.value) : [];
                this._adapter.notifyChange(notifyVal);
                break;
            default:
                break;
        }
    }

    _removeInternalKey(option: BasicOptionProps) {
        // eslint-disable-next-line
        let newOption = { ...option };
        delete newOption._parentGroup;
        delete newOption._show;
        delete newOption._selected;
        delete newOption._scrollIndex;
        if ('_keyInOptionList' in newOption) {
            newOption.key = newOption._keyInOptionList;
            delete newOption._keyInOptionList;
        }
        return newOption;
    }

    _notifySelect(value: BasicOptionProps['value'], option: BasicOptionProps) {
        const newOption = this._removeInternalKey(option);
        this._adapter.notifySelect(value, newOption);
    }

    _notifyDeselect(value: BasicOptionProps['value'], option: BasicOptionProps) {
        const newOption = this._removeInternalKey(option);
        this._adapter.notifyDeselect(value, newOption);
    }

    _diffSelections(selections: Map<any, any>, oldSelections: Map<any, any>, isMultiple: boolean) {
        let diff = true;
        if (!isMultiple) {
            const selectionProps = [...selections.values()];
            const oldSelectionProps = [...oldSelections.values()];
            const optionLabel = selectionProps[0] ? selectionProps[0].label : selectionProps[0];
            const oldOptionLabel = oldSelectionProps[0] ? oldSelectionProps[0].label : oldSelectionProps[0];
            diff = !isEqual(optionLabel, oldOptionLabel);
        } else {
            // When multiple selection, there is no scene where the value is different between the two operations
        }
        return diff;
    }

    // When onChangeWithObject is true, the onChange input parameter is not only value, but also label and other parameters
    _notifyChangeWithObject(selections: Map<any, any>) {
        const stateSelections = this.getState('selections');

        const values = [];
        for (const item of selections.entries()) {
            let val = { label: item[0], ...item[1] };
            val = this._removeInternalKey(val);
            values.push(val);
        }
        if (!this._isMultiple()) {
            this._adapter.notifyChange(values[0]);
        } else {
            this._adapter.notifyChange(values);
        }
    }

    // Scenes that may trigger blur：
    //  1、clickOutSide
    //  2、click option / press enter, and then select complete（when multiple is false
    //  3、press esc when dropdown list open
    _notifyBlur(e: FocusEvent) {
        this._adapter.notifyBlur(e);
    }

    // Scenes that may trigger focus:
    //  1、click selection
    _notifyFocus(e: FocusEvent) {
        this._adapter.notifyFocus(e);
    }

    handleMouseEnter(e: MouseEvent) {
        this._adapter.updateHovering(true);
        this._adapter.notifyMouseEnter(e);
    }

    handleMouseLeave(e: MouseEvent) {
        this._adapter.updateHovering(false);
        this._adapter.notifyMouseLeave(e);
    }

    handleClearClick(e: MouseEvent) {
        const { filter } = this.getProps();
        if (filter) {
            this.clearInput();
        }
        this.clearSelected();
        // prevent this click open dropdown
        e.stopPropagation();
    }

    handleKeyPress(e: KeyboardEvent) {
        if (e && e.key === ENTER_KEY) {
            this.handleClick(e);
        }
    }

    /* istanbul ignore next */
    handleClearBtnEnterPress(e: KeyboardEvent) {
        if (isEnterPress(e)) {
            this.handleClearClick(e as any);
        }
    }

    handleOptionMouseEnter(optionIndex: number) {
        this._adapter.updateFocusIndex(optionIndex);
    }

    handleListScroll(e: any) {
        this._adapter.notifyListScroll(e);
    }

    handleTriggerFocus(e) {
        this.bindKeyBoardEvent();
        this._adapter.updateFocusState(true);
    }

    handleTriggerBlur(e: FocusEvent) {
        this._adapter.updateFocusState(false);
        const { filter, autoFocus } = this.getProps();
        const { isOpen, isFocus } = this.getStates();
        // Under normal circumstances, blur will be accompanied by dropdown close, so the notify of blur can be called uniformly in close
        // But when autoFocus, because dropdown is not expanded, you need to listen for the trigger's blur and trigger the notify callback
        if (autoFocus && isFocus && !isOpen) {
            // blur when autoFocus & not open dropdown yet
            this._notifyBlur(e);
        }
    }

    handleInputBlur(e: any) {
        this.toggle2SearchInput(false);
    }

    selectAll() {
        const { options } = this.getStates();
        const { onChangeWithObject } = this.getProps();
        let selectedValues = [];
        const isMultiple = this._isMultiple();
        if (!isMultiple) {
            console.warn(`[Semi Select]: It seems that you have called the selectAll method in the single-selection Select.
                Please note that this is not a legal way to use it`
            );
            return;
        }
        if (onChangeWithObject) {
            selectedValues = options;
        } else {
            selectedValues = options.map((option: BasicOptionProps) => option.value);
        }
        this.handleValueChange(selectedValues);
        this._adapter.notifyChange(selectedValues);
    }

    /**
     * Check whether the props
     *  -defaultValue/value in multiple selection mode is array
     * @param {Object} props
     */
    checkMultipleProps(props?: Record<string, any>) {
        if (this._isMultiple()) {
            const currentProps = props ? props : this.getProps();
            const { defaultValue, value } = currentProps;
            const selectedValues = value || defaultValue;
            if (!isNullOrUndefined(selectedValues) && !Array.isArray(selectedValues)) {
                /* istanbul ignore next */
                warning(true, '[Semi Select] defaultValue/value should be array type in multiple mode');
            }
        }
    }

    updateScrollTop() {
        this._adapter.updateScrollTop();
    }
    
}
