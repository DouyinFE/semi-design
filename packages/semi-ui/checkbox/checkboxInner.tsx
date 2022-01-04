/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { checkboxClasses as css } from '@douyinfe/semi-foundation/checkbox/constants';
import { Context } from './context';
import { IconCheckboxTick, IconCheckboxIndeterminate } from '@douyinfe/semi-icons';

export interface CheckboxInnerProps {
    indeterminate?: boolean;
    checked?: boolean;
    disabled?: boolean;
    prefixCls?: string;
    name?: string;
    isPureCardType?: boolean;
    ref?: React.MutableRefObject<CheckboxInner> | ((ref: CheckboxInner) => void);
    addonId?: string;
    extraId?: string;
    'aria-label'?: React.AriaAttributes['aria-label'];
}

class CheckboxInner extends PureComponent<CheckboxInnerProps> {
    static contextType = Context;

    static propTypes = {
        checked: PropTypes.bool,
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
        children: PropTypes.node,
        grouped: PropTypes.bool,
        value: PropTypes.any,
        isPureCardType: PropTypes.bool,
        addonId: PropTypes.string,
        extraId: PropTypes.string,
    };

    static defaultProps = {
        onChange: noop,
    };
    inputEntity: HTMLInputElement;

    blur() {
        this.inputEntity.blur();
    }

    focus() {
        this.inputEntity.focus();
    }

    render() {
        const { indeterminate, checked, disabled, prefixCls, name, isPureCardType, addonId, extraId } = this.props;
        const prefix = prefixCls || css.PREFIX;

        const wrapper = classnames(
            {
                [`${prefix}-inner`]: true,
                [`${prefix}-inner-checked`]: Boolean(checked),
                [`${prefix}-inner-pureCardType`]: isPureCardType,
            },
            css.WRAPPER
        );

        const inner = classnames({
            [`${prefix}-inner-display`]: true,
        });

        const icon = checked ? (
            <IconCheckboxTick />
        ) : indeterminate ? (
            <IconCheckboxIndeterminate />
        ) : null;

        return (
            <span className={wrapper}>
                <input
                    type="checkbox"
                    aria-label={this.props['aria-label']}
                    aria-disabled={disabled}
                    aria-checked={checked}
                    aria-labelledby={addonId}
                    aria-describedby={extraId}
                    ref={ref => {
                        this.inputEntity = ref;
                    }}
                    className={css.INPUT}
                    onChange={noop}
                    checked={checked}
                    disabled={disabled}
                    name={name}
                />
                <span className={inner}>{icon}</span>
            </span>
        );
    }
}

export default CheckboxInner;
