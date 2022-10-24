import React, { Fragment, ReactNode, CSSProperties, MouseEvent, KeyboardEvent } from 'react';
import ReactDOM from 'react-dom';
import cls from 'classnames';
import PropTypes from 'prop-types';
import CascaderFoundation, {
    /* Corresponding to the state of react */
    BasicCascaderInnerData,
    /* Corresponding to the props of react */
    BasicCascaderProps,
    BasicTriggerRenderProps,
    BasicScrollPanelProps,
    CascaderAdapter,
    CascaderType
} from '@douyinfe/semi-foundation/cascader/foundation';
import { cssClasses, strings } from '@douyinfe/semi-foundation/cascader/constants';
import { numbers as popoverNumbers } from '@douyinfe/semi-foundation/popover/constants';
import { isSet, isEqual, isString, isEmpty, isFunction, isNumber, noop, flatten } from 'lodash';
import '@douyinfe/semi-foundation/cascader/cascader.scss';
import { IconClear, IconChevronDown } from '@douyinfe/semi-icons';
import { findKeysForValues, convertDataToEntities, calcMergeType } from '@douyinfe/semi-foundation/cascader/util';
import { calcCheckedKeys, normalizeKeyList, calcDisabledKeys } from '@douyinfe/semi-foundation/tree/treeUtil';
import ConfigContext, { ContextValue } from '../configProvider/context';
import BaseComponent, { ValidateStatus } from '../_base/baseComponent';
import Input from '../input/index';
import Popover, { PopoverProps } from '../popover/index';
import Item, { CascaderData, Entities, Entity, Data } from './item';
import Trigger from '../trigger';
import Tag from '../tag';
import TagInput from '../tagInput';
import { isSemiIcon } from '../_utils';
import { Position } from '../tooltip/index';

export type { CascaderType, ShowNextType } from '@douyinfe/semi-foundation/cascader/foundation';
export type { CascaderData, Entity, Data, CascaderItemProps } from './item';

export interface ScrollPanelProps extends BasicScrollPanelProps {
    activeNode: CascaderData
}

export interface TriggerRenderProps extends BasicTriggerRenderProps {
    componentProps: CascaderProps;
    onClear: (e: React.MouseEvent) => void
}

/* The basic type of the value of Cascader */
export type SimpleValueType = string | number | CascaderData;

/* The value of Cascader */
export type Value = SimpleValueType | Array<SimpleValueType> | Array<Array<SimpleValueType>>;

export interface CascaderProps extends BasicCascaderProps {
    'aria-describedby'?: React.AriaAttributes['aria-describedby'];
    'aria-errormessage'?: React.AriaAttributes['aria-errormessage'];
    'aria-invalid'?: React.AriaAttributes['aria-invalid'];
    'aria-labelledby'?: React.AriaAttributes['aria-labelledby'];
    'aria-required'?: React.AriaAttributes['aria-required'];
    'aria-label'?: React.AriaAttributes['aria-label'];
    arrowIcon?: ReactNode;
    defaultValue?: Value;
    dropdownStyle?: CSSProperties;
    emptyContent?: ReactNode;
    motion?: boolean;
    treeData?: Array<CascaderData>;
    restTagsPopoverProps?: PopoverProps;
    children?: React.ReactNode;
    value?: Value;
    prefix?: ReactNode;
    suffix?: ReactNode;
    id?: string;
    insetLabel?: ReactNode;
    insetLabelId?: string;
    style?: CSSProperties;
    bottomSlot?: ReactNode;
    topSlot?: ReactNode;
    triggerRender?: (props: TriggerRenderProps) => ReactNode;
    onListScroll?: (e: React.UIEvent<HTMLUListElement, UIEvent>, panel: ScrollPanelProps) => void;
    loadData?: (selectOptions: CascaderData[]) => Promise<void>;
    onLoad?: (newLoadedKeys: Set<string>, data: CascaderData) => void;
    onChange?: (value: Value) => void;
    onExceed?: (checkedItem: Entity[]) => void;
    displayRender?: (selected: Array<string> | Entity, idx?: number) => ReactNode;
    onBlur?: (e: MouseEvent) => void;
    onFocus?: (e: MouseEvent) => void;
    validateStatus?: ValidateStatus;
    position?: Position
}

export interface CascaderState extends BasicCascaderInnerData {
    keyEntities: Entities;
    prevProps: CascaderProps;
    treeData?: Array<CascaderData>
}

const prefixcls = cssClasses.PREFIX;
const resetkey = 0;

class Cascader extends BaseComponent<CascaderProps, CascaderState> {
    static contextType = ConfigContext;
    static propTypes = {
        'aria-labelledby': PropTypes.string,
        'aria-invalid': PropTypes.bool,
        'aria-errormessage': PropTypes.string,
        'aria-describedby': PropTypes.string,
        'aria-required': PropTypes.bool,
        'aria-label': PropTypes.string,
        arrowIcon: PropTypes.node,
        changeOnSelect: PropTypes.bool,
        defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        disabled: PropTypes.bool,
        dropdownClassName: PropTypes.string,
        dropdownStyle: PropTypes.object,
        emptyContent: PropTypes.node,
        motion: PropTypes.bool,
        /* show search input, if passed in a function, used as custom filter */
        filterTreeNode: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
        filterLeafOnly: PropTypes.bool,
        placeholder: PropTypes.string,
        searchPlaceholder: PropTypes.string,
        size: PropTypes.oneOf<CascaderType>(strings.SIZE_SET),
        style: PropTypes.object,
        className: PropTypes.string,
        treeData: PropTypes.arrayOf(
            PropTypes.shape({
                value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                label: PropTypes.any,
            })
        ),
        treeNodeFilterProp: PropTypes.string,
        suffix: PropTypes.node,
        prefix: PropTypes.node,
        insetLabel: PropTypes.node,
        insetLabelId: PropTypes.string,
        id: PropTypes.string,
        displayProp: PropTypes.string,
        displayRender: PropTypes.func,
        onChange: PropTypes.func,
        onSearch: PropTypes.func,
        onSelect: PropTypes.func,
        onBlur: PropTypes.func,
        onFocus: PropTypes.func,
        children: PropTypes.node,
        getPopupContainer: PropTypes.func,
        zIndex: PropTypes.number,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
        validateStatus: PropTypes.oneOf<CascaderProps['validateStatus']>(strings.VALIDATE_STATUS),
        showNext: PropTypes.oneOf([strings.SHOW_NEXT_BY_CLICK, strings.SHOW_NEXT_BY_HOVER]),
        stopPropagation: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
        showClear: PropTypes.bool,
        defaultOpen: PropTypes.bool,
        autoAdjustOverflow: PropTypes.bool,
        onDropdownVisibleChange: PropTypes.func,
        triggerRender: PropTypes.func,
        onListScroll: PropTypes.func,
        onChangeWithObject: PropTypes.bool,
        bottomSlot: PropTypes.node,
        topSlot: PropTypes.node,
        multiple: PropTypes.bool,
        autoMergeValue: PropTypes.bool,
        maxTagCount: PropTypes.number,
        showRestTagsPopover: PropTypes.bool,
        restTagsPopoverProps: PropTypes.object,
        max: PropTypes.number,
        separator: PropTypes.string,
        onExceed: PropTypes.func,
        onClear: PropTypes.func,
        loadData: PropTypes.func,
        onLoad: PropTypes.func,
        loadedKeys: PropTypes.array,
        disableStrictly: PropTypes.bool,
        leafOnly: PropTypes.bool,
        enableLeafClick: PropTypes.bool,
        preventScroll: PropTypes.bool,
        position: PropTypes.string
    };

    static defaultProps = {
        leafOnly: false,
        arrowIcon: <IconChevronDown />,
        stopPropagation: true,
        motion: true,
        defaultOpen: false,
        zIndex: popoverNumbers.DEFAULT_Z_INDEX,
        showClear: false,
        autoClearSearchValue: true,
        changeOnSelect: false,
        disableStrictly: false,
        autoMergeValue: true,
        multiple: false,
        filterTreeNode: false,
        filterLeafOnly: true,
        showRestTagsPopover: false,
        restTagsPopoverProps: {},
        separator: ' / ',
        size: 'default' as const,
        treeNodeFilterProp: 'label' as const,
        displayProp: 'label' as const,
        treeData: [] as Array<CascaderData>,
        showNext: strings.SHOW_NEXT_BY_CLICK,
        onExceed: noop,
        onClear: noop,
        onDropdownVisibleChange: noop,
        onListScroll: noop,
        enableLeafClick: false,
        'aria-label': 'Cascader',
    };

    options: any;
    isEmpty: boolean;
    inputRef: React.RefObject<typeof Input>;
    triggerRef: React.RefObject<HTMLDivElement>;
    optionsRef: React.RefObject<any>;
    clickOutsideHandler: any;
    mergeType: string;
    context: ContextValue;

    constructor(props: CascaderProps) {
        super(props);
        this.state = {
            disabledKeys: new Set(),
            isOpen: props.defaultOpen,
            /* By changing rePosKey, the dropdown position can be refreshed */
            rePosKey: resetkey,
            /* A data structure for storing cascader data items */
            keyEntities: {},
            /* Selected and show tick icon */
            selectedKeys: new Set([]),
            /* The key of the activated node */
            activeKeys: new Set([]),
            /* The key of the filtered node */
            filteredKeys: new Set([]),
            /* Value of input box */
            inputValue: '',
            /* Is searching */
            isSearching: false,
            /* The placeholder of input box */
            inputPlaceHolder: props.searchPlaceholder || props.placeholder,
            /* Cache props */
            prevProps: {},
            /* Is hovering */
            isHovering: false,
            /* Key of checked node, when multiple */
            checkedKeys: new Set([]),
            /* Key of half checked node, when multiple */
            halfCheckedKeys: new Set([]),
            /* Auto merged checkedKeys or leaf checkedKeys, when multiple */
            resolvedCheckedKeys: new Set([]),
            /* Keys of loaded item */
            loadedKeys: new Set(),
            /* Keys of loading item */
            loadingKeys: new Set(),
            /* Mark whether this rendering has triggered asynchronous loading of data */
            loading: false,
            showInput: false,
        };
        this.options = {};
        this.isEmpty = false;
        this.mergeType = calcMergeType(props.autoMergeValue, props.leafOnly);
        this.inputRef = React.createRef();
        this.triggerRef = React.createRef();
        this.optionsRef = React.createRef();
        this.clickOutsideHandler = null;
        this.foundation = new CascaderFoundation(this.adapter);
    }

    get adapter(): CascaderAdapter {
        const filterAdapter: Pick<CascaderAdapter, 'updateInputValue' | 'updateInputPlaceHolder' | 'focusInput'> = {
            updateInputValue: value => {
                this.setState({ inputValue: value });
            },
            updateInputPlaceHolder: value => {
                this.setState({ inputPlaceHolder: value });
            },
            focusInput: () => {
                const { preventScroll } = this.props;
                if (this.inputRef && this.inputRef.current) {
                    // TODO: check the reason
                    (this.inputRef.current as any).focus({ preventScroll });
                }
            },
        };
        const cascaderAdapter: Pick<
        CascaderAdapter,
        'registerClickOutsideHandler' | 'unregisterClickOutsideHandler' | 'rePositionDropdown'
        > = {
            registerClickOutsideHandler: cb => {
                const clickOutsideHandler = (e: Event) => {
                    const optionInstance = this.optionsRef && this.optionsRef.current;
                    const triggerDom = this.triggerRef && this.triggerRef.current;
                    const optionsDom = ReactDOM.findDOMNode(optionInstance);
                    const target = e.target as Element;
                    if (
                        optionsDom &&
                        (!optionsDom.contains(target) || !optionsDom.contains(target.parentNode)) &&
                        triggerDom &&
                        !triggerDom.contains(target)
                    ) {
                        cb(e);
                    }
                };
                this.clickOutsideHandler = clickOutsideHandler;
                document.addEventListener('mousedown', clickOutsideHandler, false);
            },
            unregisterClickOutsideHandler: () => {
                document.removeEventListener('mousedown', this.clickOutsideHandler, false);
            },
            rePositionDropdown: () => {
                let { rePosKey } = this.state;
                rePosKey = rePosKey + 1;
                this.setState({ rePosKey });
            },
        };
        return {
            ...super.adapter,
            ...filterAdapter,
            ...cascaderAdapter,
            updateStates: states => {
                this.setState({ ...states } as CascaderState);
            },
            openMenu: () => {
                this.setState({ isOpen: true });
            },
            closeMenu: cb => {
                this.setState({ isOpen: false }, () => {
                    cb && cb();
                });
            },
            updateSelection: selectedKeys => this.setState({ selectedKeys }),
            notifyChange: value => {
                this.props.onChange && this.props.onChange(value);
            },
            notifySelect: selected => {
                this.props.onSelect && this.props.onSelect(selected);
            },
            notifyOnSearch: input => {
                this.props.onSearch && this.props.onSearch(input);
            },
            notifyFocus: (...v) => {
                this.props.onFocus && this.props.onFocus(...v);
            },
            notifyBlur: (...v) => {
                this.props.onBlur && this.props.onBlur(...v);
            },
            notifyDropdownVisibleChange: visible => {
                this.props.onDropdownVisibleChange(visible);
            },
            toggleHovering: bool => {
                this.setState({ isHovering: bool });
            },
            notifyLoadData: (selectedOpt, callback) => {
                const { loadData } = this.props;
                if (loadData) {
                    new Promise<void>(resolve => {
                        loadData(selectedOpt).then(() => {
                            callback();
                            this.setState({ loading: false });
                            resolve();
                        });
                    });
                }
            },
            notifyOnLoad: (newLoadedKeys, data) => {
                const { onLoad } = this.props;
                onLoad && onLoad(newLoadedKeys, data);
            },
            notifyListScroll: (e, { panelIndex, activeNode }) => {
                this.props.onListScroll(e, { panelIndex, activeNode });
            },
            notifyOnExceed: data => this.props.onExceed(data),
            notifyClear: () => this.props.onClear(),
            toggleInputShow: (showInput: boolean, cb: (...args: any) => void) => {
                this.setState({ showInput }, () => {
                    cb();
                });
            },
            updateFocusState: (isFocus: boolean) => {
                this.setState({ isFocus });
            },
        };
    }

    static getDerivedStateFromProps(props: CascaderProps, prevState: CascaderState) {
        const { multiple, value, defaultValue, onChangeWithObject, leafOnly, autoMergeValue } = props;
        const { prevProps } = prevState;
        let keyEntities = prevState.keyEntities || {};
        const newState: Partial<CascaderState> = {};
        const needUpdate = (name: string) => {
            const firstInProps = isEmpty(prevProps) && name in props;
            const nameHasChange = prevProps && !isEqual(prevProps[name], props[name]);
            return firstInProps || nameHasChange;
        };
        const needUpdateData = () => {
            const firstInProps = !prevProps && 'treeData' in props;
            const treeDataHasChange = prevProps && prevProps.treeData !== props.treeData;
            return firstInProps || treeDataHasChange;
        };
        const getRealKeys = (realValue: Value, keyEntities: Entities) => {
            // normallizedValue is used to save the value in two-dimensional array format
            let normallizedValue: SimpleValueType[][] = [];
            if (Array.isArray(realValue)) {
                normallizedValue = Array.isArray(realValue[0])
                    ? (realValue as SimpleValueType[][])
                    : ([realValue] as SimpleValueType[][]);
            } else {
                if (realValue !== undefined) {
                    normallizedValue = [[realValue]];
                }
            }
            // formatValuePath is used to save value of valuePath
            const formatValuePath: (string | number)[][] = [];
            normallizedValue.forEach((valueItem: SimpleValueType[]) => {
                const formatItem: (string | number)[] = onChangeWithObject ?
                    (valueItem as CascaderData[]).map(i => i?.value) :
                    valueItem as (string | number)[];
                formatValuePath.push(formatItem);
            });
            // formatKeys is used to save key of value
            const formatKeys: any[] = [];
            formatValuePath.forEach(v => {
                const formatKeyItem = findKeysForValues(v, keyEntities);
                !isEmpty(formatKeyItem) && formatKeys.push(formatKeyItem);
            });
            return formatKeys;
        };
        const needUpdateTreeData = needUpdate('treeData') || needUpdateData();
        const needUpdateValue = needUpdate('value') || (isEmpty(prevProps) && defaultValue);
        if (multiple) {
            // when value and treedata need updated
            if (needUpdateTreeData || needUpdateValue) {
                // update state.keyEntities
                if (needUpdateTreeData) {
                    newState.treeData = props.treeData;
                    keyEntities = convertDataToEntities(props.treeData);
                    newState.keyEntities = keyEntities;
                }
                let realKeys: Array<string> | Set<string> = prevState.checkedKeys;
                // when data was updated
                if (needUpdateValue) {
                    const realValue = needUpdate('value') ? value : defaultValue;
                    realKeys = getRealKeys(realValue, keyEntities);
                } else {
                    // needUpdateValue is false
                    // if treeData is updated & Cascader is controlled, realKeys should be recalculated
                    if (needUpdateTreeData && 'value' in props) {
                        const realValue = value;
                        realKeys = getRealKeys(realValue, keyEntities);
                    }
                }
                if (isSet(realKeys)) {
                    realKeys = [...realKeys];
                }
                const calRes = calcCheckedKeys(flatten(realKeys), keyEntities);
                const checkedKeys = new Set(calRes.checkedKeys);
                const halfCheckedKeys = new Set(calRes.halfCheckedKeys);
                // disableStrictly
                if (props.disableStrictly) {
                    newState.disabledKeys = calcDisabledKeys(keyEntities);
                }
                const isLeafOnlyMerge = calcMergeType(autoMergeValue, leafOnly) === strings.LEAF_ONLY_MERGE_TYPE;
                newState.prevProps = props;
                newState.checkedKeys = checkedKeys;
                newState.halfCheckedKeys = halfCheckedKeys;
                newState.resolvedCheckedKeys = new Set(normalizeKeyList(checkedKeys, keyEntities, isLeafOnlyMerge));
            }
        }
        return newState;
    }

    componentDidMount() {
        this.foundation.init();
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    componentDidUpdate(prevProps: CascaderProps) {
        let isOptionsChanged = false;
        if (!isEqual(prevProps.treeData, this.props.treeData)) {
            isOptionsChanged = true;
            this.foundation.collectOptions();
        }
        if (prevProps.value !== this.props.value && !isOptionsChanged) {
            this.foundation.handleValueChange(this.props.value);
        }
    }

    handleInputChange = (value: string) => {
        this.foundation.handleInputChange(value);
    };

    handleTagRemove = (e: any, tagValuePath: Array<string | number>) => {
        this.foundation.handleTagRemove(e, tagValuePath);
    };

    renderTagItem = (value: string | Array<string>, idx: number, type: string) => {
        const { keyEntities, disabledKeys } = this.state;
        const { size, disabled, displayProp, displayRender, disableStrictly } = this.props;
        const nodeKey = type === strings.IS_VALUE ? findKeysForValues(value, keyEntities)[0] : value;
        const isDsiabled =
            disabled || keyEntities[nodeKey].data.disabled || (disableStrictly && disabledKeys.has(nodeKey));
        if (!isEmpty(keyEntities) && !isEmpty(keyEntities[nodeKey])) {
            const tagCls = cls(`${prefixcls}-selection-tag`, {
                [`${prefixcls}-selection-tag-disabled`]: isDsiabled,
            });
            // custom render tags
            if (isFunction(displayRender)) {
                return displayRender(keyEntities[nodeKey], idx);
                // default render tags
            } else {
                return (
                    <Tag
                        size={size === 'default' ? 'large' : size}
                        key={`tag-${nodeKey}-${idx}`}
                        color="white"
                        className={tagCls}
                        closable
                        onClose={(tagChildren, e) => {
                            // When value has not changed, prevent clicking tag closeBtn to close tag
                            e.preventDefault();
                            this.handleTagRemove(e, keyEntities[nodeKey].valuePath);
                        }}
                    >
                        {keyEntities[nodeKey].data[displayProp]}
                    </Tag>
                );
            }
        }
        return null;
    };

    renderTagInput() {
        const { size, disabled, placeholder, maxTagCount, showRestTagsPopover, restTagsPopoverProps } = this.props;
        const { inputValue, checkedKeys, keyEntities, resolvedCheckedKeys } = this.state;
        const tagInputcls = cls(`${prefixcls}-tagInput-wrapper`);
        const tagValue: Array<Array<string>> = [];
        const realKeys = this.mergeType === strings.NONE_MERGE_TYPE ? checkedKeys : resolvedCheckedKeys;
        [...realKeys].forEach(checkedKey => {
            if (!isEmpty(keyEntities[checkedKey])) {
                tagValue.push(keyEntities[checkedKey].valuePath);
            }
        });
        return (
            <TagInput
                className={tagInputcls}
                ref={this.inputRef as any}
                disabled={disabled}
                size={size}
                // TODO Modify logic, not modify type
                value={(tagValue as unknown) as string[]}
                showRestTagsPopover={showRestTagsPopover}
                restTagsPopoverProps={restTagsPopoverProps}
                maxTagCount={maxTagCount}
                renderTagItem={(value, index) => this.renderTagItem(value, index, strings.IS_VALUE)}
                inputValue={inputValue}
                onInputChange={this.handleInputChange}
                // TODO Modify logic, not modify type
                onRemove={v => this.handleTagRemove(null, (v as unknown) as (string | number)[])}
                placeholder={placeholder}
            />
        );
    }

    renderInput() {
        const { size, disabled } = this.props;
        const inputcls = cls(`${prefixcls}-input`);
        const { inputValue, inputPlaceHolder, showInput } = this.state;
        const inputProps = {
            disabled,
            value: inputValue,
            className: inputcls,
            onChange: this.handleInputChange,
        };
        const wrappercls = cls({
            [`${prefixcls}-search-wrapper`]: true,
        });

        const displayText = this.renderDisplayText();
        const spanCls = cls({
            [`${prefixcls}-selection-placeholder`]: !displayText,
            [`${prefixcls}-selection-text-hide`]: showInput && inputValue,
            [`${prefixcls}-selection-text-inactive`]: showInput && !inputValue,
        });

        return (
            <div className={wrappercls}>
                <span className={spanCls}>{displayText ? displayText : inputPlaceHolder}</span>
                {showInput && <Input ref={this.inputRef as any} size={size} {...inputProps} />}
            </div>
        );
    }

    handleItemClick = (e: MouseEvent | KeyboardEvent, item: Entity | Data) => {
        this.foundation.handleItemClick(e, item);
    };

    handleItemHover = (e: MouseEvent, item: Entity) => {
        this.foundation.handleItemHover(e, item);
    };

    onItemCheckboxClick = (item: Entity | Data) => {
        this.foundation.onItemCheckboxClick(item);
    };

    handleListScroll = (e: React.UIEvent<HTMLUListElement, UIEvent>, ind: number) => {
        this.foundation.handleListScroll(e, ind);
    };

    renderContent = () => {
        const {
            inputValue,
            isSearching,
            activeKeys,
            selectedKeys,
            checkedKeys,
            halfCheckedKeys,
            loadedKeys,
            loadingKeys,
        } = this.state;
        const {
            filterTreeNode,
            dropdownClassName,
            dropdownStyle,
            loadData,
            emptyContent,
            separator,
            topSlot,
            bottomSlot,
            showNext,
            multiple,
        } = this.props;
        const searchable = Boolean(filterTreeNode) && isSearching;
        const popoverCls = cls(dropdownClassName, `${prefixcls}-popover`);
        const renderData = this.foundation.getRenderData();
        const content = (
            <div className={popoverCls} role="listbox" style={dropdownStyle}>
                {topSlot}
                <Item
                    activeKeys={activeKeys}
                    selectedKeys={selectedKeys}
                    separator={separator}
                    loadedKeys={loadedKeys}
                    loadingKeys={loadingKeys}
                    onItemClick={this.handleItemClick}
                    onItemHover={this.handleItemHover}
                    showNext={showNext}
                    onItemCheckboxClick={this.onItemCheckboxClick}
                    onListScroll={this.handleListScroll}
                    searchable={searchable}
                    keyword={inputValue}
                    emptyContent={emptyContent}
                    loadData={loadData}
                    data={renderData}
                    multiple={multiple}
                    checkedKeys={checkedKeys}
                    halfCheckedKeys={halfCheckedKeys}
                />
                {bottomSlot}
            </div>
        );
        return content;
    };

    renderPlusN = (hiddenTag: Array<ReactNode>) => {
        const { disabled, showRestTagsPopover, restTagsPopoverProps } = this.props;
        const plusNCls = cls(`${prefixcls}-selection-n`, {
            [`${prefixcls}-selection-n-disabled`]: disabled,
        });
        const renderPlusNChildren = <span className={plusNCls}>+{hiddenTag.length}</span>;
        return showRestTagsPopover && !disabled ? (
            <Popover
                content={hiddenTag}
                showArrow
                trigger="hover"
                position="top"
                autoAdjustOverflow
                {...restTagsPopoverProps}
            >
                {renderPlusNChildren}
            </Popover>
        ) : (
            renderPlusNChildren
        );
    };

    renderMultipleTags = () => {
        const { autoMergeValue, maxTagCount } = this.props;
        const { checkedKeys, resolvedCheckedKeys } = this.state;
        const realKeys = this.mergeType === strings.NONE_MERGE_TYPE ? checkedKeys : resolvedCheckedKeys;
        const displayTag: Array<ReactNode> = [];
        const hiddenTag: Array<ReactNode> = [];
        [...realKeys].forEach((checkedKey, idx) => {
            const notExceedMaxTagCount = !isNumber(maxTagCount) || maxTagCount >= idx + 1;
            const item = this.renderTagItem(checkedKey, idx, strings.IS_KEY);
            if (notExceedMaxTagCount) {
                displayTag.push(item);
            } else {
                hiddenTag.push(item);
            }
        });
        return (
            <>
                {displayTag}
                {!isEmpty(hiddenTag) && this.renderPlusN(hiddenTag)}
            </>
        );
    };

    renderDisplayText = (): ReactNode => {
        const { displayProp, separator, displayRender } = this.props;
        const { selectedKeys } = this.state;
        let displayText: ReactNode = '';
        if (selectedKeys.size) {
            const displayPath = this.foundation.getItemPropPath([...selectedKeys][0], displayProp);
            if (displayRender && typeof displayRender === 'function') {
                displayText = displayRender(displayPath);
            } else {
                displayText = displayPath.map((path: ReactNode, index: number) => (
                    <Fragment key={`${path}-${index}`}>
                        {index < displayPath.length - 1 ? (
                            <>
                                {path}
                                {separator}
                            </>
                        ) : (
                            path
                        )}
                    </Fragment>
                ));
            }
        }
        return displayText;
    };

    renderSelectContent = () => {
        const { placeholder, filterTreeNode, multiple } = this.props;
        const { checkedKeys } = this.state;
        const searchable = Boolean(filterTreeNode);
        if (!searchable) {
            if (multiple) {
                if (isEmpty(checkedKeys)) {
                    return <span className={`${prefixcls}-selection-placeholder`}>{placeholder}</span>;
                }
                return this.renderMultipleTags();
            } else {
                const displayText = this.renderDisplayText();
                const spanCls = cls({
                    [`${prefixcls}-selection-placeholder`]: !displayText,
                });
                return <span className={spanCls}>{displayText ? displayText : placeholder}</span>;
            }
        }
        const input = multiple ? this.renderTagInput() : this.renderInput();
        return input;
    };

    renderSuffix = () => {
        const { suffix }: any = this.props;
        const suffixWrapperCls = cls({
            [`${prefixcls}-suffix`]: true,
            [`${prefixcls}-suffix-text`]: suffix && isString(suffix),
            [`${prefixcls}-suffix-icon`]: isSemiIcon(suffix),
        });
        return (
            <div className={suffixWrapperCls} x-semi-prop="suffix">
                {suffix}
            </div>
        );
    };

    renderPrefix = () => {
        const { prefix, insetLabel, insetLabelId } = this.props;
        const labelNode: any = prefix || insetLabel;

        const prefixWrapperCls = cls({
            [`${prefixcls}-prefix`]: true,
            // to be doublechecked
            [`${prefixcls}-inset-label`]: insetLabel,
            [`${prefixcls}-prefix-text`]: labelNode && isString(labelNode),
            [`${prefixcls}-prefix-icon`]: isSemiIcon(labelNode),
        });

        return (
            <div className={prefixWrapperCls} id={insetLabelId} x-semi-prop="prefix,insetLabel">
                {labelNode}
            </div>
        );
    };

    renderCustomTrigger = () => {
        const { disabled, triggerRender, multiple } = this.props;
        const { selectedKeys, inputValue, inputPlaceHolder, resolvedCheckedKeys, checkedKeys } = this.state;
        let realValue;
        if (multiple) {
            if (this.mergeType === strings.NONE_MERGE_TYPE) {
                realValue = checkedKeys;
            } else {
                realValue = resolvedCheckedKeys;
            }
        } else {
            realValue = [...selectedKeys][0];
        }
        return (
            <Trigger
                value={realValue}
                inputValue={inputValue}
                onChange={this.handleInputChange}
                onClear={this.handleClear}
                placeholder={inputPlaceHolder}
                disabled={disabled}
                triggerRender={triggerRender}
                componentName={'Cascader'}
                componentProps={{ ...this.props }}
            />
        );
    };

    handleMouseOver = () => {
        this.foundation.toggleHoverState(true);
    };

    handleMouseLeave = () => {
        this.foundation.toggleHoverState(false);
    };

    handleClear = (e: MouseEvent) => {
        e && e.stopPropagation();
        this.foundation.handleClear();
    };

    /**
     * A11y: simulate clear button click
     */
    /* istanbul ignore next */
    handleClearEnterPress = (e: KeyboardEvent) => {
        e && e.stopPropagation();
        this.foundation.handleClearEnterPress(e);
    };

    showClearBtn = () => {
        const { showClear, disabled, multiple } = this.props;
        const { selectedKeys, isOpen, isHovering, checkedKeys } = this.state;
        const hasValue = selectedKeys.size;
        const multipleWithHaveValue = multiple && checkedKeys.size;
        return showClear && (hasValue || multipleWithHaveValue) && !disabled && (isOpen || isHovering);
    };

    renderClearBtn = () => {
        const clearCls = cls(`${prefixcls}-clearbtn`);
        const allowClear = this.showClearBtn();
        if (allowClear) {
            return (
                <div
                    className={clearCls}
                    onClick={this.handleClear}
                    onKeyPress={this.handleClearEnterPress}
                    role="button"
                    tabIndex={0}
                >
                    <IconClear />
                </div>
            );
        }
        return null;
    };

    renderArrow = () => {
        const { arrowIcon } = this.props;
        const showClearBtn = this.showClearBtn();
        if (showClearBtn) {
            return null;
        }
        return arrowIcon ? (
            <div className={cls(`${prefixcls}-arrow`)} x-semi-prop="arrowIcon">
                {arrowIcon}
            </div>
        ) : null;
    };

    renderSelection = () => {
        const {
            disabled,
            multiple,
            filterTreeNode,
            style,
            size,
            className,
            validateStatus,
            prefix,
            suffix,
            insetLabel,
            triggerRender,
            showClear,
            id,
        } = this.props;
        const { isOpen, isFocus, isInput, checkedKeys } = this.state;
        const filterable = Boolean(filterTreeNode);
        const useCustomTrigger = typeof triggerRender === 'function';
        const classNames = useCustomTrigger ?
            cls(className) :
            cls(prefixcls, className, {
                [`${prefixcls}-focus`]: isFocus || (isOpen && !isInput),
                [`${prefixcls}-disabled`]: disabled,
                [`${prefixcls}-single`]: true,
                [`${prefixcls}-filterable`]: filterable,
                [`${prefixcls}-error`]: validateStatus === 'error',
                [`${prefixcls}-warning`]: validateStatus === 'warning',
                [`${prefixcls}-small`]: size === 'small',
                [`${prefixcls}-large`]: size === 'large',
                [`${prefixcls}-with-prefix`]: prefix || insetLabel,
                [`${prefixcls}-with-suffix`]: suffix,
            });
        const mouseEvent = showClear ?
            {
                onMouseEnter: () => this.handleMouseOver(),
                onMouseLeave: () => this.handleMouseLeave(),
            } :
            {};
        const sectionCls = cls(`${prefixcls}-selection`, {
            [`${prefixcls}-selection-multiple`]: multiple && !isEmpty(checkedKeys),
        });
        const inner = useCustomTrigger
            ? this.renderCustomTrigger()
            : [
                <Fragment key={'prefix'}>{prefix || insetLabel ? this.renderPrefix() : null}</Fragment>,
                <Fragment key={'selection'}>
                    <div className={sectionCls}>{this.renderSelectContent()}</div>
                </Fragment>,
                <Fragment key={'clearbtn'}>{this.renderClearBtn()}</Fragment>,
                <Fragment key={'suffix'}>{suffix ? this.renderSuffix() : null}</Fragment>,
                <Fragment key={'arrow'}>{this.renderArrow()}</Fragment>,
            ];
        /**
         * Reasons for disabling the a11y eslint rule:
         * The following attributes(aria-controls,aria-expanded) will be automatically added by Tooltip, no need to declare here
         */
        return (
            <div
                className={classNames}
                style={style}
                ref={this.triggerRef}
                onClick={e => this.foundation.handleClick(e)}
                onKeyPress={e => this.foundation.handleSelectionEnterPress(e)}
                aria-invalid={this.props['aria-invalid']}
                aria-errormessage={this.props['aria-errormessage']}
                aria-label={this.props['aria-label']}
                aria-labelledby={this.props['aria-labelledby']}
                aria-describedby={this.props['aria-describedby']}
                aria-required={this.props['aria-required']}
                id={id}
                {...mouseEvent}
                // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
                role="combobox"
                tabIndex={0}
            >
                {inner}
            </div>
        );
    };

    render() {
        const {
            zIndex,
            getPopupContainer,
            autoAdjustOverflow,
            stopPropagation,
            mouseLeaveDelay,
            mouseEnterDelay,
            position,
            motion
        } = this.props;
        const { isOpen, rePosKey } = this.state;
        const { direction } = this.context;
        const content = this.renderContent();
        const selection = this.renderSelection();
        const pos = position ?? (direction === 'rtl' ? 'bottomRight' : 'bottomLeft');
        return (
            <Popover
                getPopupContainer={getPopupContainer}
                zIndex={zIndex}
                motion={motion}
                ref={this.optionsRef}
                content={content}
                visible={isOpen}
                trigger="custom"
                rePosKey={rePosKey}
                position={pos}
                autoAdjustOverflow={autoAdjustOverflow}
                stopPropagation={stopPropagation}
                mouseLeaveDelay={mouseLeaveDelay}
                mouseEnterDelay={mouseEnterDelay}
                afterClose={()=>this.foundation.updateSearching(false)}
            >
                {selection}
            </Popover>
        );
    }
}

export default Cascader;
