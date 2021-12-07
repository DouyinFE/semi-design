/* eslint-disable prefer-const, max-len */
import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { isString, isNumber, isUndefined, isObject } from 'lodash';
import warning from '../utils/warning';
import KeyCode from '../utils/keyCode';

interface KeyboardAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    registerKeyDown: (callback: (event: any) => void) => void;
    unregisterKeyDown: (callback: (event: any) => void) => void;
    updateFocusIndex: (focusIndex: number) => void;
}

export interface DataItem {
    [x: string]: any;
    value?: string | number;
    label?: any; // reactNode
}

export interface StateOptionItem extends DataItem {
    show?: boolean;
    key?: string | number;
}

export type AutoCompleteData = Array<DataItem | string>;

export interface AutoCompleteAdapter<P = Record<string, any>, S = Record<string, any>> extends KeyboardAdapter<P, S> {
    getTriggerWidth: () => number | undefined;
    setOptionWrapperWidth: (width: number) => void;
    updateInputValue: (inputValue: string | number) => void;
    toggleListVisible: (isShow: boolean) => void;
    updateOptionList: (optionList: Array<StateOptionItem>) => void;
    updateSelection: (selection: Map<any, any>) => void;
    notifySearch: (inputValue: string) => void;
    notifyChange: (value: string | number) => void;
    notifySelect: (option: StateOptionItem | string | number) => void;
    notifyDropdownVisibleChange: (isVisible: boolean) => void;
    notifyClear: () => void;
    notifyFocus: (event?: any) => void;
    notifyBlur: (event?: any) => void;
    rePositionDropdown: () => void;
}

class AutoCompleteFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<AutoCompleteAdapter<P, S>, P, S> {

    private _keydownHandler: (args: any) => void | null;
    constructor(adapter: AutoCompleteAdapter<P, S>) {
        super({ ...adapter });
    }

    init(): void {
        this._setDropdownWidth();

        const { defaultOpen, data, defaultValue, value } = this.getProps();

        if (data && data.length) {
            const initOptions = this._generateList(data);
            this._adapter.updateOptionList(initOptions);
        }

        if (defaultOpen) {
            this.openDropdown();
        }

        // When both defaultValue and value exist, finally the value of value will be taken as initValue
        let initValue = '';
        if (typeof defaultValue !== 'undefined') {
            initValue = defaultValue;
        }
        if (typeof value !== 'undefined') {
            initValue = value;
        }
        if (typeof initValue !== 'undefined') {
            this.handleValueChange(initValue);
        }
    }

    destroy(): void {
        // this._adapter.unregisterClickOutsideHandler();
        this.unBindKeyBoardEvent();
    }

    _setDropdownWidth(): void {
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

    handleInputClick(e?: MouseEvent): void {
        const { options } = this.getStates();
        const { disabled } = this.getProps();
        if (options.length && !disabled) {
            this.openDropdown();
        }
    }

    openDropdown(): void {
        this._adapter.toggleListVisible(true);
        this._setDropdownWidth();
        // this._adapter.registerClickOutsideHandler(e => this.closeDropdown(e));
        this._adapter.notifyDropdownVisibleChange(true);
        this.bindKeyBoardEvent();
    }

    closeDropdown(e?: any): void {
        this._adapter.toggleListVisible(false);
        // this._adapter.unregisterClickOutsideHandler();
        this._adapter.notifyDropdownVisibleChange(false);
        this.unBindKeyBoardEvent();
    }

    // props.data => optionList
    _generateList(data: AutoCompleteData): Array<StateOptionItem> {
        const { renderItem } = this.getProps();
        const options: Array<StateOptionItem> = [];
        if (data && data.length) {
            data.forEach((item, i) => {
                const key = String(new Date().getTime()) + i;
                let option: StateOptionItem = {};
                if (isString(item) || isNumber(item)) {
                    option = { value: item as string, key, label: item, show: true };
                } else if (isObject(item) && !isUndefined(item.value)) {
                    option = { show: true, ...item };
                }
                if (renderItem && typeof renderItem === 'function') {
                    option.label = renderItem(item);
                }
                options.push(option);
            });
        }
        return options;
    }

    handleSearch(inputValue: string): void {
        this._adapter.updateInputValue(inputValue);
        this._adapter.notifySearch(inputValue);
        this._adapter.notifyChange(inputValue);
    }

    handleSelect(option: StateOptionItem, optionIndex?: number): void {
        const { renderSelectedItem } = this.getProps();

        let newInputValue: string | number = '';
        if (renderSelectedItem && typeof renderSelectedItem === 'function') {
            newInputValue = renderSelectedItem(option);
            warning(
                typeof newInputValue !== 'string',
                'Warning: [Semi AutoComplete] renderSelectedItem must return string, please check your function return'
            );
        } else {
            newInputValue = option.label;
        }

        // 1. trigger onSelect
        // 2. close Dropdown
        if (this._isControlledComponent()) {
            this.closeDropdown();
            this.notifySelect(option);
        } else {
            // 1. update Input
            // 2. update Selection
            // 3. trigger onSelect
            // 4. close Dropdown
            this._adapter.updateInputValue(newInputValue);
            this.updateSelection(option);
            this.notifySelect(option);
            this.closeDropdown();
        }
        this._adapter.notifyChange(newInputValue);
        this._adapter.updateFocusIndex(optionIndex);
    }

    updateSelection(option: StateOptionItem) {
        const selection = new Map();
        if (option) {
            selection.set(option.label, option);
        }
        this._adapter.updateSelection(selection);
    }

    notifySelect(option: StateOptionItem) {
        if (this._backwardLabelInValue()) {
            this._adapter.notifySelect(option);
        } else {
            this._adapter.notifySelect(option.value);
        }
    }

    _backwardLabelInValue() {
        const props = this.getProps();
        let { onSelectWithObject } = props;
        return onSelectWithObject;
    }

    handleDataChange(newData: any[]) {
        const options = this._generateList(newData);
        this._adapter.updateOptionList(options);
        this._adapter.rePositionDropdown();
    }

    handleValueChange(propValue: any) {
        let { data } = this.getProps();
        let selectedValue = '';
        if (this._backwardLabelInValue() && Object.prototype.toString.call(propValue) === '[object Object]') {
            selectedValue = propValue.value;
        } else {
            selectedValue = propValue;
        }

        let renderSelectedItem = this._getRenderSelectedItem();

        const options = this._generateList(data);
        // Get the option whose value match from options
        let selectedOption: StateOptionItem | Array<StateOptionItem> = options.filter(option => option.value === selectedValue);
        const canMatchInData = selectedOption.length;

        const selectedOptionIndex = options.findIndex(option => option.value === selectedValue);

        let inputValue = '';
        if (canMatchInData) {
            selectedOption = selectedOption[0];
            inputValue = renderSelectedItem(selectedOption);
        } else {
            const cbItem = this._backwardLabelInValue() ? propValue : { label: selectedValue, value: selectedValue };
            inputValue = renderSelectedItem(cbItem);
        }
        this._adapter.updateInputValue(inputValue);
        this.updateSelection(canMatchInData ? selectedOption : null);
        this._adapter.updateFocusIndex(selectedOptionIndex);
    }


    _getRenderSelectedItem() {
        let { renderSelectedItem } = this.getProps();

        if (typeof renderSelectedItem === 'undefined') {
            renderSelectedItem = (option: any) => option.label;
        } else if (renderSelectedItem && typeof renderSelectedItem === 'function') {
            // do nothing
        }
        return renderSelectedItem;
    }


    handleClear() {
        this._adapter.notifyClear();
    }

    bindKeyBoardEvent() {
        this._keydownHandler = (event: KeyboardEvent): void => {
            this._handleKeyDown(event);
        };
        this._adapter.registerKeyDown(this._keydownHandler);
    }

    unBindKeyBoardEvent() {
        if (this._keydownHandler) {
            this._adapter.unregisterKeyDown(this._keydownHandler);
        }
    }

    _handleKeyDown(event: KeyboardEvent) {
        const key = event.keyCode;
        const { visible } = this.getStates();

        if (!visible) {
            return;
        }
        switch (key) {
            case KeyCode.UP:
                // Prevent Input's cursor from following the movement
                event.preventDefault();
                this._handleArrowKeyDown(-1);
                break;
            case KeyCode.DOWN:
                // Prevent Input's cursor from following the movement
                event.preventDefault();
                this._handleArrowKeyDown(1);
                break;
            case KeyCode.ENTER:
                this._handleEnterKeyDown();
                break;
            case KeyCode.ESC:
                this.closeDropdown();
                break;
            default:
                break;
        }
    }

    _getEnableFocusIndex(offset: number) {
        const { focusIndex, options } = this.getStates();
        const visibleOptions = options.filter((item: StateOptionItem) => item.show);
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
        this._adapter.updateFocusIndex(index);
    }

    _handleArrowKeyDown(offset: number): void {
        this._getEnableFocusIndex(offset);
    }

    _handleEnterKeyDown() {
        const { visible, options, focusIndex } = this.getStates();
        if (focusIndex !== -1 && options.length !== 0) {
            const visibleOptions = options.filter((item: StateOptionItem) => item.show);
            const selectedOption = visibleOptions[focusIndex];
            this.handleSelect(selectedOption);
        } else if (visible) {
            // this.close();
        }
    }

    handleOptionMouseEnter(optionIndex: number): void {
        this._adapter.updateFocusIndex(optionIndex);
    }

    handleFocus(e: FocusEvent) {
        this._adapter.notifyFocus(e);
        this.openDropdown();
    }

    handleBlur(e: FocusEvent) {
        // In order to handle the problem of losing onClick binding when clicking on the padding area, the onBlur event is triggered first to cause the react view to be updated
        // internal-issues:1231
        setTimeout(() => {
            this._adapter.notifyBlur(e);
            this.closeDropdown();
        }, 100);
    }
}

export default AutoCompleteFoundation;
