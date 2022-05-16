/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
import React, { Fragment, MouseEvent, ReactInstance } from 'react';
import ReactDOM from 'react-dom';
import cls from 'classnames';
import PropTypes from 'prop-types';
import ConfigContext, { ContextValue } from '../configProvider/context';
import SelectFoundation, { SelectAdapter } from '@douyinfe/semi-foundation/select/foundation';
import { cssClasses, strings, numbers } from '@douyinfe/semi-foundation/select/constants';
import BaseComponent, { ValidateStatus } from '../_base/baseComponent';
import { isEqual, isString, noop, get, isNumber } from 'lodash';
import Tag from '../tag/index';
import TagGroup from '../tag/group';
import LocaleConsumer from '../locale/localeConsumer';
import Popover from '../popover/index';
import { numbers as popoverNumbers } from '@douyinfe/semi-foundation/popover/constants';
import { FixedSizeList as List } from 'react-window';
import { getOptionsFromGroup } from './utils';
import VirtualRow from './virtualRow';

import Input, { InputProps } from '../input/index';
import Option, { OptionProps } from './option';
import OptionGroup from './optionGroup';
import Spin from '../spin';
import Trigger from '../trigger';
import { IconChevronDown, IconClear } from '@douyinfe/semi-icons';
import { isSemiIcon } from '../_utils';
import { Subtract } from 'utility-types';

import warning from '@douyinfe/semi-foundation/utils/warning';

import '@douyinfe/semi-foundation/select/select.scss';
import { Locale } from '../locale/interface';
import { Position, TooltipProps } from '../tooltip';

export { OptionProps } from './option';
export { OptionGroupProps } from './optionGroup';
export { VirtualRowProps } from './virtualRow';

const prefixcls = cssClasses.PREFIX;

const key = 0;

type ExcludeInputType = {
    value?: InputProps['value'];
    onFocus?: InputProps['onFocus'];
    onChange?: InputProps['onChange'];
}

type OnChangeValueType = string | number | Record<string, any>;
export interface optionRenderProps {
    key?: any;
    label?: React.ReactNode;
    value?: string | number;
    style?: React.CSSProperties;
    className?: string;
    selected?: boolean;
    focused?: boolean;
    show?: boolean;
    disabled?: boolean;
    onMouseEnter?: (e: React.MouseEvent) => any;
    onClick?: (e: React.MouseEvent) => any;
    [x: string]: any;
}

export interface selectMethod {
    clearInput?: () => void;
    selectAll?: () => void;
    deselectAll?: () => void;
    focus?: () => void;
    close?: () => void;
    open?: () => void;
}
export type SelectSize = 'small' | 'large' | 'default';

export interface virtualListProps {
    itemSize?: number;
    height?: number;
    width?: string | number;
}

export type RenderSingleSelectedItemFn = (optionNode: Record<string, any>) => React.ReactNode;
export type RenderMultipleSelectedItemFn = (optionNode: Record<string, any>, multipleProps: { index: number; disabled: boolean; onClose: (tagContent: React.ReactNode, e: MouseEvent) => void }) => { isRenderInTag: boolean; content: React.ReactNode };

export type RenderSelectedItemFn = RenderSingleSelectedItemFn | RenderMultipleSelectedItemFn;

export type SelectProps = {
    'aria-describedby'?: React.AriaAttributes['aria-describedby'];
    'aria-errormessage'?: React.AriaAttributes['aria-errormessage'];
    'aria-invalid'?: React.AriaAttributes['aria-invalid'];
    'aria-labelledby'?: React.AriaAttributes['aria-labelledby'];
    'aria-required'?: React.AriaAttributes['aria-required'];
    id?: string;
    autoFocus?: boolean;
    autoClearSearchValue?: boolean;
    arrowIcon?: React.ReactNode;
    defaultValue?: string | number | any[] | Record<string, any>;
    value?: string | number | any[] | Record<string, any>;
    placeholder?: React.ReactNode;
    onChange?: (value: SelectProps['value']) => void;
    multiple?: boolean;
    filter?: boolean | ((inpueValue: string, option: OptionProps) => boolean);
    max?: number;
    maxTagCount?: number;
    maxHeight?: string | number;
    style?: React.CSSProperties;
    className?: string;
    size?: SelectSize;
    disabled?: boolean;
    emptyContent?: React.ReactNode;
    onDropdownVisibleChange?: (visible: boolean) => void;
    zIndex?: number;
    position?: Position;
    onSearch?: (value: string) => void;
    dropdownClassName?: string;
    dropdownStyle?: React.CSSProperties;
    outerTopSlot?: React.ReactNode;
    innerTopSlot?: React.ReactNode;
    outerBottomSlot?: React.ReactNode;
    innerBottomSlot?: React.ReactNode;
    optionList?: OptionProps[];
    dropdownMatchSelectWidth?: boolean;
    loading?: boolean;
    defaultOpen?: boolean;
    validateStatus?: ValidateStatus;
    defaultActiveFirstOption?: boolean;
    onChangeWithObject?: boolean;
    suffix?: React.ReactNode;
    prefix?: React.ReactNode;
    insetLabel?: React.ReactNode;
    insetLabelId?: string;
    inputProps?: Subtract<InputProps, ExcludeInputType>;
    showClear?: boolean;
    showArrow?: boolean;
    renderSelectedItem?: RenderSelectedItemFn;
    renderCreateItem?: (inputValue: OptionProps['value'], focus: boolean) => React.ReactNode;
    renderOptionItem?: (props: optionRenderProps) => React.ReactNode;
    onMouseEnter?: (e: React.MouseEvent) => any;
    onMouseLeave?: (e: React.MouseEvent) => any;
    clickToHide?: boolean;
    onExceed?: (option: OptionProps) => void;
    onCreate?: (option: OptionProps) => void;
    remote?: boolean;
    onDeselect?: (value: SelectProps['value'], option: Record<string, any>) => void;
    onSelect?: (value: SelectProps['value'], option: Record<string, any>) => void;
    allowCreate?: boolean;
    triggerRender?: (props?: any) => React.ReactNode;
    onClear?: () => void;
    virtualize?: virtualListProps;
    onFocus?: (e: React.FocusEvent) => void;
    onBlur?: (e: React.FocusEvent) => void;
    onListScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
    children?: React.ReactNode;
} & Pick<
TooltipProps,
| 'spacing'
| 'getPopupContainer'
| 'motion'
| 'autoAdjustOverflow'
| 'mouseLeaveDelay'
| 'mouseEnterDelay'
| 'stopPropagation'
> & React.RefAttributes<any>;

export interface SelectState {
    isOpen: boolean;
    isFocus: boolean;
    options: Array<OptionProps>;
    selections: Map<OptionProps['label'], any>; // A collection of all currently selected items, k: label, v: {value,... otherProps}
    dropdownMinWidth: number;
    optionKey: number;
    inputValue: string;
    showInput: boolean;
    focusIndex: number;
    keyboardEventSet: any; // {}
    optionGroups: Array<any>;
    isHovering: boolean;
}

// Notes: Use the label of the option as the identifier, that is, the option in Select, the value is allowed to be the same, but the label must be unique

class Select extends BaseComponent<SelectProps, SelectState> {
    static contextType = ConfigContext;

    static Option = Option;

    static OptGroup = OptionGroup;

    static propTypes = {
        'aria-describedby': PropTypes.string,
        'aria-errormessage': PropTypes.string,
        'aria-invalid': PropTypes.bool,
        'aria-labelledby': PropTypes.string,
        'aria-required': PropTypes.bool,
        autoFocus: PropTypes.bool,
        autoClearSearchValue: PropTypes.bool,
        children: PropTypes.node,
        defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object]),
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object]),
        placeholder: PropTypes.node,
        onChange: PropTypes.func,
        multiple: PropTypes.bool,
        // Whether to turn on the input box filtering function, when it is a function, it represents a custom filtering function
        filter: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
        // How many tags can you choose?
        max: PropTypes.number,
        // How many tabs are displayed at most, and the rest are displayed in + N
        maxTagCount: PropTypes.number,
        maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        style: PropTypes.object,
        className: PropTypes.string,
        size: PropTypes.oneOf<SelectProps['size']>(strings.SIZE_SET),
        disabled: PropTypes.bool,
        emptyContent: PropTypes.node,
        onDropdownVisibleChange: PropTypes.func,
        zIndex: PropTypes.number,
        position: PropTypes.oneOf(strings.POSITION_SET),
        onSearch: PropTypes.func,
        getPopupContainer: PropTypes.func,
        dropdownClassName: PropTypes.string,
        dropdownStyle: PropTypes.object,
        outerTopSlot: PropTypes.node,
        innerTopSlot: PropTypes.node,
        inputProps: PropTypes.object,
        outerBottomSlot: PropTypes.node,
        innerBottomSlot: PropTypes.node, // Options slot
        optionList: PropTypes.array,
        dropdownMatchSelectWidth: PropTypes.bool,
        loading: PropTypes.bool,
        defaultOpen: PropTypes.bool,
        validateStatus: PropTypes.oneOf(strings.STATUS),
        defaultActiveFirstOption: PropTypes.bool,
        triggerRender: PropTypes.func,
        stopPropagation: PropTypes.bool,
        // motion doesn't need to be exposed
        motion: PropTypes.oneOfType([PropTypes.func, PropTypes.bool, PropTypes.object]),

        onChangeWithObject: PropTypes.bool,

        suffix: PropTypes.node,
        prefix: PropTypes.node,
        insetLabel: PropTypes.node,
        insetLabelId: PropTypes.string,
        showClear: PropTypes.bool,
        showArrow: PropTypes.bool,

        renderSelectedItem: PropTypes.func,

        allowCreate: PropTypes.bool,
        renderCreateItem: PropTypes.func,

        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
        clickToHide: PropTypes.bool,
        onExceed: PropTypes.func,
        onCreate: PropTypes.func,
        remote: PropTypes.bool,
        onDeselect: PropTypes.func,
        // The main difference between onSelect and onChange is that when multiple selections are selected, onChange contains all options, while onSelect only contains items for the current operation
        onSelect: PropTypes.func,
        autoAdjustOverflow: PropTypes.bool,
        mouseEnterDelay: PropTypes.number,
        mouseLeaveDelay: PropTypes.number,
        spacing: PropTypes.number,
        onBlur: PropTypes.func,
        onFocus: PropTypes.func,
        onClear: PropTypes.func,

        virtualize: PropTypes.object,
        renderOptionItem: PropTypes.func,
        onListScroll: PropTypes.func,
        arrowIcon: PropTypes.node,
    // open: PropTypes.bool,
    // tagClosable: PropTypes.bool,
    };

    static defaultProps: Partial<SelectProps> = {
        stopPropagation: true,
        motion: true,
        zIndex: popoverNumbers.DEFAULT_Z_INDEX,
        // position: 'bottomLeft',
        filter: false,
        multiple: false,
        disabled: false,
        defaultOpen: false,
        allowCreate: false,
        placeholder: '',
        onDropdownVisibleChange: noop,
        onChangeWithObject: false,
        onChange: noop,
        onSearch: noop,
        onMouseEnter: noop,
        onMouseLeave: noop,
        onDeselect: noop,
        onSelect: noop,
        onCreate: noop,
        onExceed: noop,
        onFocus: noop,
        onBlur: noop,
        onClear: noop,
        onListScroll: noop,
        maxHeight: 300,
        dropdownMatchSelectWidth: true,
        defaultActiveFirstOption: false,
        showArrow: true,
        showClear: false,
        remote: false,
        autoAdjustOverflow: true,
        autoClearSearchValue: true,
        arrowIcon: <IconChevronDown />
        // Radio selection is different from the default renderSelectedItem for multiple selection, so it is not declared here
        // renderSelectedItem: (optionNode) => optionNode.label,
        // The default creator rendering is related to i18, so it is not declared here
        // renderCreateItem: (input) => input
    };

    inputRef: React.RefObject<HTMLInputElement>;
    triggerRef: React.RefObject<HTMLDivElement>;
    optionsRef: React.RefObject<any>;
    virtualizeListRef: React.RefObject<any>;
    selectOptionListID: string;
    clickOutsideHandler: (e: MouseEvent) => void;
    foundation: SelectFoundation;
    context: ContextValue;

    constructor(props: SelectProps) {
        super(props);
        this.state = {
            isOpen: false,
            isFocus: false,
            options: [], // All options
            selections: new Map(), // A collection of all currently selected items, k: label, v: {value,... otherProps}
            dropdownMinWidth: null,
            optionKey: key,
            inputValue: '',
            showInput: false,
            focusIndex: props.defaultActiveFirstOption ? 0 : -1,
            keyboardEventSet: {},
            optionGroups: [],
            isHovering: false,
        };
        /* Generate random string */
        this.selectOptionListID = Math.random().toString(36).slice(2);
        this.virtualizeListRef = React.createRef();
        this.inputRef = React.createRef();
        this.triggerRef = React.createRef();
        this.optionsRef = React.createRef();
        this.clickOutsideHandler = null;
        this.onSelect = this.onSelect.bind(this);
        this.onClear = this.onClear.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.renderOption = this.renderOption.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onClearBtnEnterPress = this.onClearBtnEnterPress.bind(this);

        this.foundation = new SelectFoundation(this.adapter);

        warning(
            'optionLabelProp' in this.props,
            '[Semi Select] \'optionLabelProp\' has already been deprecated, please use \'renderSelectedItem\' instead.'
        );

        warning(
            'labelInValue' in this.props,
            '[Semi Select] \'labelInValue\' has already been deprecated, please use \'onChangeWithObject\' instead.'
        );
    }

    get adapter(): SelectAdapter<SelectProps, SelectState> {
        const keyboardAdapter = {
            registerKeyDown: (cb: () => void) => {
                const keyboardEventSet = {
                    onKeyDown: cb,
                };
                this.setState({ keyboardEventSet });
            },
            unregisterKeyDown: () => {
                this.setState({ keyboardEventSet: {} });
            },
            updateFocusIndex: (focusIndex: number) => {
                this.setState({ focusIndex });
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            scrollToFocusOption: () => {},
        };

        const filterAdapter = {
            updateInputValue: (value: string) => {
                this.setState({ inputValue: value });
            },
            toggleInputShow: (showInput: boolean, cb: (...args: any) => void) => {
                this.setState({ showInput }, () => {
                    cb();
                });
            },
            focusInput: () => {
                if (this.inputRef && this.inputRef.current) {
                    this.inputRef.current.focus();
                }
            },
        };
        const multipleAdapter = {
            notifyMaxLimit: (option: OptionProps) => this.props.onExceed(option),
            getMaxLimit: () => this.props.max,
            registerClickOutsideHandler: (cb: (e: MouseEvent) => void) => {
                const clickOutsideHandler: (e: MouseEvent) => void = e => {
                    const optionInstance = this.optionsRef && this.optionsRef.current;
                    const triggerDom = (this.triggerRef && this.triggerRef.current) as Element;
                    // eslint-disable-next-line react/no-find-dom-node
                    const optionsDom = ReactDOM.findDOMNode(optionInstance as ReactInstance);
                    // let isInPanel = optionsDom && optionsDom.contains(e.target);
                    // let isInTrigger = triggerDom && triggerDom.contains(e.target);
                    if (optionsDom && !optionsDom.contains(e.target as Node) &&
                      triggerDom && !triggerDom.contains(e.target as Node)) {
                        cb(e);
                    }
                };
                this.clickOutsideHandler = clickOutsideHandler;
                document.addEventListener('mousedown', clickOutsideHandler as any, false);
            },
            unregisterClickOutsideHandler: () => {
                if (this.clickOutsideHandler) {
                    document.removeEventListener('mousedown', this.clickOutsideHandler as any, false);
                    this.clickOutsideHandler = null;
                }
            },
            rePositionDropdown: () => {
                let { optionKey } = this.state;
                optionKey = optionKey + 1;
                this.setState({ optionKey });
            },
            notifyDeselect: (value: OptionProps['value'], option: OptionProps) => {
                delete option._parentGroup;
                this.props.onDeselect(value, option);
            },
        };
        return {
            ...super.adapter,
            ...keyboardAdapter,
            ...filterAdapter,
            ...multipleAdapter,
            // Collect all subitems, each item is visible by default when collected, and is not selected
            getOptionsFromChildren: (children = this.props.children) => {
                let optionGroups = [];
                let options = [];
                const { optionList } = this.props;
                if (optionList && optionList.length) {
                    options = optionList.map((itemOpt, index) => ({
                        _show: true,
                        _selected: false,
                        _scrollIndex: index,
                        ...itemOpt
                    }));
                    optionGroups[0] = { children: options, label: '' };
                } else {
                    const result = getOptionsFromGroup(children);
                    optionGroups = result.optionGroups;
                    options = result.options;
                }
                this.setState({ optionGroups });
                return options;
            },
            updateOptions: (options: OptionProps[]) => {
                this.setState({ options });
            },
            openMenu: () => {
                this.setState({ isOpen: true });
            },
            closeMenu: () => {
                this.setState({ isOpen: false });
            },
            getTriggerWidth: () => {
                const el = this.triggerRef.current;
                return el && el.getBoundingClientRect().width;
            },
            setOptionWrapperWidth: (width: number) => {
                this.setState({ dropdownMinWidth: width });
            },
            updateSelection: (selections: Map<OptionProps['label'], any>) => {
                this.setState({ selections });
            },
            // clone Map, important!!!, prevent unexpected modify on state
            getSelections: () => new Map(this.state.selections),

            notifyChange: (value: OnChangeValueType | OnChangeValueType[]) => {
                this.props.onChange(value);
            },
            notifySelect: (value: OptionProps['value'], option: OptionProps) => {
                delete option._parentGroup;
                this.props.onSelect(value, option);
            },
            notifyDropdownVisibleChange: (visible: boolean) => {
                this.props.onDropdownVisibleChange(visible);
            },
            notifySearch: (input: string) => {
                this.props.onSearch(input);
            },
            notifyCreate: (input: OptionProps) => {
                this.props.onCreate(input);
            },
            notifyMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
                this.props.onMouseEnter(e);
            },
            notifyMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
                this.props.onMouseLeave(e);
            },
            notifyFocus: (event: React.FocusEvent) => {
                this.props.onFocus(event);
            },
            notifyBlur: (event: React.FocusEvent) => {
                this.props.onBlur(event);
            },
            notifyClear: () => {
                this.props.onClear();
            },
            notifyListScroll: (e: React.UIEvent<HTMLDivElement>) => {
                this.props.onListScroll(e);
            },
            updateHovering: (isHovering: boolean) => {
                this.setState({ isHovering });
            },
            updateFocusState: (isFocus: boolean) => {
                this.setState({ isFocus });
            },
            focusTrigger: () => {
                try {
                    const el = (this.triggerRef.current) as any;
                    el.focus();
                } catch (error) {

                }
            },
            updateScrollTop: (index?: number) => {
                // eslint-disable-next-line max-len
                let optionClassName = `.${prefixcls}-option-selected`;
                if (index !== undefined) {
                    optionClassName = `.${prefixcls}-option:nth-child(${index})`;
                }
                let destNode = document.querySelector(`#${prefixcls}-${this.selectOptionListID} ${optionClassName}`) as HTMLDivElement;
                if (Array.isArray(destNode)) {
                    // eslint-disable-next-line prefer-destructuring
                    destNode = destNode[0];
                }
                if (destNode) {
                    /**
                     * Scroll the first selected item into view.
                     * The reason why ScrollIntoView is not used here is that it may cause page to move.
                     */
                    const destParent = destNode.parentNode as HTMLDivElement;
                    destParent.scrollTop = destNode.offsetTop -
                        destParent.offsetTop -
                        (destParent.clientHeight / 2) +
                        (destNode.clientHeight / 2);
                }
            },
        };
    }

    componentDidMount() {
        this.foundation.init();
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    componentDidUpdate(prevProps: SelectProps, prevState: SelectState) {
        const prevChildrenKeys = React.Children.toArray(prevProps.children).map((child: any) => child.key);
        const nowChildrenKeys = React.Children.toArray(this.props.children).map((child: any) => child.key);

        let isOptionsChanged = false;

        if (!isEqual(prevChildrenKeys, nowChildrenKeys) || !isEqual(prevProps.optionList, this.props.optionList)) {
            isOptionsChanged = true;
            this.foundation.handleOptionListChange();
        }

        // Add isOptionChanged: There may be cases where the value is unchanged, but the optionList is updated. At this time, the label corresponding to the value may change, and the selected item needs to be updated
        if (prevProps.value !== this.props.value || isOptionsChanged) {
            if ('value' in this.props) {
                this.foundation.handleValueChange(this.props.value as any);
            } else {
                this.foundation.handleOptionListChangeHadDefaultValue();
            }
        }
    }

    handleInputChange = (value: string) => this.foundation.handleInputChange(value);

    renderInput() {
        const { size, multiple, disabled, inputProps } = this.props;
        const inputPropsCls = get(inputProps, 'className');
        const inputcls = cls(`${prefixcls}-input`, {
            [`${prefixcls}-input-single`]: !multiple,
            [`${prefixcls}-input-multiple`]: multiple,
        }, inputPropsCls);
        const { inputValue } = this.state;

        const selectInputProps: Record<string, any> = {
            value: inputValue,
            disabled,
            className: inputcls,
            onChange: this.handleInputChange,
            ...inputProps,
        };

        let style = {};
        // Multiple choice mode
        if (multiple) {
            style = {
                width: inputValue ? `${inputValue.length * 16}px` : '2px',
            };
            selectInputProps.style = style;
        }
        return (
            <Input
                ref={this.inputRef as any}
                size={size}
                onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                    // prevent event bubbling which will fire trigger onFocus event
                    e.stopPropagation();
                    // e.nativeEvent.stopImmediatePropagation();
                }}
                {...selectInputProps}
            />
        );
    }

    close() {
        this.foundation.close();
    }

    open() {
        this.foundation.open();
    }

    clearInput() {
        this.foundation.clearInput();
    }

    selectAll() {
        this.foundation.selectAll();
    }

    deselectAll() {
        this.foundation.clearSelected();
    }

    focus() {
        this.foundation.focus();
    }

    onSelect(option: OptionProps, optionIndex: number, e: any) {
        this.foundation.onSelect(option, optionIndex, e);
    }

    onClear(e: React.MouseEvent) {
        e.nativeEvent.stopImmediatePropagation();
        this.foundation.handleClearClick(e as any);
    }

    onClearBtnEnterPress(e: React.KeyboardEvent) {
        this.foundation.handleClearBtnEnterPress(e as any);
    }

    renderEmpty() {
        return <Option empty={true} emptyContent={this.props.emptyContent} />;
    }

    renderLoading() {
        const loadingWrapperCls = `${prefixcls}-loading-wrapper`;
        return (
            <div className={loadingWrapperCls}>
                <Spin />
            </div>
        );
    }

    renderOption(option: OptionProps, optionIndex: number, style?: React.CSSProperties) {
        const { focusIndex, inputValue } = this.state;
        const { renderOptionItem } = this.props;
        let optionContent;
        const isFocused = optionIndex === focusIndex;
        let optionStyle = style || {};
        if (option.style) {
            optionStyle = { ...optionStyle, ...option.style };
        }
        if (option._inputCreateOnly) {
            optionContent = this.renderCreateOption(option, isFocused, optionIndex, style);
        } else {
            // use another name to make sure that 'key' in optionList still exist when we call onChange
            if ('key' in option) {
                option._keyInOptionList = option.key;
            }
            optionContent = (
                <Option
                    showTick
                    {...option}
                    selected={option._selected}
                    onSelect={(v: OptionProps, e: MouseEvent) => this.onSelect(v, optionIndex, e)}
                    focused={isFocused}
                    onMouseEnter={() => this.onOptionHover(optionIndex)}
                    style={optionStyle}
                    key={option.key || option.label as string + option.value as string + optionIndex}
                    renderOptionItem={renderOptionItem}
                    inputValue={inputValue}
                >
                    {option.label}
                </Option>
            );
        }
        return optionContent;
    }

    renderCreateOption(option: OptionProps, isFocused: boolean, optionIndex: number, style: React.CSSProperties) {
        const { renderCreateItem } = this.props;
        // default render method
        if (typeof renderCreateItem === 'undefined') {
            const defaultCreateItem = (
                <Option
                    key={option.key || option.label as string + option.value as string}
                    onSelect={(v: OptionProps, e: MouseEvent) => this.onSelect(v, optionIndex, e)}
                    onMouseEnter={() => this.onOptionHover(optionIndex)}
                    showTick
                    {...option}
                    focused={isFocused}
                    style={style}
                >
                    <LocaleConsumer<Locale['Select']> componentName="Select" >
                        {(locale: Locale['Select']) => (
                            <>
                                <span className={`${prefixcls}-create-tips`}>{locale.createText}</span>
                                {option.value}
                            </>
                        )}
                    </LocaleConsumer>
                </Option>
            );
            return defaultCreateItem;
        }

        const customCreateItem = renderCreateItem(option.value, isFocused);

        return (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/interactive-supports-focus
            <div
                role="button"
                aria-label="Use the input box to create an optional item"
                onClick={e => this.onSelect(option, optionIndex, e)}
                key={option.key || option.label}
            >
                {customCreateItem}
            </div>
        );
    }

    onOptionHover(optionIndex: number) {
        this.foundation.handleOptionMouseEnter(optionIndex);
    }

    renderWithGroup(visibleOptions: OptionProps[]) {
        const content: JSX.Element[] = [];
        const groupStatus = new Map();

        visibleOptions.forEach((option, optionIndex) => {
            const parentGroup = option._parentGroup;
            const optionContent = this.renderOption(option, optionIndex);
            if (parentGroup && !groupStatus.has(parentGroup.label)) {
                // when use with OptionGroup and group content not already insert
                const groupContent = <OptionGroup {...parentGroup} key={parentGroup.label} />;
                groupStatus.set(parentGroup.label, true);
                content.push(groupContent);
            }
            content.push(optionContent);
        });

        return content;
    }

    renderVirtualizeList(visibleOptions: OptionProps[]) {
        const { virtualize } = this.props;
        const { direction } = this.context;
        const { height, width, itemSize } = virtualize;

        return (
            <List
                ref={this.virtualizeListRef}
                height={height || numbers.LIST_HEIGHT}
                itemCount={visibleOptions.length}
                itemSize={itemSize}
                itemData={{ visibleOptions, renderOption: this.renderOption }}
                width={width || '100%'}
                style={{ direction }}
            >
                {VirtualRow}
            </List>
        );
    }

    renderOptions(children?: React.ReactNode) {
        const { dropdownMinWidth, options, selections } = this.state;
        const {
            maxHeight,
            dropdownClassName,
            dropdownStyle,
            outerTopSlot,
            innerTopSlot,
            outerBottomSlot,
            innerBottomSlot,
            loading,
            virtualize,
            multiple,
        } = this.props;

        // Do a filter first, instead of directly judging in forEach, so that the focusIndex can correspond to
        const visibleOptions = options.filter(item => item._show);

        let listContent: JSX.Element | JSX.Element[] = this.renderWithGroup(visibleOptions);
        if (virtualize) {
            listContent = this.renderVirtualizeList(visibleOptions);
        }

        const style = { minWidth: dropdownMinWidth, ...dropdownStyle };

        const optionListCls = cls({
            [`${prefixcls}-option-list`]: true,
            [`${prefixcls}-option-list-chosen`]: selections.size,
        });

        const isEmpty = !options.length || !options.some(item => item._show);
        return (
            <div id={`${prefixcls}-${this.selectOptionListID}`} className={dropdownClassName} style={style}>
                {outerTopSlot}
                <div
                    style={{ maxHeight: `${maxHeight}px` }}
                    className={optionListCls}
                    role="listbox"
                    aria-multiselectable={multiple}
                    onScroll={e => this.foundation.handleListScroll(e)}
                >
                    {innerTopSlot}
                    {!loading ? listContent : this.renderLoading()}
                    {isEmpty && !loading ? this.renderEmpty() : null}
                    {innerBottomSlot}
                </div>
                {outerBottomSlot}
            </div>
        );
    }

    renderSingleSelection(selections: Map<OptionProps['label'], any>, filterable: boolean) {
        let { renderSelectedItem } = this.props;
        const { placeholder } = this.props;
        const { showInput, inputValue } = this.state;
        let renderText: React.ReactNode = '';

        const selectedItems = [...selections];

        if (typeof renderSelectedItem === 'undefined') {
            renderSelectedItem = ((optionNode: OptionProps) => optionNode.label) as RenderSelectedItemFn;
        }

        if (selectedItems.length) {
            const selectedItem = selectedItems[0][1];
            renderText = (renderSelectedItem as RenderSingleSelectedItemFn)(selectedItem);
        }

        const spanCls = cls({
            [`${prefixcls}-selection-text`]: true,
            [`${prefixcls}-selection-placeholder`]: !renderText && renderText !== 0,
            [`${prefixcls}-selection-text-hide`]: inputValue && showInput, // show Input
            [`${prefixcls}-selection-text-inactive`]: !inputValue && showInput, // Stack Input & RenderText(opacity 0.4)
        });

        const contentWrapperCls = `${prefixcls}-content-wrapper`;
        return (
            <>
                <div className={contentWrapperCls}>
                    {<span className={spanCls}>{renderText || renderText === 0 ? renderText : placeholder}</span>}
                    {filterable && showInput ? this.renderInput() : null}
                </div>
            </>
        );
    }

    renderMultipleSelection(selections: Map<OptionProps['label'], any>, filterable: boolean) {
        let { renderSelectedItem } = this.props;
        const { placeholder, maxTagCount, size } = this.props;
        const { inputValue } = this.state;
        const selectDisabled = this.props.disabled;
        const renderTags = [];

        const selectedItems = [...selections];

        if (typeof renderSelectedItem === 'undefined') {
            renderSelectedItem = (optionNode: OptionProps) => ({
                isRenderInTag: true,
                content: optionNode.label,
            });
        }

        const mapItems = maxTagCount ? selectedItems.slice(0, maxTagCount) : selectedItems; // no need to render rest tag when maxTagCount is setting

        const tags = mapItems.map((item, i) => {
            const label = item[0];
            const { value } = item[1];
            const disabled = item[1].disabled || selectDisabled;
            const onClose = (tagContent: React.ReactNode, e: MouseEvent) => {
                if (e && typeof e.preventDefault === 'function') {
                    e.preventDefault(); // make sure that tag will not hidden immediately in controlled mode
                }
                this.foundation.removeTag({ label, value });
            };
            const { content, isRenderInTag } = (renderSelectedItem as RenderMultipleSelectedItemFn)(item[1], { index: i, disabled, onClose });
            const basic = {
                disabled,
                closable: !disabled,
                onClose,
            };
            if (isRenderInTag) {
                return (
                    <Tag {...basic} color="white" size={size || 'large'} key={value}>
                        {content}
                    </Tag>
                );
            } else {
                return <Fragment key={value}>{content}</Fragment>;
            }
        });

        const contentWrapperCls = cls({
            [`${prefixcls}-content-wrapper`]: true,
            [`${prefixcls}-content-wrapper-one-line`]: maxTagCount,
            [`${prefixcls}-content-wrapper-empty`]: !tags.length,
        });

        const spanCls = cls({
            [`${prefixcls}-selection-text`]: true,
            [`${prefixcls}-selection-placeholder`]: !tags.length,
            [`${prefixcls}-selection-text-hide`]: tags && tags.length,
            // [prefixcls + '-selection-text-inactive']: !inputValue && !tags.length,
        });
        const placeholderText = placeholder && !inputValue ? <span className={spanCls}>{placeholder}</span> : null;
        const n = selectedItems.length > maxTagCount ? maxTagCount : undefined;

        const NotOneLine = !maxTagCount; // Multiple lines (that is, do not set maxTagCount), do not use TagGroup, directly traverse with Tag, otherwise Input cannot follow the correct position

        const tagContent = NotOneLine ? tags : <TagGroup tagList={tags} maxTagCount={n} restCount={maxTagCount ? selectedItems.length - maxTagCount : undefined} size="large" mode="custom" />;

        return (
            <>
                <div className={contentWrapperCls}>
                    {tags && tags.length ? tagContent : placeholderText}
                    {!filterable ? null : this.renderInput()}
                </div>
            </>
        );
    }

    onMouseEnter(e: MouseEvent) {
        this.foundation.handleMouseEnter(e as any);
    }

    onMouseLeave(e: MouseEvent) {
        this.foundation.handleMouseLeave(e as any);
    }

    onKeyPress(e: React.KeyboardEvent) {
        this.foundation.handleKeyPress(e as any);
    }

    /* Processing logic when popover visible changes */
    handlePopoverVisibleChange(status) {
        const { virtualize } = this.props;
        const { selections } = this.state;
        if (!status) {
            return;
        }
        if (virtualize) {
            let minItemIndex = -1;
            selections.forEach(item => {
                const itemIndex = get(item, '_scrollIndex');
                /* When the itemIndex is legal */
                if (isNumber(itemIndex) && itemIndex >= 0) {
                    minItemIndex = minItemIndex !== -1 && minItemIndex < itemIndex
                        ? minItemIndex
                        : itemIndex;
                }
            });
            if (minItemIndex !== -1) {
                try {
                    this.virtualizeListRef.current.scrollToItem(minItemIndex, 'center');
                } catch (error) { }
            }
        } else {
            this.foundation.updateScrollTop();
        }
    }

    renderSuffix() {
        const { suffix } = this.props;
        const suffixWrapperCls = cls({
            [`${prefixcls}-suffix`]: true,
            [`${prefixcls}-suffix-text`]: suffix && isString(suffix),
            [`${prefixcls}-suffix-icon`]: isSemiIcon(suffix),
        });
        return <div className={suffixWrapperCls}>{suffix}</div>;
    }

    renderPrefix() {
        const { prefix, insetLabel, insetLabelId } = this.props;
        const labelNode = (prefix || insetLabel) as React.ReactElement<any, any>;

        const prefixWrapperCls = cls({
            [`${prefixcls}-prefix`]: true,
            [`${prefixcls}-inset-label`]: insetLabel,
            [`${prefixcls}-prefix-text`]: labelNode && isString(labelNode),
            [`${prefixcls}-prefix-icon`]: isSemiIcon(labelNode),
        });

        return <div className={prefixWrapperCls} id={insetLabelId}>{labelNode}</div>;
    }

    renderSelection() {
        const {
            disabled,
            multiple,
            filter,
            style,
            id,
            size,
            className,
            validateStatus,
            showArrow,
            suffix,
            prefix,
            insetLabel,
            placeholder,
            triggerRender,
            arrowIcon,
        } = this.props;

        const { selections, isOpen, keyboardEventSet, inputValue, isHovering, isFocus } = this.state;
        const useCustomTrigger = typeof triggerRender === 'function';
        const filterable = Boolean(filter); // filter（boolean || function）
        const selectionCls = useCustomTrigger ?
            cls(className) :
            cls(prefixcls, className, {
                [`${prefixcls}-open`]: isOpen,
                [`${prefixcls}-focus`]: isFocus,
                [`${prefixcls}-disabled`]: disabled,
                [`${prefixcls}-single`]: !multiple,
                [`${prefixcls}-multiple`]: multiple,
                [`${prefixcls}-filterable`]: filterable,
                [`${prefixcls}-small`]: size === 'small',
                [`${prefixcls}-large`]: size === 'large',
                [`${prefixcls}-error`]: validateStatus === 'error',
                [`${prefixcls}-warning`]: validateStatus === 'warning',
                [`${prefixcls}-no-arrow`]: !showArrow,
                [`${prefixcls}-with-prefix`]: prefix || insetLabel,
                [`${prefixcls}-with-suffix`]: suffix,
            });

        const showClear = this.props.showClear &&
      (selections.size || inputValue) && !disabled && (isHovering || isOpen);

        const arrowContent = showArrow ? (
            <div className={`${prefixcls}-arrow`}>
                {arrowIcon}
            </div>
        ) : (
            <div className={`${prefixcls}-arrow-empty`} />
        );
        const inner = useCustomTrigger ? (
            <Trigger
                value={Array.from(selections.values())}
                inputValue={inputValue}
                onChange={this.handleInputChange}
                onClear={this.onClear}
                disabled={disabled}
                triggerRender={triggerRender}
                placeholder={placeholder as any}
                componentName="Select"
                componentProps={{ ...this.props }}
            />
        ) : (
            [
                <Fragment key="prefix">{prefix || insetLabel ? this.renderPrefix() : null}</Fragment>,
                <Fragment key="selection">
                    <div className={cls(`${prefixcls}-selection`)}>
                        {multiple ?
                            this.renderMultipleSelection(selections, filterable) :
                            this.renderSingleSelection(selections, filterable)}
                    </div>
                </Fragment>,
                <Fragment key="clearicon">
                    {showClear ? (
                        <div
                            role="button"
                            aria-label="Clear selected value"
                            tabIndex={0}
                            className={cls(`${prefixcls}-clear`)}
                            onClick={this.onClear}
                            onKeyPress={this.onClearBtnEnterPress}
                        >
                            <IconClear />
                        </div>
                    ) : arrowContent}
                </Fragment>,
                <Fragment key="suffix">{suffix ? this.renderSuffix() : null}</Fragment>,
            ]
        );

        const tabIndex = disabled ? null : 0;
        return (
            <div
                role="combobox"
                aria-disabled={disabled}
                aria-expanded={isOpen}
                aria-controls={`${prefixcls}-${this.selectOptionListID}`}
                aria-haspopup="listbox"
                aria-label="select value"
                aria-invalid={this.props['aria-invalid']}
                aria-errormessage={this.props['aria-errormessage']}
                aria-labelledby={this.props['aria-labelledby']}
                aria-describedby={this.props['aria-describedby']}
                aria-required={this.props['aria-required']}
                className={selectionCls}
                ref={ref => ((this.triggerRef as any).current = ref)}
                onClick={e => this.foundation.handleClick(e)}
                style={style}
                id={id}
                tabIndex={tabIndex}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                // onFocus={e => this.foundation.handleTriggerFocus(e)}
                onBlur={e => this.foundation.handleTriggerBlur(e as any)}
                onKeyPress={this.onKeyPress}
                {...keyboardEventSet}
            >
                {inner}
            </div>
        );
    }

    render() {
        const { direction } = this.context;
        const defaultPosition = direction === 'rtl' ? 'bottomRight' : 'bottomLeft';
        const {
            children,
            position = defaultPosition,
            zIndex,
            getPopupContainer,
            motion,
            autoAdjustOverflow,
            mouseLeaveDelay,
            mouseEnterDelay,
            spacing,
            stopPropagation,
        } = this.props;
        const { isOpen, optionKey } = this.state;
        const optionList = this.renderOptions(children);
        const selection = this.renderSelection();
        return (
            <Popover
                getPopupContainer={getPopupContainer}
                motion={motion}
                autoAdjustOverflow={autoAdjustOverflow}
                mouseLeaveDelay={mouseLeaveDelay}
                mouseEnterDelay={mouseEnterDelay}
                // transformFromCenter TODO: check no such property
                zIndex={zIndex}
                ref={this.optionsRef}
                content={optionList}
                visible={isOpen}
                trigger="custom"
                rePosKey={optionKey}
                position={position}
                spacing={spacing}
                stopPropagation={stopPropagation}
                onVisibleChange={status => this.handlePopoverVisibleChange(status)}
            >
                {selection}
            </Popover>
        );
    }
}

export default Select;
