/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { checkboxClasses as css } from '@douyinfe/semi-foundation/checkbox/constants';
import CheckboxFoundation, { CheckboxAdapter, BasicCheckboxEvent, BasicTargetObject, BaseCheckboxProps } from '@douyinfe/semi-foundation/checkbox/checkboxFoundation';
import CheckboxInner from './checkboxInner';
import BaseComponent from '../_base/baseComponent';
import '@douyinfe/semi-foundation/checkbox/checkbox.scss';
import { Context } from './context';
import { isUndefined, isBoolean, noop } from 'lodash-es';
export type CheckboxEvent = BasicCheckboxEvent;
export type TargetObject = BasicTargetObject;

export interface CheckboxProps extends BaseCheckboxProps {
    onChange?: (e: CheckboxEvent) => any;
    // TODO, docs
    style?: React.CSSProperties;
    onMouseEnter?: React.MouseEventHandler<HTMLSpanElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLSpanElement>;
    extra?: React.ReactNode;
}
interface CheckboxState {
    checked: boolean;
}
class Checkbox extends BaseComponent<CheckboxProps, CheckboxState> {
    static contextType = Context;

    static propTypes = {
        // Specifies whether it is currently selected
        checked: PropTypes.bool,
        // Initial check
        defaultChecked: PropTypes.bool,
        // Failure state
        disabled: PropTypes.bool,
        // Set indeterminate state, only responsible for style control
        indeterminate: PropTypes.bool,
        // Callback function when changing
        onChange: PropTypes.func,
        value: PropTypes.any,
        style: PropTypes.object,
        className: PropTypes.string,
        prefixCls: PropTypes.string,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
        extra: PropTypes.node,
        addonId: PropTypes.string, // A11y aria-labelledby
        extraId: PropTypes.string, // A11y aria-describedby
        index: PropTypes.number,
    };

    static defaultProps = {
        defaultChecked: false,
        indeterminate: false,
        onChange: noop,
        onMouseEnter: noop,
        onMouseLeave: noop,
    };
    checkboxEntity: CheckboxInner;

    get adapter(): CheckboxAdapter<CheckboxProps, CheckboxState> {
        return {
            ...super.adapter,
            setNativeControlChecked: checked => {
                this.setState({ checked });
            },
            notifyChange: cbContent => {
                const { onChange } = this.props;
                onChange && onChange(cbContent);
            },
            getIsInGroup: () => this.isInGroup(),
            getGroupValue: () => (this.context && this.context.checkboxGroup.value) || [],
            notifyGroupChange: cbContent => {
                this.context.checkboxGroup.onChange(cbContent);
            },
            getGroupDisabled: () => (this.context && this.context.checkboxGroup.disabled)
        };
    }

    foundation: CheckboxFoundation;
    constructor(props: CheckboxProps) {
        super(props);

        const checked = false;

        this.state = {
            checked: props.checked || props.defaultChecked || checked,
        };

        this.checkboxEntity = null;
        this.foundation = new CheckboxFoundation(this.adapter);
    }

    componentDidUpdate(prevProps: CheckboxProps) {
        if (this.props.checked !== prevProps.checked) {
            if (isUndefined(this.props.checked)) {
                this.foundation.setChecked(false);
            } else if (isBoolean(this.props.checked)) {
                this.foundation.setChecked(this.props.checked);
            }
        }
    }

    isInGroup() {
        return this.context && this.context.checkboxGroup;
    }

    focus() {
        this.checkboxEntity && this.checkboxEntity.focus();
    }

    blur() {
        this.checkboxEntity && this.checkboxEntity.blur();
    }

    handleChange: React.MouseEventHandler<HTMLSpanElement> = e => this.foundation.handleChange(e);

    handleEnterPress = (e: React.KeyboardEvent<HTMLSpanElement>) => this.foundation.handleEnterPress(e);

    render() {
        const {
            disabled,
            style,
            prefixCls,
            className,
            indeterminate,
            children,
            onMouseEnter,
            onMouseLeave,
            extra,
            value,
            addonId,
            extraId
        } = this.props;
        const { checked } = this.state;
        const props: Record<string, any> = {
            checked,
            disabled,
        };

        const inGroup = this.isInGroup();
        if (inGroup) {
            if (this.context.checkboxGroup.value) {
                const realChecked = (this.context.checkboxGroup.value || []).includes(value);
                props.checked = realChecked;
            }
            if (this.context.checkboxGroup.disabled) {
                props.disabled = this.context.checkboxGroup.disabled || this.props.disabled;
            }
            const { isCardType, isPureCardType } = this.context.checkboxGroup;
            props.isCardType = isCardType;
            props.isPureCardType = isPureCardType;
        }

        const prefix = prefixCls || css.PREFIX;

        const wrapper = classnames(prefix, {
            [`${prefix}-disabled`]: props.disabled,
            [`${prefix}-indeterminate`]: indeterminate,
            [`${prefix}-checked`]: props.checked,
            [`${prefix}-unChecked`]: !props.checked,
            [`${prefix}-cardType`]: props.isCardType,
            [`${prefix}-cardType_disabled`]: props.disabled && props.isCardType,
            [`${prefix}-cardType_unDisabled`]: !(props.disabled && props.isCardType),
            [`${prefix}-cardType_checked`]: props.isCardType && props.checked && !props.disabled,
            [className]: Boolean(className),
        });

        const extraCls = classnames(`${prefix}-extra`, {
            [`${prefix}-cardType_extra_noChildren`]: props.isCardType && !children,
        });

        const name = inGroup && this.context.checkboxGroup.name;

        const renderContent = () => (
            <>
                {children ? <span id={addonId} className={`${prefix}-addon`}>{children}</span> : null}
                {extra ? <div id={extraId} className={extraCls}>{extra}</div> : null}
            </>
        );
        return (
            <span
                role='checkbox'
                tabIndex={disabled ? -1 : 0}
                aria-disabled={props.checked}
                aria-checked={props.checked}
                aria-labelledby={addonId}
                aria-describedby={extraId}
                style={style}
                className={wrapper}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={this.handleChange}
                onKeyPress={this.handleEnterPress}
            >
                <CheckboxInner
                    {...this.props}
                    {...props}
                    name={name}
                    isPureCardType={props.isPureCardType}
                    ref={ref => {
                        this.checkboxEntity = ref;
                    }}
                />
                {
                    props.isCardType ?
                        <div>{renderContent()}</div> :
                        renderContent()
                }
            </span>
        );
    }
}


export default Checkbox;