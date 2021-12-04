/* eslint-disable @typescript-eslint/ban-types, max-len */
import React from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import { isEqual, noop } from 'lodash';

import { strings, cssClasses } from '@douyinfe/semi-foundation/autoComplete/constants';
import AutoCompleteFoundation, { AutoCompleteAdapter, StateOptionItem, DataItem } from '@douyinfe/semi-foundation/autoComplete/foundation';
import { numbers as popoverNumbers } from '@douyinfe/semi-foundation/popover/constants';
import BaseComponent, { ValidateStatus } from '../_base/baseComponent';
import { Position } from '../tooltip';
import Spin from '../spin';
import Popover from '../popover';
import Input from '../input';
import Trigger from '../trigger';

import Option from '../select/option';
import warning from '@douyinfe/semi-foundation/utils/warning';
import '@douyinfe/semi-foundation/autoComplete/autoComplete.scss';
import { Motion } from '../_base/base';

const prefixCls = cssClasses.PREFIX;
const sizeSet = strings.SIZE;
const positionSet = strings.POSITION;
const statusSet = strings.STATUS;

/**
 * AutoComplete is an enhanced Input (candidates suggest that users can choose or not),
 * and the Select positioning that supports Search is still a selector.
 * 1. When you click to expand, Select will clear all input values, but AutoComplete will not
 * 2. AutoComplete's renderSelectedItem only supports simple string returns, while Select's renderSelectedItem can return ReactNode
 * 3. Select props.value supports incoming object, but autoComplete only supports string (because the value needs to be displayed in Input)
 */

export interface BaseDataItem extends DataItem {
    label?: React.ReactNode;
}

export type AutoCompleteItems = BaseDataItem | string | number;

export interface AutoCompleteProps<T extends AutoCompleteItems> {
    autoAdjustOverflow?: boolean;
    autoFocus?: boolean;
    className?: string;
    children?: React.ReactNode;
    data?: T[];
    disabled?: boolean;
    defaultOpen?: boolean;
    defaultValue?: T;
    defaultActiveFirstOption?: boolean;
    dropdownMatchSelectWidth?: boolean;
    dropdownClassName?: string;
    dropdownStyle?: React.CSSProperties;
    emptyContent?: React.ReactNode | null;
    getPopupContainer?: () => HTMLElement;
    insetLabel?: React.ReactNode;
    loading?: boolean;
    motion?: Motion;
    maxHeight?: string | number;
    mouseEnterDelay?: number;
    mouseLeaveDelay?: number;
    onFocus?: (e: React.FocusEvent) => void;
    onBlur?: (e: React.FocusEvent) => void;
    onChange?: (value: string | number) => void;
    onSearch?: (inputValue: string) => void;
    onSelect?: (value: T) => void;
    onClear?: () => void;
    onChangeWithObject?: boolean;
    onSelectWithObject?: boolean;
    onDropdownVisibleChange?: (visible: boolean) => void;
    prefix?: React.ReactNode;
    placeholder?: string;
    position?: Position;
    renderItem?: (option: T) => React.ReactNode;
    renderSelectedItem?: (option: T) => string;
    size?: 'small' | 'default' | 'large';
    style?: React.CSSProperties;
    suffix?: React.ReactNode;
    showClear?: boolean;
    triggerRender?: (props?: any) => React.ReactNode;
    stopPropagation?: boolean | string;
    value?: string | number;
    validateStatus?: ValidateStatus;
    zIndex?: number;
}

interface KeyboardEventType {
    onKeyDown?: React.KeyboardEventHandler;
}

interface AutoCompleteState {
    dropdownMinWidth: null | number;
    inputValue: string | undefined | number;
    options: StateOptionItem[];
    visible: boolean;
    focusIndex: number;
    selection: Map<any, any>;
    rePosKey: number;
    keyboardEventSet?: KeyboardEventType;
}

class AutoComplete<T extends AutoCompleteItems> extends BaseComponent<AutoCompleteProps<T>, AutoCompleteState> {
    static propTypes = {
        autoFocus: PropTypes.bool,
        autoAdjustOverflow: PropTypes.bool,
        className: PropTypes.string,
        children: PropTypes.node,
        data: PropTypes.array,
        defaultOpen: PropTypes.bool,
        defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        defaultActiveFirstOption: PropTypes.bool,
        disabled: PropTypes.bool,
        dropdownMatchSelectWidth: PropTypes.bool,
        dropdownClassName: PropTypes.string,
        dropdownStyle: PropTypes.object,
        emptyContent: PropTypes.node,
        onSearch: PropTypes.func,
        onSelect: PropTypes.func,
        onClear: PropTypes.func,
        onBlur: PropTypes.func,
        onFocus: PropTypes.func,
        onChange: PropTypes.func,
        position: PropTypes.oneOf(positionSet),
        placeholder: PropTypes.string,
        prefix: PropTypes.node,
        onChangeWithObject: PropTypes.bool,
        onSelectWithObject: PropTypes.bool,
        renderItem: PropTypes.func,
        renderSelectedItem: PropTypes.func,
        suffix: PropTypes.node,
        showClear: PropTypes.bool,
        size: PropTypes.oneOf(sizeSet),
        style: PropTypes.object,
        stopPropagation: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
        maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        mouseEnterDelay: PropTypes.number,
        mouseLeaveDelay: PropTypes.number,
        motion: PropTypes.oneOfType([PropTypes.bool, PropTypes.func, PropTypes.object]),
        getPopupContainer: PropTypes.func,
        triggerRender: PropTypes.func,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        validateStatus: PropTypes.oneOf(statusSet),
        zIndex: PropTypes.number,
    };

    static Option = Option;

    static defaultProps = {
        stopPropagation: true,
        motion: true,
        zIndex: popoverNumbers.DEFAULT_Z_INDEX,
        position: 'bottomLeft' as const,
        data: [] as [],
        showClear: false,
        disabled: false,
        size: 'default' as const,
        onFocus: noop,
        onSearch: noop,
        onClear: noop,
        onBlur: noop,
        onSelect: noop,
        onChange: noop,
        onSelectWithObject: false,
        onDropdownVisibleChange: noop,
        defaultActiveFirstOption: true,
        dropdownMatchSelectWidth: true,
        loading: false,
        maxHeight: 300,
        validateStatus: 'default' as const,
        autoFocus: false,
        emptyContent: null as null,
        // onPressEnter: () => undefined,
        // defaultOpen: false,
    };

    triggerRef: React.RefObject<HTMLDivElement> | null;
    optionsRef: React.RefObject<HTMLDivElement> | null;

    private clickOutsideHandler: () => void | null;

    constructor(props: AutoCompleteProps<T>) {
        super(props);
        this.foundation = new AutoCompleteFoundation(this.adapter);
        const initRePosKey = 1;
        this.state = {
            dropdownMinWidth: null,
            inputValue: '',
            // option list
            options: [],
            // popover visible
            visible: false,
            // current focus option index
            focusIndex: props.defaultActiveFirstOption ? 0 : -1,
            // current selected options
            selection: new Map(),
            rePosKey: initRePosKey,
        };
        this.triggerRef = React.createRef();
        this.optionsRef = React.createRef();
        this.clickOutsideHandler = null;

        warning(
            'triggerRender' in this.props && typeof this.props.triggerRender === 'function',
            `[Semi AutoComplete] 
            - If you are using the following props: 'suffix', 'prefix', 'showClear', 'validateStatus', and 'size', 
            please notice that they will be removed in the next major version.
            Please use 'componentProps' to retrieve these props instead.
            - If you are using 'onBlur', 'onFocus', please try to avoid using them and look for changes in the future.`
        );
    }

    get adapter(): AutoCompleteAdapter<AutoCompleteProps<T>, AutoCompleteState> {
        const keyboardAdapter = {
            registerKeyDown: (cb: any): void => {
                const keyboardEventSet = {
                    onKeyDown: cb,
                };
                this.setState({ keyboardEventSet });
            },
            unregisterKeyDown: (cb: any): void => {
                this.setState({ keyboardEventSet: {} });
            },
            updateFocusIndex: (focusIndex: number): void => {
                this.setState({ focusIndex });
            },
        };
        return {
            ...super.adapter,
            ...keyboardAdapter,
            getTriggerWidth: () => {
                const el = this.triggerRef.current;
                return el && el.getBoundingClientRect().width;
            },
            setOptionWrapperWidth: width => {
                this.setState({ dropdownMinWidth: width });
            },
            updateInputValue: inputValue => {
                this.setState({ inputValue });
            },
            toggleListVisible: isShow => {
                this.setState({ visible: isShow });
            },
            updateOptionList: optionList => {
                this.setState({ options: optionList });
            },
            updateSelection: selection => {
                this.setState({ selection });
            },
            notifySearch: inputValue => {
                this.props.onSearch(inputValue);
            },
            notifyChange: value => {
                this.props.onChange(value);
            },
            notifySelect: (option: StateOptionItem | string | number): void => {
                this.props.onSelect(option as T);
            },
            notifyDropdownVisibleChange: (isVisible: boolean): void => {
                this.props.onDropdownVisibleChange(isVisible);
            },
            notifyClear: () => {
                this.props.onClear();
            },
            notifyFocus: (event: React.FocusEvent) => {
                this.props.onFocus(event);
            },
            notifyBlur: (event: React.FocusEvent) => {
                this.props.onBlur(event);
            },
            rePositionDropdown: () => {
                let { rePosKey } = this.state;
                rePosKey = rePosKey + 1;
                this.setState({ rePosKey });
            },
        };
    }

    componentDidMount() {
        this.foundation.init();
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    componentDidUpdate(prevProps: AutoCompleteProps<T>, prevState: AutoCompleteState) {
        if (!isEqual(this.props.data, prevProps.data)) {
            this.foundation.handleDataChange(this.props.data);
        }
        if (this.props.value !== prevProps.value) {
            this.foundation.handleValueChange(this.props.value);
        }
    }

    onSelect = (option: StateOptionItem, optionIndex: number, e: React.MouseEvent | React.KeyboardEvent): void => {
        this.foundation.handleSelect(option, optionIndex);
    };

    onSearch = (value: string): void => {
        this.foundation.handleSearch(value);
    };

    onBlur = (e: React.FocusEvent): void => this.foundation.handleBlur(e);

    onFocus = (e: React.FocusEvent): void => this.foundation.handleFocus(e);

    onInputClear = (): void => this.foundation.handleClear();

    handleInputClick = (e: React.MouseEvent): void => this.foundation.handleInputClick(e);

    renderInput(): React.ReactNode {
        const {
            size,
            prefix,
            insetLabel,
            suffix,
            placeholder,
            style,
            className,
            showClear,
            disabled,
            triggerRender,
            validateStatus,
            autoFocus,
            value
        } = this.props;
        const { inputValue, keyboardEventSet, selection } = this.state;

        const useCustomTrigger = typeof triggerRender === 'function';

        const outerProps = {
            style,
            className: useCustomTrigger
                ? cls(className)
                : cls(
                    {
                        [prefixCls]: true,
                        [`${prefixCls}-disabled`]: disabled,
                    },
                    className
                ),
            onClick: this.handleInputClick,
            ref: this.triggerRef,
            ...keyboardEventSet,
        };

        const innerProps = {
            disabled,
            placeholder,
            autofocus: autoFocus,
            onChange: this.onSearch,
            onClear: this.onInputClear,
            // TODO: remove in next major version
            suffix,
            prefix: prefix || insetLabel,
            showClear,
            validateStatus,
            size,
            onBlur: this.onBlur,
            onFocus: this.onFocus,
        };

        return (
            <div {...outerProps}>
                {typeof triggerRender === 'function' ? (
                    <Trigger
                        {...innerProps}
                        inputValue={(typeof value !== 'undefined' ? value : inputValue) as string}
                        value={Array.from(selection.values())}
                        triggerRender={triggerRender}
                        componentName="AutoComplete"
                        componentProps={{ ...this.props }}
                    />
                ) : (
                    <Input {...innerProps} value={typeof value !== 'undefined' ? value : inputValue} />
                )}
            </div>
        );
    }

    renderLoading() {
        const loadingWrapperCls = `${prefixCls}-loading-wrapper`;
        return (
            <div className={loadingWrapperCls}>
                <Spin />
            </div>
        );
    }

    renderOption(option: StateOptionItem, optionIndex: number): React.ReactNode {
        const { focusIndex } = this.state;
        const isFocused = optionIndex === focusIndex;

        return (
            <Option
                showTick={false}
                onSelect={(v: StateOptionItem, e: React.MouseEvent | React.KeyboardEvent) => this.onSelect(v, optionIndex, e)}
                // selected={selection.has(option.label)}
                focused={isFocused}
                onMouseEnter={() => this.foundation.handleOptionMouseEnter(optionIndex)}
                key={option.key || option.label + option.value + optionIndex}
                {...option}
            >
                {option.label}
            </Option>
        );
    }

    renderOptionList(): React.ReactNode {
        const { maxHeight, dropdownStyle, dropdownClassName, loading, emptyContent } = this.props;
        const { options, dropdownMinWidth } = this.state;
        const listCls = cls(
            {
                [`${prefixCls}-option-list`]: true,
            },
            dropdownClassName
        );

        let optionsNode;

        if (options.length === 0) {
            optionsNode = emptyContent;
        } else {
            optionsNode = options.filter(option => option.show).map((option, i) => this.renderOption(option, i));
        }

        const style = {
            maxHeight: maxHeight,
            minWidth: dropdownMinWidth,
            ...dropdownStyle,
        };
        return (
            <div className={listCls} role="listbox" style={style}>
                {!loading ? optionsNode : this.renderLoading()}
            </div>
        );
    }

    render(): React.ReactNode {
        const {
            position,
            motion,
            zIndex,
            mouseEnterDelay,
            mouseLeaveDelay,
            autoAdjustOverflow,
            stopPropagation,
            getPopupContainer,
        } = this.props;
        const { visible, rePosKey } = this.state;
        const input = this.renderInput();
        const optionList = this.renderOptionList();
        return (
            <Popover
                mouseEnterDelay={mouseEnterDelay}
                mouseLeaveDelay={mouseLeaveDelay}
                autoAdjustOverflow={autoAdjustOverflow}
                trigger="custom"
                motion={motion}
                visible={visible}
                content={optionList}
                position={position}
                ref={this.optionsRef as any}
                // TransformFromCenter TODO: need to confirm
                zIndex={zIndex}
                stopPropagation={stopPropagation}
                getPopupContainer={getPopupContainer}
                rePosKey={rePosKey}
            >
                {input}
            </Popover>
        );
    }
}

export default AutoComplete;
