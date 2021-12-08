/* eslint-disable max-len */
import React from 'react';
import BaseComponent from '../_base/baseComponent';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import { cssClasses } from '@douyinfe/semi-foundation/table/constants';
import TableSelectionCellFoundation, { TableSelectionCellAdapter, TableSelectionCellEvent } from '@douyinfe/semi-foundation/table/tableSelectionCellFoundation';

import { Checkbox, CheckboxEvent, CheckboxProps } from '../checkbox';

export interface TableSelectionCellProps {
    columnTitle?: string; // TODO: future api
    getCheckboxProps?: () => CheckboxProps;
    type?: string; // TODO: future api
    onChange?: (value: any, e: TableSelectionCellEvent) => void;
    selected?: boolean;
    disabled?: boolean;
    indeterminate?: boolean; // Intermediate state, shown as a solid horizontal line
    prefixCls?: string;
    className?: string;
    ariaLabel?: string;
}

/**
 * render selection cell
 */
export default class TableSelectionCell extends BaseComponent<TableSelectionCellProps, Record<string, any>> {
    static propTypes = {
        columnTitle: PropTypes.string,
        getCheckboxProps: PropTypes.func,
        type: PropTypes.string,
        onChange: PropTypes.func,
        selected: PropTypes.bool,
        disabled: PropTypes.bool,
        indeterminate: PropTypes.bool,
        prefixCls: PropTypes.string,
        className: PropTypes.string,
        ariaLabel: PropTypes.string,
    };

    static defaultProps = {
        disabled: false,
        onChange: noop,
        prefixCls: cssClasses.PREFIX,
    };

    get adapter(): TableSelectionCellAdapter {
        return {
            ...super.adapter,
            notifyChange: (...args) => this.props.onChange(...args),
        };
    }

    constructor(props: TableSelectionCellProps) {
        super(props);
        this.foundation = new TableSelectionCellFoundation(this.adapter);
    }

    handleChange = (e: CheckboxEvent) => this.foundation.handleChange(e);

    render() {
        const { selected, getCheckboxProps, indeterminate, disabled, prefixCls, className, ariaLabel } = this.props;
        let checkboxProps = {
            onChange: this.handleChange,
            disabled,
            indeterminate,
            checked: selected,
        };

        if (typeof getCheckboxProps === 'function') {
            checkboxProps = { ...checkboxProps, ...getCheckboxProps() };
        }

        const wrapCls = classnames(
            `${prefixCls}-selection-wrap`,
            {
                [`${prefixCls}-selection-disabled`]: disabled,
            },
            className
        );

        return (
            <span className={wrapCls}>
                <Checkbox ariaLabel={ariaLabel} {...checkboxProps} />
            </span>
        );
    }
}
