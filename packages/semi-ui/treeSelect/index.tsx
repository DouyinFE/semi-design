import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { isEqual, isString, isEmpty, noop, get, isFunction } from 'lodash';
import TreeSelectFoundation, {
    Size,
    BasicTriggerRenderProps,
    /* Corresponding props */
    BasicTreeSelectProps,
    /* Corresponding state */
    BasicTreeSelectInnerData,
    TreeSelectAdapter
} from '@douyinfe/semi-foundation/treeSelect/foundation';
import {
    convertDataToEntities,
    flattenTreeData,
    calcExpandedKeysForValues,
    calcMotionKeys,
    findKeysForValues,
    calcCheckedKeys,
    calcExpandedKeys,
    getValueOrKey,
    normalizeKeyList,
    calcDisabledKeys,
    normalizeValue,
    updateKeys,
} from '@douyinfe/semi-foundation/tree/treeUtil';
import { cssClasses, strings } from '@douyinfe/semi-foundation/treeSelect/constants';
import { numbers as popoverNumbers } from '@douyinfe/semi-foundation/popover/constants';
import { FixedSizeList as VirtualList, ListItemKeySelector } from 'react-window';
import '@douyinfe/semi-foundation/tree/tree.scss';
import '@douyinfe/semi-foundation/treeSelect/treeSelect.scss';
import BaseComponent, { ValidateStatus } from '../_base/baseComponent';
import ConfigContext, { ContextValue } from '../configProvider/context';
import TagGroup from '../tag/group';
import Tag, { TagProps } from '../tag/index';
import Input, { InputProps } from '../input/index';
import Popover from '../popover/index';
import AutoSizer from '../tree/autoSizer';
import TreeContext from '../tree/treeContext';
import TreeNode from '../tree/treeNode';
import NodeList from '../tree/nodeList';
import { cloneDeep } from '../tree/treeUtil';
import LocaleConsumer from '../locale/localeConsumer';
import { Locale } from '../locale/interface';
import Trigger from '../trigger';
import TagInput from '../tagInput';
import { isSemiIcon } from '../_utils';
import { OptionProps, TreeProps, TreeState, FlattenNode, TreeNodeData, TreeNodeProps } from '../tree/interface';
import { Motion } from '../_base/base';
import { IconChevronDown, IconClear, IconSearch } from '@douyinfe/semi-icons';

export type ExpandAction = false | 'click' | 'doubleClick';

export interface TriggerRenderProps extends Omit<BasicTriggerRenderProps, 'componentProps'> {
    [x: string]: any;
    componentProps: TreeSelectProps;
    value: TreeNodeData[];
    onClear: (e: React.MouseEvent) => void;
}

export interface OnChange {
    /* onChangeWithObject is false */
    (
        value: TreeNodeData['value'] | Array<TreeNodeData['value']>,
        node: TreeNodeData[] | TreeNodeData,
        e: React.MouseEvent
    ): void;
    /* onChangeWithObject is true */
    (node: TreeNodeData[] | TreeNodeData, e: React.MouseEvent): void;
}

export type RenderSelectedItemInSingle = (treeNode: TreeNodeData) => React.ReactNode;

export type RenderSelectedItemInMultiple = (
    treeNode: TreeNodeData,
    otherProps: { index: number | string; onClose: (tagContent: any, e: React.MouseEvent) => void }
) => {
    isRenderInTag: boolean;
    content: React.ReactNode;
};

export type RenderSelectedItem = RenderSelectedItemInSingle | RenderSelectedItemInMultiple;

export type OverrideCommonProps =
    'renderFullLabel'
    | 'renderLabel'
    | 'defaultValue'
    | 'emptyContent'
    | 'filterTreeNode'
    | 'style'
    | 'treeData'
    | 'value'
    | 'onExpand';

/**
* Type definition description:
* TreeSelectProps inherits some properties from BasicTreeSelectProps (from foundation) and TreeProps (from semi-ui-react).
*/
// eslint-disable-next-line max-len
export interface TreeSelectProps extends Omit<BasicTreeSelectProps, OverrideCommonProps | 'validateStatus' | 'searchRender'>, Pick<TreeProps, OverrideCommonProps> {
    'aria-describedby'?: React.AriaAttributes['aria-describedby'];
    'aria-errormessage'?: React.AriaAttributes['aria-errormessage'];
    'aria-invalid'?: React.AriaAttributes['aria-invalid'];
    'aria-labelledby'?: React.AriaAttributes['aria-labelledby'];
    'aria-required'?: React.AriaAttributes['aria-required'];
    motion?: Motion;
    mouseEnterDelay?: number;
    mouseLeaveDelay?: number;
    arrowIcon?: React.ReactNode;
    autoAdjustOverflow?: boolean;
    clickToHide?: boolean;
    defaultOpen?: boolean;
    dropdownClassName?: string;
    dropdownMatchSelectWidth?: boolean;
    dropdownStyle?: React.CSSProperties;
    insetLabel?: React.ReactNode;
    insetLabelId?: string;
    maxTagCount?: number;
    motionExpand?: boolean;
    optionListStyle?: React.CSSProperties;
    outerBottomSlot?: React.ReactNode;
    outerTopSlot?: React.ReactNode;
    placeholder?: string;
    prefix?: React.ReactNode;
    searchAutoFocus?: boolean;
    searchPlaceholder?: string;
    showSearchClear?: boolean;
    size?: Size;
    suffix?: React.ReactNode;
    treeNodeLabelProp?: string;
    validateStatus?: ValidateStatus;
    zIndex?: number;
    searchPosition?: string;
    stopPropagation?: boolean | string;
    searchRender?: boolean | ((inputProps: InputProps) => React.ReactNode);
    onSelect?: (selectedKeys: string, selected: boolean, selectedNode: TreeNodeData) => void;
    renderSelectedItem?: RenderSelectedItem;
    getPopupContainer?: () => HTMLElement;
    triggerRender?: (props?: TriggerRenderProps) => React.ReactNode;
    onBlur?: (e: React.MouseEvent) => void;
    onChange?: OnChange;
    onFocus?: (e: React.MouseEvent) => void;
    onVisibleChange?: (isVisible: boolean) => void;
}

export type OverrideCommonState =
    'keyEntities'
    | 'treeData'
    | 'disabledKeys'
    | 'flattenNodes';

// eslint-disable-next-line max-len
export interface TreeSelectState extends Omit<BasicTreeSelectInnerData, OverrideCommonState | 'prevProps'>, Pick<TreeState, OverrideCommonState> {
    inputTriggerFocus: boolean;
    isOpen: boolean;
    isInput: boolean;
    rePosKey: number;
    dropdownMinWidth: null | number;
    isHovering: boolean;
    prevProps: TreeSelectProps;
}

const prefixcls = cssClasses.PREFIX;
const prefixTree = cssClasses.PREFIX_TREE;

const key = 0;

class TreeSelect extends BaseComponent<TreeSelectProps, TreeSelectState> {
    static contextType = ConfigContext;

    static propTypes = {
        'aria-describedby': PropTypes.string,
        'aria-errormessage': PropTypes.string,
        'aria-invalid': PropTypes.bool,
        'aria-labelledby': PropTypes.string,
        'aria-required': PropTypes.bool,
        loadedKeys: PropTypes.arrayOf(PropTypes.string),
        loadData: PropTypes.func,
        onLoad: PropTypes.func,
        arrowIcon: PropTypes.node,
        defaultOpen: PropTypes.bool,
        defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        defaultExpandAll: PropTypes.bool,
        defaultExpandedKeys: PropTypes.array,
        expandAll: PropTypes.bool,
        disabled: PropTypes.bool,
        disableStrictly: PropTypes.bool,
        // Whether to turn on the input box filtering function, when it is a function, it represents a custom filtering function
        filterTreeNode: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
        multiple: PropTypes.bool,
        searchPlaceholder: PropTypes.string,
        searchAutoFocus: PropTypes.bool,
        virtualize: PropTypes.object,
        treeNodeFilterProp: PropTypes.string,
        onChange: PropTypes.func,
        onSearch: PropTypes.func,
        onSelect: PropTypes.func,
        onExpand: PropTypes.func,
        onChangeWithObject: PropTypes.bool,
        onBlur: PropTypes.func,
        onFocus: PropTypes.func,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object]),
        expandedKeys: PropTypes.array,
        autoExpandParent: PropTypes.bool,
        showClear: PropTypes.bool,
        showSearchClear: PropTypes.bool,
        autoAdjustOverflow: PropTypes.bool,
        showFilteredOnly: PropTypes.bool,
        motionExpand: PropTypes.bool,
        emptyContent: PropTypes.node,
        leafOnly: PropTypes.bool,
        treeData: PropTypes.arrayOf(
            PropTypes.shape({
                key: PropTypes.string.isRequired,
                value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                label: PropTypes.any,
            })
        ),
        dropdownClassName: PropTypes.string,
        dropdownStyle: PropTypes.object,
        motion: PropTypes.oneOfType([PropTypes.bool, PropTypes.object, PropTypes.func]),
        placeholder: PropTypes.string,
        maxTagCount: PropTypes.number,
        size: PropTypes.oneOf<TreeSelectProps['size']>(strings.SIZE_SET),
        className: PropTypes.string,
        style: PropTypes.object,
        treeNodeLabelProp: PropTypes.string,
        suffix: PropTypes.node,
        prefix: PropTypes.node,
        insetLabel: PropTypes.node,
        insetLabelId: PropTypes.string,
        zIndex: PropTypes.number,
        getPopupContainer: PropTypes.func,
        dropdownMatchSelectWidth: PropTypes.bool,
        validateStatus: PropTypes.oneOf(strings.STATUS),
        mouseEnterDelay: PropTypes.number,
        mouseLeaveDelay: PropTypes.number,
        triggerRender: PropTypes.func,
        stopPropagation: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
        outerBottomSlot: PropTypes.node,
        outerTopSlot: PropTypes.node,
        onVisibleChange: PropTypes.func,
        expandAction: PropTypes.oneOf(['click' as const, 'doubleClick' as const, false as const]),
        searchPosition: PropTypes.oneOf([strings.SEARCH_POSITION_DROPDOWN, strings.SEARCH_POSITION_TRIGGER]),
        clickToHide: PropTypes.bool,
        renderLabel: PropTypes.func,
        renderFullLabel: PropTypes.func,
        labelEllipsis: PropTypes.bool,
        optionListStyle: PropTypes.object,
        searchRender: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
        renderSelectedItem: PropTypes.func,
        checkRelation: PropTypes.string,
        'aria-label': PropTypes.string,
    };

    static defaultProps: Partial<TreeSelectProps> = {
        searchPosition: strings.SEARCH_POSITION_DROPDOWN,
        arrowIcon: <IconChevronDown />,
        autoExpandParent: false,
        autoAdjustOverflow: true,
        stopPropagation: true,
        motion: true,
        motionExpand: true,
        expandAll: false,
        zIndex: popoverNumbers.DEFAULT_Z_INDEX,
        disableStrictly: false,
        multiple: false,
        filterTreeNode: false,
        size: 'default' as const,
        treeNodeFilterProp: 'label' as const,
        onChangeWithObject: false,
        treeNodeLabelProp: 'label' as const,
        dropdownMatchSelectWidth: true,
        defaultOpen: false,
        showSearchClear: true,
        showClear: false,
        onVisibleChange: noop,
        expandAction: false,
        clickToHide: true,
        searchAutoFocus: false,
        checkRelation: 'related',
        'aria-label': 'TreeSelect'
    };
    inputRef: React.RefObject<typeof Input>;
    tagInputRef: React.RefObject<TagInput>;
    triggerRef: React.RefObject<HTMLDivElement>;
    optionsRef: React.RefObject<any>;
    clickOutsideHandler: any;
    _flattenNodes: TreeState['flattenNodes'];
    onNodeClick: any;
    onNodeDoubleClick: any;
    onMotionEnd: any;
    treeSelectID: string;
    context: ContextValue;

    constructor(props: TreeSelectProps) {
        super(props);
        this.state = {
            inputTriggerFocus: false,
            isOpen: false,
            isInput: false,
            rePosKey: key,
            dropdownMinWidth: null,
            inputValue: '',
            keyEntities: {},
            treeData: [],
            flattenNodes: [],
            selectedKeys: [],
            checkedKeys: new Set(),
            halfCheckedKeys: new Set(),
            realCheckedKeys: new Set([]),
            disabledKeys: new Set(),
            motionKeys: new Set([]),
            motionType: 'hide',
            expandedKeys: new Set(props.expandedKeys),
            filteredKeys: new Set(),
            filteredExpandedKeys: new Set(),
            filteredShownKeys: new Set(),
            prevProps: null,
            isHovering: false,
            cachedKeyValuePairs: {},
            loadedKeys: new Set(),
            loadingKeys: new Set(),
        };
        this.inputRef = React.createRef();
        this.tagInputRef = React.createRef();
        this.triggerRef = React.createRef();
        this.optionsRef = React.createRef();
        this.clickOutsideHandler = null;
        this.foundation = new TreeSelectFoundation(this.adapter);
        this.treeSelectID = Math.random().toString(36).slice(2);
        this.onMotionEnd = () => {
            this.adapter.rePositionDropdown();
        };
    }

    // eslint-disable-next-line max-lines-per-function
    static getDerivedStateFromProps(props: TreeSelectProps, prevState: TreeSelectState) {
        const { prevProps, rePosKey } = prevState;
        const needUpdate = (name: string) => (
            (!prevProps && name in props) ||
            (prevProps && !isEqual(prevProps[name], props[name]))
        );

        let treeData;
        const withObject = props.onChangeWithObject;
        let keyEntities = prevState.keyEntities || {};
        let valueEntities = prevState.cachedKeyValuePairs || {};
        const newState: Partial<TreeSelectState> = {
            prevProps: props,
        };

        // TreeNode
        if (needUpdate('treeData')) {
            treeData = props.treeData;
            newState.treeData = treeData;
            const entitiesMap = convertDataToEntities(treeData);
            newState.keyEntities = {
                ...entitiesMap.keyEntities,
            };
            keyEntities = newState.keyEntities;
            newState.cachedKeyValuePairs = { ...entitiesMap.valueEntities };
            valueEntities = newState.cachedKeyValuePairs;
        }

        // if treeData keys changes, we won't show animation
        if (
            treeData &&
            props.motion &&
            !isEqual(Object.keys(newState.keyEntities), Object.keys(prevState.keyEntities))
        ) {
            if (prevProps && props.motion) {
                newState.motionKeys = new Set([]);
                newState.motionType = null;
            }
        }
        const expandAllWhenDataChange = needUpdate('treeData') && props.expandAll;
        // expandedKeys
        if (needUpdate('expandedKeys') || (prevProps && needUpdate('autoExpandParent'))) {
            newState.expandedKeys = calcExpandedKeys(
                props.expandedKeys,
                keyEntities,
                props.autoExpandParent || !prevProps
            );
            // only show animation when treeData does not change
            if (prevProps && props.motion && !treeData) {
                const { motionKeys, motionType } = calcMotionKeys(
                    prevState.expandedKeys,
                    newState.expandedKeys,
                    keyEntities
                );
                newState.motionKeys = new Set(motionKeys);
                newState.motionType = motionType;
            }
        } else if ((!prevProps && (props.defaultExpandAll || props.expandAll)) || expandAllWhenDataChange) {
            newState.expandedKeys = new Set(Object.keys(keyEntities));
        } else if (!prevProps && props.defaultExpandedKeys) {
            newState.expandedKeys = calcExpandedKeys(props.defaultExpandedKeys, keyEntities);
        } else if (!prevProps && props.defaultValue) {
            newState.expandedKeys = calcExpandedKeysForValues(
                normalizeValue(props.defaultValue, withObject),
                keyEntities,
                props.multiple,
                valueEntities
            );
        } else if (!prevProps && props.value) {
            newState.expandedKeys = calcExpandedKeysForValues(
                normalizeValue(props.value, withObject),
                keyEntities,
                props.multiple,
                valueEntities
            );
        }
        // flattenNodes
        if (treeData || needUpdate('expandedKeys')) {
            const flattenNodes = flattenTreeData(
                treeData || prevState.treeData,
                newState.expandedKeys || prevState.expandedKeys
            );
            newState.flattenNodes = flattenNodes;
        }

        // selectedKeys: single mode controlled
        const isMultiple = props.multiple;
        if (!isMultiple) {
            if (needUpdate('value')) {
                newState.selectedKeys = findKeysForValues(
                    normalizeValue(props.value, withObject),
                    valueEntities,
                    isMultiple
                );
            } else if (!prevProps && props.defaultValue) {
                newState.selectedKeys = findKeysForValues(
                    normalizeValue(props.defaultValue, withObject),
                    valueEntities,
                    isMultiple
                );
            } else if (treeData) {
                // If `treeData` changed, we also need check it
                if (props.value) {
                    newState.selectedKeys = findKeysForValues(
                        normalizeValue(props.value, withObject) || '',
                        valueEntities,
                        isMultiple
                    );
                } else {
                    newState.selectedKeys = updateKeys(prevState.selectedKeys, keyEntities);
                }
            }
        } else {
            // checkedKeys: multiple mode controlled || data changed
            let checkedKeyValues;

            if (needUpdate('value')) {
                checkedKeyValues = findKeysForValues(
                    normalizeValue(props.value, withObject),
                    valueEntities,
                    isMultiple
                );
            } else if (!prevProps && props.defaultValue) {
                checkedKeyValues = findKeysForValues(
                    normalizeValue(props.defaultValue, withObject),
                    valueEntities,
                    isMultiple
                );
            } else if (treeData) {
                // If `treeData` changed, we also need check it
                if (props.value) {
                    checkedKeyValues = findKeysForValues(
                        normalizeValue(props.value, withObject) || [],
                        valueEntities,
                        isMultiple
                    );
                } else {
                    checkedKeyValues = updateKeys(prevState.checkedKeys, keyEntities);
                }
            }

            if (checkedKeyValues) {
                if (props.checkRelation === 'unRelated') {
                    newState.realCheckedKeys = new Set(checkedKeyValues);
                } else if (props.checkRelation === 'related') {
                    const { checkedKeys, halfCheckedKeys } = calcCheckedKeys(checkedKeyValues, keyEntities);

                    newState.checkedKeys = checkedKeys;
                    newState.halfCheckedKeys = halfCheckedKeys;
                }
            }
        }

        // loadedKeys
        if (needUpdate('loadedKeys')) {
            newState.loadedKeys = new Set(props.loadedKeys);
        }

        // ================== rePosKey ==================
        if (needUpdate('treeData') || needUpdate('value')) {
            newState.rePosKey = rePosKey + 1;
        }

        // ================ disableStrictly =================
        if (treeData && props.disableStrictly && props.checkRelation === 'related') {
            newState.disabledKeys = calcDisabledKeys(keyEntities);
        }

        return newState;
    }

    get adapter(): TreeSelectAdapter<TreeSelectProps, TreeSelectState> {
        const filterAdapter: Pick<TreeSelectAdapter, 'updateInputValue'> = {
            updateInputValue: value => {
                this.setState({ inputValue: value });
            }
        };
        const treeSelectAdapter: Pick<TreeSelectAdapter,
        'registerClickOutsideHandler'
        | 'unregisterClickOutsideHandler'
        | 'rePositionDropdown'
        > = {
            registerClickOutsideHandler: cb => {
                const clickOutsideHandler = (e: Event) => {
                    const optionInstance = this.optionsRef && this.optionsRef.current as React.ReactInstance;
                    const triggerDom = this.triggerRef && this.triggerRef.current;
                    // eslint-disable-next-line
                    const optionsDom = ReactDOM.findDOMNode(optionInstance);
                    const target = e.target as Element;
                    if (
                        optionsDom &&
                        (
                            !optionsDom.contains(target) ||
                            !optionsDom.contains(target.parentNode)
                        ) &&
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
                this.clickOutsideHandler = null;
            },
            rePositionDropdown: () => {
                let { rePosKey } = this.state;
                rePosKey = rePosKey + 1;
                this.setState({ rePosKey });
            },
        };
        const treeAdapter: Pick<TreeSelectAdapter,
        'updateState'
        | 'notifySelect'
        | 'notifySearch'
        | 'cacheFlattenNodes'
        | 'notifyLoad'
        > = {
            updateState: states => {
                this.setState({ ...states } as TreeSelectState);
            },
            notifySelect: ((selectKey, bool, node) => {
                this.props.onSelect && this.props.onSelect(selectKey, bool, node);
            }),
            notifySearch: (input, filteredExpandedKeys) => {
                this.props.onSearch && this.props.onSearch(input, filteredExpandedKeys);
            },
            cacheFlattenNodes: bool => {
                this._flattenNodes = bool ? cloneDeep(this.state.flattenNodes) : null;
            },
            notifyLoad: (newLoadedKeys, data) => {
                const { onLoad } = this.props;
                isFunction(onLoad) && onLoad(newLoadedKeys, data);
            }
        };
        return {
            ...super.adapter,
            ...filterAdapter,
            ...treeSelectAdapter,
            ...treeAdapter,
            updateLoadKeys: (data, resolve) => {
                this.setState(({ loadedKeys, loadingKeys }) =>
                    this.foundation.handleNodeLoad(loadedKeys, loadingKeys, data, resolve));
            },
            updateState: states => {
                this.setState({ ...states } as TreeSelectState);
            },
            openMenu: () => {
                this.setState({ isOpen: true }, () => {
                    this.props.onVisibleChange(true);
                });
            },
            closeMenu: cb => {
                this.setState({ isOpen: false }, () => {
                    cb && cb();
                    this.props.onVisibleChange(false);
                });
            },
            getTriggerWidth: () => {
                const el = this.triggerRef.current;
                return el && el.getBoundingClientRect().width;
            },
            setOptionWrapperWidth: width => {
                this.setState({ dropdownMinWidth: width });
            },
            notifyChange: (value, node, e) => {
                this.props.onChange && this.props.onChange(value, node, e);
            },
            notifyChangeWithObject: (node, e) => {
                this.props.onChange && this.props.onChange(node, e);
            },
            notifyExpand: (expandedKeys, { expanded: bool, node }) => {
                this.props.onExpand && this.props.onExpand([...expandedKeys], { expanded: bool, node });
                if (bool && this.props.loadData) {
                    this.onNodeLoad(node);
                }
            },
            notifyFocus: (...v) => {
                this.props.onFocus && this.props.onFocus(...v);
            },
            notifyBlur: (...v) => {
                this.props.onBlur && this.props.onBlur(...v);
            },
            toggleHovering: bool => {
                this.setState({ isHovering: bool });
            },
            updateInputFocus: bool => { } // eslint-disable-line
        };
    }

    componentDidMount() {
        this.foundation.init();
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

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
        const { prefix, insetLabel, insetLabelId }: any = this.props;
        const labelNode = prefix || insetLabel;
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

    renderContent = () => {
        const { dropdownMinWidth } = this.state;
        const { dropdownStyle, dropdownClassName } = this.props;
        const style = { minWidth: dropdownMinWidth, ...dropdownStyle };
        const popoverCls = cls(dropdownClassName, `${prefixcls}-popover`);
        return (
            <div className={popoverCls} style={style}>
                {this.renderTree()}
            </div>
        );
    };

    removeTag = (removedKey: TreeNodeData['key']) => {
        this.foundation.removeTag(removedKey);
    };

    handleClick = (e: React.MouseEvent) => {
        this.foundation.handleClick(e);
    };

    /* istanbul ignore next */
    handleSelectionEnterPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        this.foundation.handleSelectionEnterPress(e);
    };

    hasValue = (): boolean => {
        const { multiple, checkRelation } = this.props;
        const { realCheckedKeys, checkedKeys, selectedKeys } = this.state;
        let hasValue = false;
        if (multiple) {
            if (checkRelation === 'related') {
                hasValue = Boolean(checkedKeys.size);
            } else if (checkRelation === 'unRelated') {
                hasValue = Boolean(realCheckedKeys.size);
            }
        } else {
            hasValue = Boolean(selectedKeys.length);
        }
        return hasValue;
    }

    showClearBtn = () => {
        const { showClear, disabled, searchPosition } = this.props;
        const { inputValue, isOpen, isHovering } = this.state;
        const triggerSearchHasInputValue = searchPosition === strings.SEARCH_POSITION_TRIGGER && inputValue;

        return showClear && (this.hasValue() || triggerSearchHasInputValue) && !disabled && (isOpen || isHovering);
    };

    renderTagList = () => {
        const { checkedKeys, keyEntities, disabledKeys, realCheckedKeys } = this.state;
        const {
            treeNodeLabelProp,
            leafOnly,
            disabled,
            disableStrictly,
            size,
            checkRelation,
            renderSelectedItem: propRenderSelectedItem
        } = this.props;
        const renderSelectedItem = isFunction(propRenderSelectedItem) ?
            propRenderSelectedItem :
            (item: TreeNodeData) => ({
                isRenderInTag: true,
                content: get(item, treeNodeLabelProp, null)
            });
        let renderKeys = [];
        if (checkRelation === 'related') {
            renderKeys = normalizeKeyList([...checkedKeys], keyEntities, leafOnly);
        } else if (checkRelation === 'unRelated' && Object.keys(keyEntities).length > 0) {
            renderKeys = [...realCheckedKeys];
        }
        const tagList: Array<React.ReactNode> = [];
        // eslint-disable-next-line @typescript-eslint/no-shadow
        renderKeys.forEach((key: TreeNodeData['key']) => {
            const item = keyEntities[key].data;
            const onClose = (tagContent: any, e: React.MouseEvent) => {
                if (e && typeof e.preventDefault === 'function') {
                    // make sure that tag will not hidden immediately in controlled mode
                    e.preventDefault();
                }
                this.removeTag(key);
            };
            const { content, isRenderInTag } = (treeNodeLabelProp in item && item) ?
                (renderSelectedItem as RenderSelectedItemInMultiple)(item, { index: key, onClose }) :
                null;
            if (!content) {
                return;
            }
            const isDisabled = disabled || item.disabled || (disableStrictly && disabledKeys.has(item.key));
            const tag: Partial<TagProps> & React.Attributes = {
                closable: !isDisabled,
                color: 'white',
                visible: true,
                onClose,
                key,
                size: size === 'small' ? 'small' : 'large'
            };
            if (isRenderInTag) {
                // pass ReactNode list to tagList when using tagGroup custom mode
                tagList.push(<Tag {...tag}>{content}</Tag>);
            } else {
                tagList.push(content);
            }
        });
        return tagList;
    };

    /**
     * When single selection and the search box is on trigger, the items displayed in the rendered search box
     */
    renderSingleTriggerSearchItem = () => {
        const { placeholder, disabled } = this.props;
        const { inputTriggerFocus } = this.state;
        const renderText = this.foundation.getRenderTextInSingle();
        const spanCls = cls(`${prefixcls}-selection-TriggerSearchItem`, {
            [`${prefixcls}-selection-TriggerSearchItem-placeholder`]: (inputTriggerFocus || !renderText) && !disabled,
            [`${prefixcls}-selection-TriggerSearchItem-disabled`]: disabled,
        });
        return (
            <span className={spanCls}>
                {renderText ? renderText : placeholder}
            </span>
        );
    };

    /**
     * Single selection and the search box content rendered when the search box is on trigger
     */
    renderSingleTriggerSearch = () => {
        const { inputValue } = this.state;
        return (
            <>
                {!inputValue && this.renderSingleTriggerSearchItem()}
                {this.renderInput()}
            </>
        );
    };

    renderSelectContent = () => {
        const {
            multiple,
            placeholder,
            maxTagCount,
            searchPosition,
            filterTreeNode,
        } = this.props;
        const isTriggerPositionSearch = filterTreeNode && searchPosition === strings.SEARCH_POSITION_TRIGGER;
        // searchPosition = trigger
        if (isTriggerPositionSearch) {
            return multiple ? this.renderTagInput() : this.renderSingleTriggerSearch();
        }
        // searchPosition = dropdown and single seleciton
        if (!multiple || !this.hasValue()) {
            const renderText = this.foundation.getRenderTextInSingle();
            const spanCls = cls({
                [`${prefixcls}-selection-placeholder`]: !renderText,
            });
            return <span className={spanCls}>{renderText ? renderText : placeholder}</span>;
        }
        // searchPosition = dropdown and multiple seleciton
        const tagList = this.renderTagList();
        // mode=custom to return tagList directly
        return (
            <TagGroup<'custom'>
                maxTagCount={maxTagCount}
                tagList={tagList}
                size="large"
                mode="custom"
            />
        );
    };

    handleClear = (e: React.MouseEvent) => {
        e && e.stopPropagation();
        this.foundation.handleClear(e);
    };

    /* istanbul ignore next */
    handleClearEnterPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        e && e.stopPropagation();
        this.foundation.handleClearEnterPress(e);
    };

    handleMouseOver = (e: React.MouseEvent) => {
        this.foundation.toggleHoverState(true);
    };

    handleMouseLeave = (e: React.MouseEvent) => {
        this.foundation.toggleHoverState(false);
    };

    search = (value: string) => {
        this.foundation.handleInputChange(value);
    };

    close = () => {
        this.foundation.close(null);
    };

    renderArrow = () => {
        const showClearBtn = this.showClearBtn();
        const { arrowIcon } = this.props;
        if (showClearBtn) {
            return null;
        }
        return arrowIcon ? (
            <div className={cls(`${prefixcls}-arrow`)} x-semi-prop="arrowIcon">
                {arrowIcon}
            </div>
        ) : null;
    };

    renderClearBtn = () => {
        const showClearBtn = this.showClearBtn();
        const clearCls = cls(`${prefixcls}-clearbtn`);
        if (showClearBtn) {
            return (
                <div
                    role='button'
                    tabIndex={0}
                    aria-label="Clear TreeSelect value"
                    className={clearCls}
                    onClick={this.handleClear}
                    onKeyPress={this.handleClearEnterPress}
                >
                    <IconClear />
                </div>
            );
        }
        return null;
    };

    renderSelection = () => {
        const {
            disabled,
            multiple,
            filterTreeNode,
            validateStatus,
            prefix,
            suffix,
            style,
            size,
            insetLabel,
            className,
            placeholder,
            showClear,
            leafOnly,
            searchPosition,
            triggerRender,
        } = this.props;
        const { isOpen, isInput, inputValue, selectedKeys, checkedKeys, keyEntities } = this.state;
        const filterable = Boolean(filterTreeNode);
        const useCustomTrigger = typeof triggerRender === 'function';
        const mouseEvent = showClear ?
            {
                onMouseEnter: (e: React.MouseEvent) => this.handleMouseOver(e),
                onMouseLeave: (e: React.MouseEvent) => this.handleMouseLeave(e),
            } :
            {};
        const isTriggerPositionSearch = searchPosition === strings.SEARCH_POSITION_TRIGGER && filterable;
        const isEmptyTriggerSearch = isTriggerPositionSearch && isEmpty(checkedKeys);
        const isValueTriggerSearch = isTriggerPositionSearch && !isEmpty(checkedKeys);
        const classNames = useCustomTrigger ?
            cls(className) :
            cls(
                prefixcls,
                {
                    [`${prefixcls}-focus`]: isOpen && !isInput,
                    [`${prefixcls}-disabled`]: disabled,
                    [`${prefixcls}-single`]: !multiple,
                    [`${prefixcls}-multiple`]: multiple,
                    [`${prefixcls}-multiple-tagInput-empty`]: multiple && isEmptyTriggerSearch,
                    [`${prefixcls}-multiple-tagInput-notEmpty`]: multiple && isValueTriggerSearch,
                    [`${prefixcls}-filterable`]: filterable,
                    [`${prefixcls}-error`]: validateStatus === 'error',
                    [`${prefixcls}-warning`]: validateStatus === 'warning',
                    [`${prefixcls}-small`]: size === 'small',
                    [`${prefixcls}-large`]: size === 'large',
                    [`${prefixcls}-with-prefix`]: prefix || insetLabel,
                    [`${prefixcls}-with-suffix`]: suffix,
                    [`${prefixcls}-with-suffix`]: suffix,
                },
                className
            );
        const triggerRenderKeys = multiple ? normalizeKeyList([...checkedKeys], keyEntities, leafOnly) : selectedKeys;
        const inner = useCustomTrigger ? (
            <Trigger
                inputValue={inputValue}
                // eslint-disable-next-line @typescript-eslint/no-shadow
                value={triggerRenderKeys.map((key: string) => get(keyEntities, [key, 'data']))}
                disabled={disabled}
                placeholder={placeholder}
                onClear={this.handleClear}
                componentName={'TreeSelect'}
                triggerRender={triggerRender}
                componentProps={{ ...this.props }}
            />
        ) : (
            [
                <Fragment key={'prefix'}>{prefix || insetLabel ? this.renderPrefix() : null}</Fragment>,
                <Fragment key={'selection'}>
                    <div className={`${prefixcls}-selection`}>{this.renderSelectContent()}</div>
                </Fragment>,
                <Fragment key={'suffix'}>{suffix ? this.renderSuffix() : null}</Fragment>,
                <Fragment key={'clearBtn'}>
                    {
                        (showClear || (isTriggerPositionSearch && inputValue)) ?
                            this.renderClearBtn() :
                            null
                    }
                </Fragment>,
                <Fragment key={'arrow'}>{this.renderArrow()}</Fragment>,
            ]
        );
        const tabIndex = disabled ? null : 0;
        /**
         * Reasons for disabling the a11y eslint rule:
         * The following attributes(aria-controls,aria-expanded) will be automatically added by Tooltip, no need to declare here
         */
        return (
            <div
                // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
                role='combobox'
                aria-disabled={disabled}
                aria-haspopup="tree"
                tabIndex={tabIndex}
                className={classNames}
                style={style}
                ref={this.triggerRef}
                onClick={this.handleClick}
                onKeyPress={this.handleSelectionEnterPress}
                aria-invalid={this.props['aria-invalid']}
                aria-errormessage={this.props['aria-errormessage']}
                aria-label={this.props['aria-label']}
                aria-labelledby={this.props['aria-labelledby']}
                aria-describedby={this.props['aria-describedby']}
                aria-required={this.props['aria-required']}
                {...mouseEvent}
            >
                {inner}
            </div>
        );
    };

    // eslint-disable-next-line @typescript-eslint/no-shadow
    renderTagItem = (key: string, idx: number) => {
        const { keyEntities, disabledKeys } = this.state;
        const {
            size,
            leafOnly,
            disabled,
            disableStrictly,
            renderSelectedItem: propRenderSelectedItem,
            treeNodeLabelProp
        } = this.props;
        const keyList = normalizeKeyList([key], keyEntities, leafOnly);
        const nodes = keyList.map(i => keyEntities[i].data);
        const value = getValueOrKey(nodes);
        const tagCls = cls(`${prefixcls}-selection-tag`, {
            [`${prefixcls}-selection-tag-disabled`]: disabled,
        });
        const nodeHaveData = !isEmpty(nodes) && !isEmpty(nodes[0]);
        const isDisableStrictlyNode = disableStrictly && nodeHaveData && disabledKeys.has(nodes[0].key);
        const closable = nodeHaveData && !nodes[0].disabled && !disabled && !isDisableStrictlyNode;
        const onClose = (tagChildren: React.ReactNode, e: React.MouseEvent) => {
            // When value has not changed, prevent clicking tag closeBtn to close tag
            e.preventDefault();
            this.removeTag(key);
        };
        const tagProps: Partial<TagProps> & React.Attributes = {
            size: size === 'small' ? 'small' : 'large',
            key: `tag-${value}-${idx}`,
            color: 'white',
            className: tagCls,
            closable,
            onClose,
        };
        const item = nodes[0];
        const renderSelectedItem = isFunction(propRenderSelectedItem) ? propRenderSelectedItem :
            (selectedItem: TreeNodeData) => ({
                isRenderInTag: true,
                content: get(selectedItem, treeNodeLabelProp, null)
            });
        if (isFunction(renderSelectedItem)) {
            const { content, isRenderInTag } = treeNodeLabelProp in item && item ?
                (renderSelectedItem as RenderSelectedItemInMultiple)(item, { index: idx, onClose }) :
                null;
            if (isRenderInTag) {
                return <Tag {...tagProps}>{content}</Tag>;
            } else {
                return content;
            }
        }
        return (
            <Tag {...tagProps}>
                {value}
            </Tag>
        );
    };

    renderTagInput = () => {
        const {
            leafOnly,
            disabled,
            size,
            searchAutoFocus,
            placeholder,
            maxTagCount,
            checkRelation,
        } = this.props;
        const {
            keyEntities,
            checkedKeys,
            inputValue,
            realCheckedKeys,
        } = this.state;
        let keyList = [];
        if (checkRelation === 'related') {
            keyList = normalizeKeyList(checkedKeys, keyEntities, leafOnly);
        } else if (checkRelation === 'unRelated') {
            keyList = [...realCheckedKeys];
        }
        return (
            <TagInput
                maxTagCount={maxTagCount}
                disabled={disabled}
                onInputChange={v => this.search(v)}
                ref={this.tagInputRef}
                placeholder={placeholder}
                value={keyList}
                inputValue={inputValue}
                size={size}
                autoFocus={searchAutoFocus}
                renderTagItem={(itemKey, index) => this.renderTagItem(itemKey, index)}
                onRemove={itemKey => this.removeTag(itemKey)}
            />
        );
    };

    // render Tree
    renderInput = () => {
        const {
            searchPlaceholder,
            searchRender,
            showSearchClear,
            searchPosition,
            searchAutoFocus,
            multiple,
            disabled,
        } = this.props;
        const isDropdownPositionSearch = searchPosition === strings.SEARCH_POSITION_DROPDOWN;
        const inputcls = cls({
            [`${prefixTree}-input`]: isDropdownPositionSearch,
            [`${prefixcls}-inputTrigger`]: !isDropdownPositionSearch
        });
        const { inputValue } = this.state;
        const baseInputProps = {
            value: inputValue,
            className: inputcls,
            onChange: (value: string) => this.search(value),
        };
        const inputDropdownProps = {
            showClear: showSearchClear,
            prefix: <IconSearch />,
        };
        const inputTriggerProps = {
            onFocus: (e: React.FocusEvent) => this.foundation.handleInputTriggerFocus(),
            onBlur: (e: React.FocusEvent) => this.foundation.handleInputTriggerBlur(),
            disabled,
        };
        const realInputProps = isDropdownPositionSearch ? inputDropdownProps : inputTriggerProps;
        const wrapperCls = cls({
            [`${prefixTree}-search-wrapper`]: isDropdownPositionSearch,
            [`${prefixcls}-triggerSingleSearch-wrapper`]: !isDropdownPositionSearch && !multiple,
        });
        const useCusSearch = typeof searchRender === 'function' || typeof searchRender === 'boolean';
        if (useCusSearch && !searchRender) {
            return null;
        }
        return (
            <div className={wrapperCls}>
                <LocaleConsumer componentName="TreeSelect">
                    {(locale: Locale['TreeSelect']) => {
                        const placeholder = isDropdownPositionSearch ?
                            searchPlaceholder || locale.searchPlaceholder :
                            '';
                        if (useCusSearch) {
                            return (searchRender as any)({ ...realInputProps, ...baseInputProps, placeholder });
                        }
                        return (
                            <Input
                                aria-label='Filter TreeSelect item'
                                ref={this.inputRef as any}
                                autofocus={searchAutoFocus}
                                placeholder={placeholder}
                                {...baseInputProps}
                                {...realInputProps}
                            />
                        );
                    }}
                </LocaleConsumer>
            </div>
        );
    };

    renderEmpty = () => {
        const { emptyContent } = this.props;
        if (emptyContent) {
            return <TreeNode empty emptyContent={this.props.emptyContent} />;
        } else {
            return (
                <LocaleConsumer componentName="Tree">
                    {(locale: Locale['Tree']) => <TreeNode empty emptyContent={locale.emptyText} />}
                </LocaleConsumer>
            );
        }
    };

    onNodeLoad = (data: TreeNodeData) => new Promise(resolve => this.foundation.setLoadKeys(data, resolve));

    onNodeSelect = (e: React.MouseEvent | React.KeyboardEvent, treeNode: TreeNodeProps) => {
        this.foundation.handleNodeSelect(e, treeNode);
    };

    onNodeCheck = (e: React.MouseEvent | React.KeyboardEvent, treeNode: TreeNodeProps) => {
        this.foundation.handleNodeSelect(e, treeNode);
    };

    onNodeExpand = (e: React.MouseEvent | React.KeyboardEvent, treeNode: TreeNodeProps) => {
        this.foundation.handleNodeExpand(e, treeNode);
    };

    getTreeNodeRequiredProps = () => {
        const { expandedKeys, selectedKeys, checkedKeys, halfCheckedKeys, keyEntities, filteredKeys } = this.state;
        return {
            expandedKeys: expandedKeys || new Set(),
            selectedKeys: selectedKeys || [],
            checkedKeys: checkedKeys || new Set(),
            halfCheckedKeys: halfCheckedKeys || new Set(),
            filteredKeys: filteredKeys || new Set(),
            keyEntities,
        };
    };

    getTreeNodeKey = (treeNode: TreeNodeData) => {
        const { data } = treeNode;
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const { key }: { key: string } = data;
        return key;
    };

    /* Event handler function after popover is closed */
    handlePopoverClose = isVisible => {
        const { filterTreeNode } = this.props;
        if (isVisible === false && Boolean(filterTreeNode)) {
            this.foundation.clearInput();
        }
    }

    renderTreeNode = (treeNode: FlattenNode, ind: number, style: React.CSSProperties) => {
        const { data } = treeNode;
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const { key }: { key: string } = data;
        const treeNodeProps = this.foundation.getTreeNodeProps(key);
        if (!treeNodeProps) {
            return null;
        }
        return <TreeNode {...treeNodeProps} {...data} key={key} data={data} style={style} />;
    };

    itemKey = (index: number, data: TreeNodeData) => {
        // Find the item at the specified index.
        const item = data[index];
        // Return a value that uniquely identifies this item.
        return item.key;
    };

    renderNodeList = () => {
        const { flattenNodes, motionKeys, motionType, filteredKeys } = this.state;
        const { direction } = this.context;
        const { virtualize, motionExpand } = this.props;
        const isExpandControlled = 'expandedKeys' in this.props;
        if (!virtualize || isEmpty(virtualize)) {
            return (
                <NodeList
                    flattenNodes={flattenNodes}
                    flattenList={this._flattenNodes}
                    motionKeys={motionExpand ? motionKeys : new Set([])}
                    motionType={motionType}
                    // When motionKeys is empty, but filteredKeys is not empty (that is, the search hits), this situation should be distinguished from ordinary motionKeys
                    searchTargetIsDeep={
                        isExpandControlled &&
                        motionExpand &&
                        isEmpty(motionKeys) &&
                        !isEmpty(filteredKeys)
                    }
                    onMotionEnd={this.onMotionEnd}
                    renderTreeNode={this.renderTreeNode}
                />
            );
        }

        const option = ({ index, style, data }: OptionProps) => this.renderTreeNode(data[index], index, style);

        return (
            <AutoSizer defaultHeight={virtualize.height} defaultWidth={virtualize.width}>
                {({ height, width }) => (
                    <VirtualList
                        itemCount={flattenNodes.length}
                        itemSize={virtualize.itemSize}
                        height={height}
                        width={width}
                        // @ts-ignore avoid strict check of itemKey
                        itemKey={this.itemKey as ListItemKeySelector<TreeNodeData>}
                        itemData={flattenNodes as any}
                        className={`${prefixTree}-virtual-list`}
                        style={{ direction }}
                    >
                        {option}
                    </VirtualList>
                )}
            </AutoSizer>
        );
    };

    renderTree = () => {
        const { keyEntities, motionKeys, motionType, inputValue, filteredKeys, flattenNodes } = this.state;
        const {
            loadData,
            filterTreeNode,
            disabled,
            multiple,
            showFilteredOnly,
            motionExpand,
            outerBottomSlot,
            outerTopSlot,
            expandAction,
            labelEllipsis,
            virtualize,
            optionListStyle,
            searchPosition,
            renderLabel,
            renderFullLabel,
        } = this.props;
        const wrapperCls = cls(`${prefixTree}-wrapper`);
        const listCls = cls(`${prefixTree}-option-list`, {
            [`${prefixTree}-option-list-block`]: true,
        });
        const searchNoRes = Boolean(inputValue) && !filteredKeys.size;
        const noData = isEmpty(flattenNodes) || (showFilteredOnly && searchNoRes);
        const isDropdownPositionSearch = searchPosition === strings.SEARCH_POSITION_DROPDOWN;
        return (
            <TreeContext.Provider
                value={{
                    loadData,
                    treeDisabled: disabled,
                    motion: motionExpand,
                    motionKeys,
                    motionType,
                    expandAction,
                    filterTreeNode,
                    keyEntities,
                    onNodeClick: this.onNodeClick,
                    onNodeDoubleClick: this.onNodeDoubleClick,
                    // tree node will call this function when treeNode is right clicked
                    onNodeRightClick: noop,
                    onNodeExpand: this.onNodeExpand,
                    onNodeSelect: this.onNodeSelect,
                    onNodeCheck: this.onNodeCheck,
                    renderTreeNode: this.renderTreeNode,
                    multiple,
                    showFilteredOnly,
                    isSearching: Boolean(inputValue),
                    renderLabel,
                    renderFullLabel,
                    labelEllipsis: typeof labelEllipsis === 'undefined' ? virtualize : labelEllipsis,
                }}
            >
                <div className={wrapperCls}>
                    {outerTopSlot}
                    {
                        !outerTopSlot &&
                        filterTreeNode &&
                        isDropdownPositionSearch &&
                        this.renderInput()
                    }
                    <div className={listCls} role="tree" aria-multiselectable={multiple ? true : false} style={optionListStyle}>
                        {noData ? this.renderEmpty() : this.renderNodeList()}
                    </div>
                    {outerBottomSlot}
                </div>
            </TreeContext.Provider>
        );
    };

    render() {
        const content = this.renderContent();
        const {
            motion,
            zIndex,
            mouseLeaveDelay,
            mouseEnterDelay,
            autoAdjustOverflow,
            stopPropagation,
            getPopupContainer,
        } = this.props;
        const { isOpen, rePosKey } = this.state;
        const selection = this.renderSelection();
        const pos = 'bottomLeft';
        return (
            <Popover
                stopPropagation={stopPropagation}
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
                mouseLeaveDelay={mouseLeaveDelay}
                mouseEnterDelay={mouseEnterDelay}
                onVisibleChange={this.handlePopoverClose}
            >
                {selection}
            </Popover>
        );
    }
}

export default TreeSelect;
