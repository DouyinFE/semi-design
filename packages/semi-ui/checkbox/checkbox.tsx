/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { checkboxClasses as css } from '@douyinfe/semi-foundation/checkbox/constants';
import CheckboxFoundation, { CheckboxAdapter, BasicCheckboxEvent, BasicTargetObject, BaseCheckboxProps } from '@douyinfe/semi-foundation/checkbox/checkboxFoundation';
import CheckboxInner from './checkboxInner';
import BaseComponent from '../_base/baseComponent';
import '@douyinfe/semi-foundation/checkbox/checkbox.scss';
import { Context, CheckboxContextType } from './context';
import { isUndefined, isBoolean, noop } from 'lodash';
import { getUuidShort } from '@douyinfe/semi-foundation/utils/uuid';
export type CheckboxEvent = BasicCheckboxEvent;
export type TargetObject = BasicTargetObject;

export interface CheckboxProps extends BaseCheckboxProps {
    'aria-describedby'?: React.AriaAttributes['aria-describedby'];
    'aria-errormessage'?: React.AriaAttributes['aria-errormessage'];
    'aria-invalid'?: React.AriaAttributes['aria-invalid'];
    'aria-labelledby'?: React.AriaAttributes['aria-labelledby'];
    'aria-required'?: React.AriaAttributes['aria-required'];
    children?: React.ReactNode | undefined;
    onChange?: (e: CheckboxEvent) => any;
    // TODO, docs
    style?: React.CSSProperties;
    onMouseEnter?: React.MouseEventHandler<HTMLSpanElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLSpanElement>;
    extra?: React.ReactNode;
    'aria-label'?: React.AriaAttributes['aria-label'];
    role?: React.HTMLAttributes<HTMLSpanElement>['role']; // a11y: wrapper role
    tabIndex?: number; // a11y: wrapper tabIndex
    addonId?: string;
    extraId?: string;
}
interface CheckboxState {
    checked: boolean;
    addonId?: string;
    extraId?: string;
}
class Checkbox extends BaseComponent<CheckboxProps, CheckboxState> {
    static contextType = Context;

    static propTypes = {
        'aria-describedby': PropTypes.string,
        'aria-errormessage': PropTypes.string,
        'aria-invalid': PropTypes.bool,
        'aria-labelledby': PropTypes.string,
        'aria-required': PropTypes.bool,
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
        index: PropTypes.number,
        'aria-label': PropTypes.string,
        tabIndex: PropTypes.number,
    };

    static defaultProps = {
        defaultChecked: false,
        indeterminate: false,
        onChange: noop,
        onMouseEnter: noop,
        onMouseLeave: noop,
    };
    checkboxEntity: CheckboxInner;
    context: CheckboxContextType;

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
            getGroupDisabled: () => (this.context && this.context.checkboxGroup.disabled),
            setAddonId: () => {
                this.setState({ addonId: getUuidShort({ prefix: 'addon' }) });
            },
            setExtraId: () => {
                this.setState({ extraId: getUuidShort({ prefix: 'extra' }) });
            }
        };
    }

    foundation: CheckboxFoundation;
    addonId: string;
    extraId: string;
    constructor(props: CheckboxProps) {
        super(props);

        const checked = false;

        this.state = {
            checked: props.checked || props.defaultChecked || checked,
            addonId: props.addonId,
            extraId: props.extraId,
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
        return Boolean(this.context && this.context.checkboxGroup);
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
            role,
            tabIndex,
            id
        } = this.props;
        const { checked, addonId, extraId } = this.state;
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
            props['name'] = this.context.checkboxGroup.name;
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
            [`${prefix}-cardType_checked_disabled`]: props.isCardType && props.checked && props.disabled,
            [className]: Boolean(className),
        });

        const extraCls = classnames(`${prefix}-extra`, {
            [`${prefix}-cardType_extra_noChildren`]: props.isCardType && !children,
        });

        const renderContent = () => (
            <>
                {children ? <span id={addonId} className={`${prefix}-addon`}>{children}</span> : null}
                {extra ? <div id={extraId} className={extraCls}>{extra}</div> : null}
            </>
        );
        return (
            // label is better than span, however span is here which is to solve gitlab issue #364
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
            <span
                role={role}
                tabIndex={tabIndex}
                style={style}
                className={wrapper}
                id={id}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={this.handleChange}
                onKeyPress={this.handleEnterPress}
                aria-labelledby={this.props['aria-labelledby']}
            >
                <CheckboxInner
                    {...this.props}
                    {...props}
                    addonId={children && this.addonId}
                    extraId={extra && this.extraId}
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