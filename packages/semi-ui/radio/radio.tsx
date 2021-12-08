/* eslint-disable prefer-destructuring */
import React from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import { noop } from 'lodash';

import RadioFoundation, { RadioAdapter } from '@douyinfe/semi-foundation/radio/radioFoundation';
import { RadioChangeEvent } from '@douyinfe/semi-foundation/radio/radioInnerFoundation';
import { strings, radioClasses as css } from '@douyinfe/semi-foundation/radio/constants';
import '@douyinfe/semi-foundation/radio/radio.scss';

import BaseComponent from '../_base/baseComponent';
import RadioInner from './radioInner';
import Context, { RadioContextValue, RadioMode } from './context';

export type RadioDisplayMode = 'vertical' | '';
export type RadioType =
    typeof strings.TYPE_DEFAULT |
    typeof strings.TYPE_BUTTON |
    typeof strings.TYPE_CARD |
    typeof strings.TYPE_PURECARD;

export type RadioProps = {
    autoFocus?: boolean;
    checked?: boolean;
    defaultChecked?: boolean;
    value?: string | number;
    disabled?: boolean;
    prefixCls?: string;
    displayMode?: RadioDisplayMode;
    onChange?: (e: RadioChangeEvent) => void;
    onMouseEnter?: (e: React.MouseEvent<HTMLLabelElement>) => void;
    onMouseLeave?: (e: React.MouseEvent<HTMLLabelElement>) => void;
    mode?: RadioMode;
    extra?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    addonStyle?: React.CSSProperties;
    addonClassName?: string;
    type?: RadioType;
};

export interface RadioState {
    hover?: boolean;
}

export { RadioChangeEvent };

class Radio extends BaseComponent<RadioProps, RadioState> {
    static contextType = Context;

    static propTypes = {
        autoFocus: PropTypes.bool,
        checked: PropTypes.bool,
        defaultChecked: PropTypes.bool,
        value: PropTypes.any, // Compare according to value to determine whether to select
        style: PropTypes.object,
        className: PropTypes.string,
        disabled: PropTypes.bool,
        prefixCls: PropTypes.string,
        displayMode: PropTypes.oneOf<RadioDisplayMode>(['vertical', '']),
        onChange: PropTypes.func,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
        mode: PropTypes.oneOf(strings.MODE),
        extra: PropTypes.node, // extra info
        addonStyle: PropTypes.object,
        addonClassName: PropTypes.string,
        type: PropTypes.oneOf([strings.TYPE_DEFAULT, strings.TYPE_BUTTON, strings.TYPE_CARD, strings.TYPE_PURECARD]), // Button style type
    };

    static defaultProps: Partial<RadioProps> = {
        autoFocus: false,
        defaultChecked: false,
        value: undefined as undefined,
        style: undefined as undefined,
        onMouseEnter: noop,
        onMouseLeave: noop,
        mode: '',
        type: 'default'
    };

    radioEntity: RadioInner;
    context!: RadioContextValue;
    foundation: RadioFoundation;

    constructor(props: RadioProps) {
        super(props);
        this.state = {
            hover: false,
        };
        this.foundation = new RadioFoundation(this.adapter);
        this.radioEntity = null;
    }

    get adapter(): RadioAdapter {
        return {
            ...super.adapter,
            setHover: (hover: boolean) => {
                this.setState({ hover });
            }
        };
    }

    isInGroup() {
        // eslint-disable-next-line react/destructuring-assignment
        return this.context && this.context.radioGroup;
    }

    focus() {
        this.radioEntity.focus();
    }

    blur() {
        this.radioEntity.blur();
    }

    onChange = (e: RadioChangeEvent) => {
        const { onChange } = this.props;
        if (this.isInGroup()) {
            const { radioGroup } = this.context;
            radioGroup.onChange && radioGroup.onChange(e);
        }
        onChange && onChange(e);
    };

    handleMouseEnter = (e: React.MouseEvent<HTMLLabelElement>) => {
        this.props.onMouseEnter(e);
        this.foundation.setHover(true);
    };

    handleMouseLeave = (e: React.MouseEvent<HTMLLabelElement>) => {
        this.props.onMouseLeave(e);
        this.foundation.setHover(false);
    };

    render() {
        const {
            addonClassName,
            addonStyle,
            checked,
            disabled,
            style,
            className,
            prefixCls,
            displayMode,
            children,
            extra,
            mode,
            type,
            value: propValue
        } = this.props;

        let realChecked,
            isDisabled,
            realMode,
            isButtonRadioGroup,
            isCardRadioGroup,
            isPureCardRadioGroup,
            isButtonRadioComponent,
            buttonSize,
            realPrefixCls;
        const isHover = this.state.hover;
        let props = {};

        if (this.isInGroup()) {
            realChecked = this.context.radioGroup.value === propValue;
            isDisabled = disabled || this.context.radioGroup.disabled;
            realMode = this.context.mode;
            isButtonRadioGroup = this.context.radioGroup.isButtonRadio;
            isCardRadioGroup = this.context.radioGroup.isCardRadio;
            isPureCardRadioGroup = this.context.radioGroup.isPureCardRadio;
            buttonSize = this.context.radioGroup.buttonSize;
            realPrefixCls = prefixCls || this.context.radioGroup.prefixCls;
            props = { checked: realChecked, disabled: isDisabled };
        } else {
            realChecked = checked;
            isDisabled = disabled;
            realMode = mode;
            isButtonRadioComponent = type === 'button';
            realPrefixCls = prefixCls;
        }
        const isButtonRadio = typeof isButtonRadioGroup === 'undefined' ? isButtonRadioComponent : isButtonRadioGroup;

        const prefix = realPrefixCls || css.PREFIX;

        const wrapper = cls(prefix, {
            [`${prefix}-disabled`]: isDisabled,
            [`${prefix}-checked`]: realChecked,
            [`${prefix}-${displayMode}`]: Boolean(displayMode),
            [`${prefix}-buttonRadioComponent`]: isButtonRadioComponent,
            [`${prefix}-buttonRadioGroup`]: isButtonRadioGroup,
            [`${prefix}-buttonRadioGroup-${buttonSize}`]: isButtonRadioGroup && buttonSize,
            [`${prefix}-cardRadioGroup`]: isCardRadioGroup,
            [`${prefix}-cardRadioGroup_disabled`]: isDisabled && isCardRadioGroup,
            [`${prefix}-cardRadioGroup_checked`]: isCardRadioGroup && realChecked && !isDisabled,
            [`${prefix}-cardRadioGroup_hover`]: isCardRadioGroup && !realChecked && isHover && !isDisabled,
            [className]: Boolean(className),
        });

        const name = this.isInGroup() && this.context.radioGroup.name;
        const addonCls = cls({
            [`${prefix}-addon`]: !isButtonRadio,
            [`${prefix}-addon-buttonRadio`]: isButtonRadio,
            [`${prefix}-addon-buttonRadio-checked`]: isButtonRadio && realChecked,
            [`${prefix}-addon-buttonRadio-disabled`]: isButtonRadio && isDisabled,
            [`${prefix}-addon-buttonRadio-hover`]: isButtonRadio && !realChecked && !isDisabled && isHover,
            [`${prefix}-addon-buttonRadio-${buttonSize}`]: isButtonRadio && buttonSize,
        }, addonClassName);
        const renderContent = () => (
            <>
                {children ? <span className={addonCls} style={addonStyle}>{children}</span> : null}
                {extra && !isButtonRadio ? <div className={`${prefix}-extra`}>{extra}</div> : null}
            </>
        );
        return (
            <label
                style={style}
                className={wrapper}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                <RadioInner
                    {...this.props}
                    {...props}
                    mode={realMode}
                    name={name}
                    isButtonRadio={isButtonRadio}
                    isPureCardRadioGroup={isPureCardRadioGroup}
                    onChange={this.onChange}
                    ref={(ref: RadioInner) => {
                        this.radioEntity = ref;
                    }}
                />
                {
                    isCardRadioGroup ?
                        <div className={`${prefix}-isCardRadioGroup_content`}>{renderContent()}</div> :
                        renderContent()
                }
            </label>
        );
    }
}

export default Radio;