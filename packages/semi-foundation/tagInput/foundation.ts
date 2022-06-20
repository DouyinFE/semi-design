import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import keyCode from '../utils/keyCode';
import {
    isString,
    isNumber,
    isFunction,
    isUndefined
} from 'lodash';
import getSplitedArray from './utils/getSplitedArray';
import isEnterPress from '../utils/isEnterPress';

export type TagInputChangeEvent = any;
export type TagInputCursorEvent = any;
export type TagInputKeyboardEvent = any;
export type TagInputMouseEvent = any;

export interface TagInputAdapter extends DefaultAdapter {
    setInputValue: (inputValue: string) => void;
    setTagsArray: (tagsArray: string[]) => void;
    setFocusing: (focusing: boolean) => void;
    toggleFocusing(focused: boolean): void;
    setHovering: (hovering: boolean) => void;
    notifyBlur: (e: TagInputCursorEvent) => void;
    notifyFocus: (e: TagInputCursorEvent) => void;
    notifyInputChange: (v: string, e: TagInputChangeEvent) => void;
    notifyTagChange: (v: string[]) => void;
    notifyTagAdd: (v: string[]) => void;
    notifyTagRemove: (v: string, idx: number) => void;
    notifyKeyDown: (e: TagInputMouseEvent) => void;
}

class TagInputFoundation extends BaseFoundation<TagInputAdapter> {
    constructor(adapter: TagInputAdapter) {
        super({ ...adapter });
    }

    /**
     * handler of input change
     */
    handleInputChange = (e: TagInputChangeEvent) => {
        const { value } = e.target;
        this._checkInputChangeValid(value) && this._onInputChange(value, e);
    };

    /**
     * check whether the input change is legal
     */
    _checkInputChangeValid = (value: string) => {
        // e.target.value legitimacy judgment needs to be based on this.state.input Value
        const {
            maxLength,
            onInputExceed,
            separator
        } = this._adapter.getProps();
        const { inputValue } = this._adapter.getStates();
        let allowChange = true;
        if (isNumber(maxLength)) {
            const valueArr = getSplitedArray(value, separator);
            const inputArr = getSplitedArray(inputValue, separator);
            const maxLen = Math.max(valueArr.length, inputArr.length);
            for (let i = 0; i < maxLen; i++) {
                // When the input length is increasing
                // eslint-disable-next-line max-len
                if (!isUndefined(valueArr[i]) && (isUndefined(inputArr[i]) || valueArr[i].length > inputArr[i].length)) {
                    // When the input length exceeds maxLength
                    // eslint-disable-next-line max-depth
                    if (valueArr[i].length > maxLength) {
                        allowChange = false;
                        isFunction(onInputExceed) && onInputExceed(value);
                        break;
                    }
                }
            }
        }
        return allowChange;
    };

    /**
     * Input event handler when onKeyDown is triggered
     */
    handleKeyDown = (e: TagInputKeyboardEvent) => {
        const {
            inputValue,
            tagsArray
        } = this._adapter.getStates();
        const code = e.keyCode;
        if (code === keyCode.ENTER) {
            e.preventDefault(); // prevent trigger submit when using in form
            if (inputValue !== '') {
                this._handleAddTags(e);
            }
        }
        const { length } = tagsArray;
        if (code === keyCode.BACKSPACE && inputValue === '' && length > 0) {
            const newTagList = tagsArray.slice(0, length - 1);
            const removedTag = tagsArray[length - 1];
            this._onRemove(newTagList, removedTag, length - 1);
        }
        this._adapter.notifyKeyDown(e);
    };

    _handleAddTags(e: TagInputChangeEvent) {
        const {
            separator,
            max,
            onExceed,
            allowDuplicates
        } = this._adapter.getProps();
        const {
            inputValue,
            tagsArray
        } = this._adapter.getStates();
        let addTags = getSplitedArray(inputValue, separator);

        addTags = addTags.filter((item, idx) => {
            // If allowDuplicates is false, then filter duplicates
            if (!allowDuplicates) {
                if (tagsArray.includes(item) || addTags.indexOf(item) !== idx) {
                    return false;
                }
            }
            // Filter empty strings and pure space strings in new items
            return isString(item) && item.trim() !== '';
        });
        let newTagList = tagsArray.concat(addTags);
        if (isNumber(max) && newTagList.length > max) {
            isFunction(onExceed) && onExceed(newTagList);
            newTagList = newTagList.slice(0, max);
            addTags = addTags.slice(0, max - tagsArray.length);
        }
        if (addTags.length > 0) {
            this._onAdd(newTagList, addTags);
        }
        this._onInputChange('', e);
    }

    handleInputBlur(e: TagInputCursorEvent) {
        const { addOnBlur } = this._adapter.getProps();
        if (addOnBlur === true) {
            this._handleAddTags(e);
        }
        this._adapter.setFocusing(false);
        this._adapter.notifyBlur(e);
    }

    handleInputFocus(e: TagInputCursorEvent) {
        this._adapter.setFocusing(true);
        this._adapter.notifyFocus(e);
    }

    /**
     * A11y: simulate clear button click
     */
    handleClearEnterPress(e: TagInputKeyboardEvent) {
        if (isEnterPress(e)) {
            this.handleClearBtn(e);
        }
    }

    handleClearBtn(e: TagInputMouseEvent) {
        const { inputValue, tagsArray } = this._adapter.getStates();
        if (tagsArray.length > 0) {
            this._adapter.setTagsArray([]);
            this._adapter.notifyTagChange([]);
        }
        if (inputValue.length > 0) {
            this._onInputChange('', e);
        }
    }

    handleTagClose(index: number) {
        const { tagsArray } = this._adapter.getStates();
        const newTagList = [...tagsArray];
        newTagList.splice(index, 1);
        const removedTag = tagsArray[index];
        this._onRemove(newTagList, removedTag, index);
    }

    handleInputMouseEnter() {
        this._adapter.setHovering(true);
    }

    handleInputMouseLeave() {
        this._adapter.setHovering(false);
    }

    handleClickPrefixOrSuffix(e: any) {
        const { disabled } = this._adapter.getProps();
        const { isFocus } = this._adapter.getStates();
        if (!disabled && !isFocus) {
            this._adapter.toggleFocusing(true);
        }
    }

    handlePreventMouseDown(e: any) {
        if (e && isFunction(e.preventDefault)) {
            e.preventDefault();
        }
    }
    /**
     * handler of delete tag
     */
    _onRemove(newTagList: string[], removedTags: string, index: number) {
        if (!this._isControlledComponent()) {
            this._adapter.setTagsArray(newTagList);
        }
        this._adapter.notifyTagChange(newTagList);
        this._adapter.notifyTagRemove(removedTags, index);
    }

    /**
     * handler of add tag
     */
    _onAdd(newTagList: string[], addTags: string[]) {
        if (!this._isControlledComponent()) {
            this._adapter.setTagsArray(newTagList);
        }
        this._adapter.notifyTagChange(newTagList);
        this._adapter.notifyTagAdd(addTags);
    }

    /**
     * handler of input change
     */
    _onInputChange(value: string, e: TagInputChangeEvent) {
        this._adapter.setInputValue(value);
        this._adapter.notifyInputChange(value, e);
    }
}

export default TagInputFoundation;