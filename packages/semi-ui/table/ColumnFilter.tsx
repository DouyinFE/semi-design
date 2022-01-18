/* eslint-disable no-nested-ternary */
/* eslint-disable eqeqeq */
import React, { isValidElement } from 'react';
import cls from 'classnames';
import { noop } from 'lodash';
import { IconFilter } from '@douyinfe/semi-icons';

import { cssClasses } from '@douyinfe/semi-foundation/table/constants';

import Dropdown, { DropdownProps } from '../dropdown';
import { Trigger, Position } from '../tooltip';
import { Radio } from '../radio';
import { Checkbox } from '../checkbox';
import {
    FilterIcon,
    Filter,
    OnFilterDropdownVisibleChange,
    RenderFilterDropdownItem
} from './interface';

function renderDropdown(props: RenderDropdownProps = {}, nestedElem: React.ReactNode = null, level = 0) {
    const {
        filterMultiple = true,
        filters = [],
        filteredValue = [],
        filterDropdownVisible,
        onSelect = noop,
        onFilterDropdownVisibleChange = noop,
        trigger = 'click',
        position = 'bottom',
        renderFilterDropdownItem,
    } = props;

    const dropdownProps: DropdownProps = {
        ...props,
        onVisibleChange: (visible: boolean) => onFilterDropdownVisibleChange(visible),
        trigger,
        position,
        render: (
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
                        };

                        const checked = filteredValue.includes(filter.value);
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
                                    filteredValue,
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

                            item = renderDropdown(childrenDropdownProps, item, level + 1);
                        }
                        return item;
                    })}
            </Dropdown.Menu>
        ),
    };

    if (filterDropdownVisible != null) {
        dropdownProps.visible = filterDropdownVisible;
    }

    return (
        <Dropdown {...dropdownProps} key={`Dropdown_level_${level}`}>
            {nestedElem}
        </Dropdown>
    );
}

export interface ColumnFilterProps {
    prefixCls?: string;
    filteredValue?: any[];
    filterIcon?: FilterIcon;
    filterDropdown?: React.ReactElement;
    renderFilterDropdown?: (props: RenderDropdownProps, options: { iconElem: React.ReactNode }) => React.ReactElement;
    filterDropdownProps?: DropdownProps;
    onFilterDropdownVisibleChange?: OnFilterDropdownVisibleChange;
    onSelect?: (data: OnSelectData) => void;
}

export default function ColumnFilter(props: ColumnFilterProps = {}): React.ReactElement {
    const {
        prefixCls = cssClasses.PREFIX,
        filteredValue,
        filterIcon = 'filter',
        renderFilterDropdown,
        filterDropdownProps,
    } = props;
    let { filterDropdown = null } = props;

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
                <IconFilter
                    role="button"
                    aria-label="Filter data with this column"
                    aria-haspopup="listbox"
                    tabIndex={-1}
                    size="small"
                />
            </div>
        );
    }

    const renderProps = {
        ...props,
        ...filterDropdownProps,
    };

    filterDropdown = React.isValidElement<ColumnFilterProps>(filterDropdown) ?
        filterDropdown :
        typeof renderFilterDropdown === 'function' ?
            renderFilterDropdown(renderProps, { iconElem }) :
            renderDropdown(renderProps, iconElem);

    return filterDropdown;
}

export interface OnSelectData {
    value: any;
    filteredValue: any;
    included: boolean;
    domEvent: React.MouseEvent<HTMLElement>;
}

export interface RenderDropdownProps {
    filterMultiple?: boolean;
    filters?: Filter[];
    filteredValue?: any[];
    filterDropdownVisible?: boolean;
    onSelect?: (data: OnSelectData) => void;
    onFilterDropdownVisibleChange?: OnFilterDropdownVisibleChange;
    trigger?: Trigger;
    position?: Position;
    renderFilterDropdownItem?: RenderFilterDropdownItem;
}