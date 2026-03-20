import React, { isValidElement, useEffect, useState } from 'react';
import cls from 'classnames';
import { isEqual, noop, pick } from 'lodash';
import { IconFilter } from '@douyinfe/semi-icons';

import { cssClasses } from '@douyinfe/semi-foundation/table/constants';

import Dropdown, { DropdownProps } from '../dropdown';
import { Radio } from '../radio';
import { Checkbox } from '../checkbox';
import Button from '../button';
import Space from '../space';
import LocaleConsumer from '../locale/localeConsumer';
import { Locale } from '../locale/interface';
import {
    FilterIcon,
    Filter,
    OnFilterDropdownVisibleChange,
    RenderFilterDropdownItem,
    FilterConfirmMode
} from './interface';

function renderDropdown(props: RenderDropdownProps, nestedElem: React.ReactNode = null, level = 0, locale?: Locale['Table']) {
    const {
        filterMultiple = true,
        filters = [],
        filteredValue = [],
        filterDropdownVisible,
        onSelect = noop,
        onFilterDropdownVisibleChange = noop,
        trigger = 'click',
        position = 'bottom',
        renderFilterDropdown,
        renderFilterDropdownItem,
        filterConfirmMode = 'immediate',
        tempFilteredValue,
        setTempFilteredValue,
        confirm,
        clear,
        close,
        reset,
    } = props ?? {};

    // Determine which value to use for displaying checked state
    // In confirm mode, use tempFilteredValue; otherwise use filteredValue
    const displayValue = filterConfirmMode === 'confirm' ? (tempFilteredValue ?? []) : filteredValue;

    const renderFilterDropdownProps: RenderFilterDropdownProps = pick(props, ['tempFilteredValue', 'setTempFilteredValue', 'confirm', 'clear', 'close', 'filters']);
    const render = typeof renderFilterDropdown === 'function' ? renderFilterDropdown(renderFilterDropdownProps) : (
        <Dropdown.Menu>
            {Array.isArray(filters) &&
                filters.map((filter, index) => {
                    const changeFn = (e: React.MouseEvent<HTMLLIElement>) => {
                        const domEvent = e && e.nativeEvent;
                        if (domEvent) {
                            // Block this event to prevent the pop-up layer from closing
                            domEvent.stopImmediatePropagation();

                            // Prevent bubbling and default events to prevent label click events from triggering twice
                            domEvent.stopPropagation();
                            domEvent.preventDefault();
                        }

                        // In confirm mode, update tempFilteredValue instead of calling onSelect
                        if (filterConfirmMode === 'confirm') {
                            const currentTempValue = tempFilteredValue ?? [...filteredValue];
                            let values = [...currentTempValue];

                            const included = values.includes(filter.value);
                            const idx = values.indexOf(filter.value);

                            if (idx > -1) {
                                values.splice(idx, 1);
                            } else if (filterMultiple) {
                                values.push(filter.value);
                            } else {
                                values = [filter.value];
                            }
                            
                            setTempFilteredValue?.(values);
                        } else {
                            // Immediate mode: original behavior
                            let values = [...filteredValue];

                            const included = values.includes(filter.value);
                            const idx = values.indexOf(filter.value);

                            if (idx > -1) {
                                values.splice(idx, 1);
                            } else if (filterMultiple) {
                                values.push(filter.value);
                            } else {
                                values = [filter.value];
                            }
                            return onSelect({
                                value: filter.value,
                                filteredValue: values,
                                included: !included,
                                domEvent,
                            });
                        }
                    };

                    const checked = displayValue.includes(filter.value);
                    const { text } = filter;
                    const { value } = filter;
                    const key = `${level}_${index}`;

                    const dropdownItem =
                        typeof renderFilterDropdownItem === 'function' ?
                            renderFilterDropdownItem({
                                onChange: changeFn,
                                filterMultiple,
                                value,
                                text,
                                checked,
                                filteredValue: displayValue,
                                level,
                            }) :
                            null;

                    let item =
                        dropdownItem && React.isValidElement(dropdownItem) ? (
                            React.cloneElement(dropdownItem, { key })
                        ) : (
                            <Dropdown.Item key={key} onClick={changeFn}>
                                {filterMultiple ? (
                                    <Checkbox checked={checked}>{text}</Checkbox>
                                ) : (
                                    <Radio checked={checked}>{text}</Radio>
                                )}
                            </Dropdown.Item>
                        );

                    if (Array.isArray(filter.children) && filter.children.length) {
                        const childrenDropdownProps = {
                            ...props,
                            filters: filter.children,
                            trigger: 'hover' as const,
                            position: 'right' as const,
                        };

                        delete childrenDropdownProps.filterDropdownVisible;

                        item = renderDropdown(childrenDropdownProps, item, level + 1, locale);
                    }
                    return item;
                })}
            {/* Show confirm and reset buttons in confirm mode */}
            {filterConfirmMode === 'confirm' && level === 0 && (
                <div style={{ padding: '8px 12px', borderTop: '1px solid var(--semi-color-border)', display: 'flex', justifyContent: 'flex-end' }}>
                    <Space>
                        <Button 
                            size="small" 
                            onClick={() => reset?.()}
                        >
                            {locale?.resetFilter || 'Reset'}
                        </Button>
                        <Button 
                            size="small" 
                            theme="solid" 
                            onClick={() => confirm?.({ closeDropdown: true })}
                        >
                            {locale?.confirmFilter || 'OK'}
                        </Button>
                    </Space>
                </div>
            )}
        </Dropdown.Menu>
    );

    // Extract filterDropdownVisible to avoid passing it twice
    const { filterDropdownVisible: _, ...restProps } = props;
    
    const dropdownProps: DropdownProps = {
        ...restProps,
        trigger,
        position,
        render,
        onVisibleChange: (visible: boolean) => onFilterDropdownVisibleChange(visible),
    };

    // Only set visible when it's controlled (not null/undefined)
    // This is important for confirm mode to work correctly
    if (filterDropdownVisible != null) {
        dropdownProps.visible = filterDropdownVisible;
    }

    return (
        <Dropdown {...dropdownProps} key={`Dropdown_level_${level}`} className={`${cssClasses.PREFIX}-column-filter-dropdown`}>
            {nestedElem}
        </Dropdown>
    );
}

export default function ColumnFilter(props: ColumnFilterProps = {}): React.ReactElement {
    const {
        prefixCls = cssClasses.PREFIX,
        filteredValue,
        filterIcon = 'filter',
        filterDropdownProps,
        onSelect,
        filterDropdownVisible,
        renderFilterDropdown,
        onFilterDropdownVisibleChange,
        filterConfirmMode = 'immediate'
    } = props;
    let { filterDropdown = null } = props;

    
    // custom filter related status
    const isFilterDropdownVisibleControlled = typeof filterDropdownVisible !== 'undefined';
    const isCustomFilterDropdown = typeof renderFilterDropdown === 'function';
    // In confirm mode, we also need to control the dropdown visible state
    const isCustomDropdownVisible = !isFilterDropdownVisibleControlled && (isCustomFilterDropdown || filterConfirmMode === 'confirm');
    const [tempFilteredValue, setTempFilteredValue] = useState<any[]>(filteredValue);
    // Store the initial filtered value when dropdown opens (for reset functionality)
    const [initialFilteredValue, setInitialFilteredValue] = useState<any[]>(filteredValue);
    const dropdownVisibleInitValue = isCustomDropdownVisible ? false : filterDropdownVisible;
    const [dropdownVisible, setDropdownVisible] = useState<boolean | undefined>(dropdownVisibleInitValue);

    useEffect(() => {
        if (typeof filterDropdownVisible !== 'undefined') {
            setDropdownVisible(filterDropdownVisible);
        }
    }, [filterDropdownVisible]);

    useEffect(() => {
        setTempFilteredValue(filteredValue);
    }, [filteredValue]);

    const confirm: RenderFilterDropdownProps['confirm'] = (props = {}) => {
        const newFilteredValue = props?.filteredValue || tempFilteredValue;
        if (!isEqual(newFilteredValue, filteredValue)) {
            onSelect({ filteredValue: newFilteredValue });
        }
        if (props.closeDropdown) {
            setDropdownVisible(false);
        }
    };

    const clear: RenderFilterDropdownProps['clear'] = (props: { closeDropdown?: boolean } = {}) => {
        setTempFilteredValue([]);
        onSelect({ filteredValue: [] });
        if (props.closeDropdown) {
            setDropdownVisible(false);
        }
    };

    const close: RenderFilterDropdownProps['close'] = () => {
        setDropdownVisible(false);
    };

    const reset: RenderFilterDropdownProps['reset'] = () => {
        setTempFilteredValue(initialFilteredValue);
    };

    const handleFilterDropdownVisibleChange = (visible: boolean) => {
        if (isCustomDropdownVisible) {
            setDropdownVisible(visible);
        }
        // When dropdown opens in confirm mode, save the initial filtered value for reset
        if (visible && filterConfirmMode === 'confirm') {
            setInitialFilteredValue(filteredValue);
            setTempFilteredValue(filteredValue);
        }
        onFilterDropdownVisibleChange(visible);
    };

    const renderFilterDropdownProps: RenderFilterDropdownProps = {
        tempFilteredValue,
        setTempFilteredValue,
        confirm,
        clear,
        close,
        reset,
        filters: props.filters
    };

    const finalCls = cls(`${prefixCls}-column-filter`, {
        on: Array.isArray(filteredValue) && filteredValue.length,
    });

    let iconElem;

    if (typeof filterIcon === 'function') {
        iconElem = filterIcon(Array.isArray(filteredValue) && filteredValue.length > 0);
    } else if (isValidElement(filterIcon)) {
        iconElem = filterIcon;
    } else {
        iconElem = (
            <div className={finalCls}>
                {'\u200b'/* ZWSP(zero-width space) */}
                <IconFilter
                    role="button"
                    aria-label="Filter data with this column"
                    aria-haspopup="listbox"
                    tabIndex={-1}
                    size="default"
                />
            </div>
        );
    }

    const renderProps = {
        ...props,
        ...filterDropdownProps,
        ...renderFilterDropdownProps,
        filterDropdownVisible: isFilterDropdownVisibleControlled ? filterDropdownVisible : dropdownVisible,
        onFilterDropdownVisibleChange: handleFilterDropdownVisibleChange,
    };

    return (
        <LocaleConsumer componentName="Table">
            {(locale: Locale['Table']) => {
                if (React.isValidElement<ColumnFilterProps>(filterDropdown)) {
                    return filterDropdown;
                }
                return renderDropdown(renderProps, iconElem, 0, locale);
            }}
        </LocaleConsumer>
    );
}

export interface ColumnFilterProps extends Omit<RenderDropdownProps, keyof RenderFilterDropdownProps> {
    prefixCls?: string;
    filteredValue?: any[];
    filterIcon?: FilterIcon;
    filterDropdown?: React.ReactElement;
    filterDropdownProps?: FilterDropdownProps;
    filters?: Filter[]
}

export interface RenderDropdownProps extends FilterDropdownProps, RenderFilterDropdownProps {
    filterMultiple?: boolean;
    filters?: Filter[];
    filteredValue?: any[];
    filterDropdownVisible?: boolean;
    onSelect?: (data: OnSelectData) => void;
    onFilterDropdownVisibleChange?: OnFilterDropdownVisibleChange;
    renderFilterDropdown?: (props: RenderFilterDropdownProps) => React.ReactNode;
    renderFilterDropdownItem?: RenderFilterDropdownItem;
    filterConfirmMode?: FilterConfirmMode;
}

export interface FilterDropdownProps extends Omit<DropdownProps, 'render' | 'onVisibleChange'> {}

export interface OnSelectData {
    value?: any;
    /** only this value is used now  */
    filteredValue: any;
    included?: boolean;
    domEvent?: React.MouseEvent<HTMLElement>
}

export interface RenderFilterDropdownProps {
    /** temporary filteredValue  */
    tempFilteredValue: any[];
    /** set temporary filteredValue  */
    setTempFilteredValue: (tempFilteredValue: any[]) => void;
    /** set tempFilteredValue to filteredValue. You can also pass filteredValue to directly set the filteredValue  */
    confirm: (props?: { closeDropdown?: boolean; filteredValue?: any[] }) => void;
    /** clear tempFilteredValue and filteredValue  */
    clear: (props?: { closeDropdown?: boolean }) => void;
    /** close dropdown  */
    close: () => void;
    /** reset tempFilteredValue to initial value when dropdown opened  */
    reset?: () => void;
    /** column filters  */
    filters?: RenderDropdownProps['filters']
}