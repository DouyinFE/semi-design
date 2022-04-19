import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { cssClasses, strings } from '@douyinfe/semi-foundation/cascader/constants';
import isEnterPress from '@douyinfe/semi-foundation/utils/isEnterPress';
import { includes } from 'lodash';
import ConfigContext, { ContextValue } from '../configProvider/context';
import LocaleConsumer from '../locale/localeConsumer';
import { IconChevronRight, IconTick } from '@douyinfe/semi-icons';
import { Locale } from '../locale/interface';
import Spin from '../spin';
import Checkbox, { CheckboxEvent } from '../checkbox';
import {
    BasicCascaderData,
    BasicEntity,
    ShowNextType,
    BasicData
} from '@douyinfe/semi-foundation/cascader/foundation';

export interface CascaderData extends BasicCascaderData {
    label: React.ReactNode;
}

export interface Entity extends BasicEntity {
    /* children list */
    children?: Array<Entity>;
    /* treedata */
    data: CascaderData;
    /* parent data */
    parent?: Entity;
}

export interface Entities {
    [idx: string]: Entity;
}

export interface Data extends BasicData {
    data: CascaderData;
    searchText: React.ReactNode[];
}

export interface CascaderItemProps {
    activeKeys: Set<string>;
    selectedKeys: Set<string>;
    loadedKeys: Set<string>;
    loadingKeys: Set<string>;
    onItemClick: (e: React.MouseEvent | React.KeyboardEvent, item: Entity | Data) => void;
    onItemHover: (e: React.MouseEvent, item: Entity) => void;
    showNext: ShowNextType;
    onItemCheckboxClick: (item: Entity | Data) => void;
    onListScroll: (e: React.UIEvent<HTMLUListElement, UIEvent>, ind: number) => void;
    searchable: boolean;
    keyword: string;
    empty: boolean;
    emptyContent: React.ReactNode;
    loadData: (selectOptions: CascaderData[]) => Promise<void>;
    data: Array<Data | Entity>;
    separator: string;
    multiple: boolean;
    checkedKeys: Set<string>;
    halfCheckedKeys: Set<string>;
}

const prefixcls = cssClasses.PREFIX_OPTION;

export default class Item extends PureComponent<CascaderItemProps> {
    static contextType = ConfigContext;

    static propTypes = {
        data: PropTypes.array,
        emptyContent: PropTypes.node,
        searchable: PropTypes.bool,
        onItemClick: PropTypes.func,
        onItemHover: PropTypes.func,
        multiple: PropTypes.bool,
        showNext: PropTypes.oneOf([strings.SHOW_NEXT_BY_CLICK, strings.SHOW_NEXT_BY_HOVER]),
        checkedKeys: PropTypes.object,
        halfCheckedKeys: PropTypes.object,
        onItemCheckboxClick: PropTypes.func,
        separator: PropTypes.string,
        keyword: PropTypes.string
    };

    static defaultProps = {
        empty: false,
    };

    context: ContextValue;

    onClick = (e: React.MouseEvent | React.KeyboardEvent, item: Entity | Data) => {
        const { onItemClick } = this.props;
        if (item.data.disabled || ('disabled' in item && item.disabled)) {
            return;
        }
        onItemClick(e, item);
    };

    /**
     * A11y: simulate item click
     */
    handleItemEnterPress = (keyboardEvent: React.KeyboardEvent, item: Entity | Data) => {
        if (isEnterPress(keyboardEvent)) {
            this.onClick(keyboardEvent, item);
        }
    }

    onHover = (e: React.MouseEvent, item: Entity) => {
        const { showNext, onItemHover } = this.props;
        if (item.data.disabled) {
            return;
        }
        if (showNext === strings.SHOW_NEXT_BY_HOVER) {
            onItemHover(e, item);
        }
    };

    onCheckboxChange = (e: CheckboxEvent, item: Entity | Data) => {
        const { onItemCheckboxClick } = this.props;
        // Prevent Checkbox's click event bubbling to trigger the li click event
        e.stopPropagation();
        if (e.nativeEvent && typeof e.nativeEvent.stopImmediatePropagation === 'function') {
            e.nativeEvent.stopImmediatePropagation();
        }
        onItemCheckboxClick(item);
    };

    getItemStatus = (key: string) => {
        const { activeKeys, selectedKeys, loadedKeys, loadingKeys } = this.props;
        const state = { active: false, selected: false, loading: false };
        if (activeKeys.has(key)) {
            state.active = true;
        }
        if (selectedKeys.has(key)) {
            state.selected = true;
        }
        if (loadingKeys.has(key) && !loadedKeys.has(key)) {
            state.loading = true;
        }
        return state;
    };

    renderIcon = (type: string) => {
        switch (type) {
            case 'child':
                return (<IconChevronRight className={`${prefixcls}-icon ${prefixcls}-icon-expand`} />);
            case 'tick':
                return (<IconTick className={`${prefixcls}-icon ${prefixcls}-icon-active`} />);
            case 'loading':
                return <Spin wrapperClassName={`${prefixcls}-spin-icon`} />;
            case 'empty':
                return (<span aria-hidden={true} className={`${prefixcls}-icon ${prefixcls}-icon-empty`} />);
            default:
                return null;
        }
    };

    highlight = (searchText: React.ReactNode[]) => {
        const content: React.ReactNode[] = [];
        const { keyword, separator } = this.props;
        searchText.forEach((item, idx) => {
            if (typeof item === 'string' && includes(item, keyword)) {
                item.split(keyword).forEach((node, index) => {
                    if (index > 0) {
                        content.push(
                            <span className={`${prefixcls}-label-highlight`} key={`${index}-${idx}`}>
                                {keyword}
                            </span>
                        );
                    }
                    content.push(node);
                });
            } else {
                content.push(item);
            }
            if (idx !== searchText.length - 1) {
                content.push(separator);
            }
        });
        return content;
    };

    renderFlattenOption = (data: Data[]) => {
        const { multiple, checkedKeys, halfCheckedKeys } = this.props;
        const content = (
            <ul className={`${prefixcls}-list`} key={'flatten-list'}>
                {data.map(item => {
                    const { searchText, key, disabled } = item;
                    const className = cls(prefixcls, {
                        [`${prefixcls}-flatten`]: true,
                        [`${prefixcls}-disabled`]: disabled
                    });
                    return (
                        <li
                            role='menuitem'
                            className={className}
                            key={key}
                            onClick={e => {
                                this.onClick(e, item);
                            }}
                            onKeyPress={e => this.handleItemEnterPress(e, item)}
                        >
                            <span className={`${prefixcls}-label`}>
                                {!multiple && this.renderIcon('empty')}
                                {multiple && (
                                    <Checkbox
                                        onChange={(e: CheckboxEvent) => this.onCheckboxChange(e, item)}
                                        disabled={disabled}
                                        indeterminate={halfCheckedKeys.has(item.key)}
                                        checked={checkedKeys.has(item.key)}
                                        className={`${prefixcls}-label-checkbox`}
                                    />
                                )}
                                {this.highlight(searchText)}
                            </span>
                        </li>
                    );
                })}
            </ul>
        );
        return content;
    };

    renderItem(renderData: Array<Entity>, content: Array<React.ReactNode> = []) {
        const { multiple, checkedKeys, halfCheckedKeys } = this.props;
        let showChildItem: Entity;
        const ind = content.length;
        content.push(
            <ul role='menu' className={`${prefixcls}-list`} key={renderData[0].key} onScroll={e => this.props.onListScroll(e, ind)}>
                {renderData.map(item => {
                    const { data, key, parentKey } = item;
                    const { children, label, disabled, isLeaf } = data;
                    const { active, selected, loading } = this.getItemStatus(key);
                    const hasChild = Boolean(children) && children.length;
                    const showExpand = hasChild || (this.props.loadData && !isLeaf);
                    if (active && hasChild) {
                        showChildItem = item;
                    }
                    const className = cls(prefixcls, {
                        [`${prefixcls}-active`]: active && !selected,
                        [`${prefixcls}-select`]: selected && !multiple,
                        [`${prefixcls}-disabled`]: disabled
                    });
                    const otherAriaProps = parentKey ? { ['aria-owns']: `cascaderItem-${parentKey}` } : {};
                    return (
                        <li
                            role='menuitem'
                            id={`cascaderItem-${key}`}
                            aria-expanded={active}
                            aria-haspopup={Boolean(showExpand)}
                            aria-disabled={disabled}
                            {...otherAriaProps}
                            className={className}
                            key={key}
                            onClick={e => {
                                this.onClick(e, item);
                            }}
                            onKeyPress={e => this.handleItemEnterPress(e, item)}
                            onMouseEnter={e => {
                                this.onHover(e, item);
                            }}
                        >
                            <span className={`${prefixcls}-label`}>
                                {selected && !multiple && this.renderIcon('tick')}
                                {!selected && !multiple && this.renderIcon('empty')}
                                {multiple && (
                                    <Checkbox
                                        onChange={(e: CheckboxEvent) => this.onCheckboxChange(e, item)}
                                        disabled={disabled}
                                        indeterminate={halfCheckedKeys.has(item.key)}
                                        checked={checkedKeys.has(item.key)}
                                        className={`${prefixcls}-label-checkbox`}
                                    />
                                )}
                                <span>{label}</span>
                            </span>
                            {showExpand ? this.renderIcon(loading ? 'loading' : 'child') : null}
                        </li>
                    );
                })}
            </ul>
        );
        if (showChildItem) {
            content.concat(this.renderItem(showChildItem.children, content));
        }
        return content;
    }

    renderEmpty() {
        const { emptyContent } = this.props;
        return (
            <LocaleConsumer componentName="Cascader">
                {(locale: Locale['Cascader']) => (
                    <ul className={`${prefixcls} ${prefixcls}-empty`} key={'empty-list'}>
                        <span className={`${prefixcls}-label`}>
                            {emptyContent || locale.emptyText}
                        </span>
                    </ul>
                )}
            </LocaleConsumer>
        );
    }

    render() {
        const { data, searchable } = this.props;
        const { direction } = this.context;
        const isEmpty = !data || !data.length;
        let content;
        const listsCls = cls({
            [`${prefixcls}-lists`]: true,
            [`${prefixcls}-lists-rtl`]: direction === 'rtl',
            [`${prefixcls}-lists-empty`]: isEmpty,
        });

        if (isEmpty) {
            content = this.renderEmpty();
        } else {
            content = searchable ?
                this.renderFlattenOption(data as Data[]) :
                this.renderItem(data as Entity[]);
        }
        return (
            <div className={listsCls}>
                {content}
            </div>
        );
    }
}

